const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

const Note = require('../models/Note.model');

// READ notes with status "active", also providing userDetails and notes (of the current user)
router.get("/notes/list", isLoggedIn, (req, res, next) => {
  const userDetails = req.session.currentUser;
  const userId = req.session.currentUser._id;

  Note.find({ user: userId, status: 'active' })
    .then((notes) => {
      res.render("notes/note-list", { userDetails, notes });
    })
    .catch((error) => next(error));
});

// READ notes with status "deleted" in a view called "trash"
router.get('/notes/trash', isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;

  Note.find({ user: userId, status: 'deleted' })
    .then((deletedNotes) => {
      res.render('notes/trash', { deletedNotes });
    })
    .catch((error) => next(error));
});

// CREATE new note > display form
router.get("/notes/create", isLoggedIn, (req, res, next) => {
  res.render("notes/note-create");
});

// CREATE new note > post into DB ensuring that optional fields that are empty are not to store with value 'undefined'
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

// SOFT-DELETE note from database by updating status to "deleted" 
router.post('/notes/:noteId/delete', isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findByIdAndUpdate(noteId, { status: 'deleted' })
    .then(() => res.redirect('/notes/list'))
    .catch((error) => next(error));
});

// UPDATE note and see details > render view with current values
router.get('/notes/:noteId/edit', isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findById(noteId)
    .then((note) => {
      res.render('notes/note-details', { note });
    })
    .catch((error) => next(error));
});

// UPDATE note and see details > process update ensuring empty optional fields not stored as 'undefined'
router.post('/notes/:noteId/edit', isLoggedIn, (req, res, next) => {
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
