const router = require("express").Router();
const path = require("path");

// http://localhost:3001/notes
router.get("/notes", (req, res) => {
    console.log("Serving notes.html");
    res.sendFile(path.join(__dirname, "../../public/notes.html"), (err) => {
        if (err) {
            console.log("Error serving notes.html:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

// http://localhost:3001/*
router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;




module.exports=router;
