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
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  res.json(database);
}); 

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", function(req, res) {
  const newNote = req.body;
  database.push(newNote);

  for (i of database) {
    i.id = database.indexOf(i) + 1;
  }

  console.log(database);
  res.send(database);
}); 

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
