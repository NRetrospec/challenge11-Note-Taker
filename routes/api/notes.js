const router = require("express").Router();
const fs = require("fs");

// http://localhost:3001/api/notes/
router.get("/", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        const notes = JSON.parse(data);
        res.json(notes);
    });
});

// http://localhost:3001/api/notes/
router.post("/", (req, res) => {
    const newNote = req.body;

    // Read existing notes
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        const notes = JSON.parse(data);
        // Assign an ID to the new note
        newNote.id = (notes.length + 1).toString();
        notes.push(newNote);

        console.log("Current notes before saving:", notes); // Log current notes
        // Write the updated notes back to the file
        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(newNote);
        });
    });
});

// http://localhost:3001/api/notes/:id
router.delete("/:id", (req, res) => {
    const noteId = req.params.id;

    // Read existing notes
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        let notes = JSON.parse(data);
        // Filter out the note with the specified ID
        notes = notes.filter(note => note.id !== noteId);

        // Write the updated notes back to the file
        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(204).send(); // Send a No Content response
        });
    });
});

module.exports = router;