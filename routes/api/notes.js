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

        // Write the updated notes back to the file
        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(newNote);
        });
    });
});

module.exports = router;
