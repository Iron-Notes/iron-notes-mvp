const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

const Note = require('../models/Note.model');

// GET /notes/list
router.get("/notes/list", isLoggedIn, (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.render("notes/note-list", { userDetails });
  }
});

// CREATE new note / display form
router.get("/notes/create", isLoggedIn, (req, res, next) => {
  res.render("notes/note-create");
});

// CREATE new note / process form
router.post("/notes/create", isLoggedIn, (req, res, next) => {
  const {
    title,
    description,
    checklist,
    label,
    backgroundColor,
    image
  } = req.body;

  const userId = req.session.currentUser._id;

  const newNote = {
    title,
    description,
    user: userId
  };

  if (checklist) {
    newNote.checklist = checklist;
  }

  if (label) {
    newNote.label = label;
  }

  if (backgroundColor) {
    newNote.backgroundColor = backgroundColor;
  }

  if (image) {
    newNote.image = image;
  }

  Note.create(newNote)
    .then((newNote) => {
      res.redirect("/notes/list");
    })
    .catch((e) => {
      console.log("Error creating new note", e);
      next(e);
    });
});

// DELETE note from database
router.post('/notes/:noteId/delete', isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findByIdAndDelete(noteId)
      .then(() => res.redirect('/notes/list'))
      .catch(error => next(error));
});

// UPDATE note and see details / render view
router.get('/notes/:noteId', isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findById(noteId)
    .then((note) => {
      res.render('notes/note-details', { note });
    })
    .catch((error) => next(error));
});

// UPDATE note and see details / process update
router.post('/notes/:noteId', isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;
  const { title, description, status, checklist, label, backgroundColor, image } = req.body;

  const updateFields = {
    title,
    description,
    status,
    backgroundColor
  };

  if (checklist) {
    updateFields.checklist = checklist;
  }

  if (label) {
    updateFields.label = label;
  }

  if (image) {
    updateFields.image = image;
  }

  Note.findByIdAndUpdate(noteId, updateFields, {new: true})
    .then(() => res.redirect('/notes/list'))
    .catch((error) => next(error));
});



module.exports = router;
