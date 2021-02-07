// Dependencies
const express = require("express");
const path = require("path");
const database = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.json(database);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", function (req, res) {
  // Post new note in database
  const newNote = req.body;
  database.push(newNote);

  // Assign id's to all notes
  for (i of database) {
    i.id = database.indexOf(i) + 1;
  }
  res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
// Loop through database and delete note with matching id
  for (i of database) {
    if (parseInt(i.id) === parseInt(req.params.id)) {
      database.splice(req.params.id - 1, 1);
    }
  }
// Re-assign new id's to all notes
  for (i of database) {
    i.id = database.indexOf(i) + 1;
  }
  res.json(database);
});

// Listener
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
