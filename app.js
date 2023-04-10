const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/notesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define note schema
const noteSchema = new mongoose.Schema({
  email: String,
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

// Create note model
const Note = mongoose.model("Note", noteSchema);

// Routes
app.get("/", (req, res) => {
  res.redirect("/notes");
});

// Index route
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find({});
    res.render("notes.ejs", { notes: notes });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// Create route
app.post("/notes", async (req, res) => {
  try {
    const note = new Note({
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
    });
    await note.save();
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// Delete route
app.delete("/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    console.log(deletedNote);
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// Delete all notes by email
app.post("/notes/delete", async (req, res) => {
    try {
      const deletedNotes = await Note.deleteMany({ email: req.body.email });
      console.log(deletedNotes);
      res.redirect("/notes");
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  });



// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
