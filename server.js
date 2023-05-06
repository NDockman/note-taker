
const express = require("express");
const path = require("path");
const {v4: uuidv4} = require("uuid");
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

//sets the page to index.html when on the  /  route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

//sets the page to notes.html when on the  /notes  route
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

//parses and displays the contents of db.json when on the  /api/notes  route
app.get("/api/notes", (req, res) => {
    fs.readFile("db/db.json", "utf8", (error, data) => {
        error ? console.log(error) : res.json(JSON.parse(data))
    })
});

//creates a post when on the  /api/notes  route
//declares three variables using the request: title, text, and createdNote
app.post("/api/notes", (req, res) => {
    var title = req.body.title
    var text = req.body.text
    var createdNote = {
        title,
        text,
        id: uuidv4()
    }
    //adds the created note to the parsed contents of db.json
    fs.readFile("db/db.json", "utf8", (error, data) => {
        var notes = JSON.parse(data)
        notes.push(createdNote)
        //stringifies the notes and rewrites db.json
        fs.writeFile("db/db.json", JSON.stringify(notes), (error) => {
            error ? console.log(error) : console.log(createdNote.title + " has been created!")
        })
        res.sendFile(path.join(__dirname, "public/notes.html"))
    })
});


//creates listener on port 3001
app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`)
});