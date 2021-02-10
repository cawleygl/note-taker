// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

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
  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return
    }
    res.send(JSON.parse(data));
  });

});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", function (req, res) {
  const newNote = req.body;

  // Get data from db.json
  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return
    }
    const database = JSON.parse(data);

    // Assign unique id to new note
    newNote.id = database.length + 1
    database.push(newNote);

    // Write to db.json and return newNote
    fs.writeFile("./db/db.json", JSON.stringify(database), function (err) {
      if (err) throw err;
      res.send(newNote);
    });
  });
});

app.delete("/api/notes/:id", function (req, res) {
  // Get data from db.json
  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return
    }
    const database = JSON.parse(data);

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

    // Write back to db.json and return data
    fs.writeFile("./db/db.json", JSON.stringify(database), function (err) {
      if (err) throw err;
      res.send(database);
    });
  });
});

// Listener
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
