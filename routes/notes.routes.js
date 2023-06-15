const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Note = require("../models/Note.model");
const fileUploader = require("../config/cloudinary.config");

// READ notes with status "active", also providing userDetails and notes (of the current user)
router.get("/notes/list", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  let keyword = req.query.keyword;

  Note.find()
    .then((notes) => {
      let filteredNotes = [];
      if (keyword) {
        notes.forEach((note) => {
          if (
            note.title.includes(keyword) &&
            note.user == userId &&
            note.status === "active"
          ) {
            filteredNotes.push(note);
          }
        });
      } else {
        filteredNotes = notes.filter(
          (note) => note.user == userId && note.status === "active"
        );
      }
      return filteredNotes;
    })
    .then((notes) => {
      const userDetails = req.session.currentUser;
      res.render("notes/note-list", { userDetails, notes });
    })
    .catch((error) => next(error));
});

// READ notes with status "deleted" in a view called "trash"
router.get("/notes/trash", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  let keyword = req.query.keyword;

  Note.find()
    .then((notes) => {
      let filteredNotes = [];
      if (keyword) {
        notes.forEach((note) => {
          if (
            note.title.includes(keyword) &&
            note.user == userId &&
            note.status === "deleted"
          ) {
            filteredNotes.push(note);
          }
        });
      } else {
        filteredNotes = notes.filter(
          (note) => note.user == userId && note.status === "deleted"
        );
      }
      return filteredNotes;
    })
    .then((deletedNotes) => {
      const userDetails = req.session.currentUser;
      res.render("notes/note-trash", { userDetails, deletedNotes });
    })
    .catch((error) => next(error));
});

// READ notes with status "archived" in a view called "archive"
router.get("/notes/archive", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  let keyword = req.query.keyword;

  Note.find()
    .then((notes) => {
      let filteredNotes = [];
      if (keyword) {
        notes.forEach((note) => {
          if (
            note.title.includes(keyword) &&
            note.user == userId &&
            note.status === "archived"
          ) {
            filteredNotes.push(note);
          }
        });
      } else {
        filteredNotes = notes.filter(
          (note) => note.user == userId && note.status === "archived"
        );
      }
      return filteredNotes;
    })
    .then((notes) => {
      const userDetails = req.session.currentUser;
      res.render("notes/note-archive", { userDetails, notes });
    })
    .catch((error) => next(error));
});

// CREATE new note > post into DB ensuring that optional fields that are empty are not to store with value 'undefined'
router.post(
  "/notes/create",
  isLoggedIn,
  fileUploader.single("note-image"),
  (req, res, next) => {
    const { title, description, checklist, label, backgroundColor } = req.body;

    const userId = req.session.currentUser._id;

    const newNote = {
      title,
      description,
      user: userId,
    };

    if (req.file) {
      newNote.imageURL = req.file.path;
    }

    if (checklist) {
      newNote.checklist = checklist;
    }

    if (label) {
      newNote.label = label;
    }

    if (backgroundColor) {
      newNote.backgroundColor = backgroundColor;
    }

    Note.create(newNote)
      .then((newNote) => {
        res.redirect("/notes/list");
      })
      .catch((e) => {
        console.log("Error creating new note", e);
        next(e);
      });
  }
);

// SOFT-DELETE note from database by updating status to "deleted"
router.post("/notes/:noteId/delete", isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findByIdAndUpdate(noteId, { status: "deleted" })
    .then(() => res.redirect("back"))
    .catch((error) => next(error));
});

// ARCHIVE note by updating status to "archived"
router.post("/notes/:noteId/archive", isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findByIdAndUpdate(noteId, { status: "archived" })
    .then(() => res.redirect("back"))
    .catch((error) => next(error));
});

// RESTORE archived/deleted note from by setting it "active"
router.post("/notes/:noteId/restore", isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findByIdAndUpdate(noteId, { status: "active" })
    .then(() => res.redirect("back"))
    .catch((error) => next(error));
});

// RESTORE all archived notes by setting status to active
router.post("/notes/restoreArchived", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  const condition = {
    user: userId,
    status: "archive",
  };
  Note.updateMany({ condition, status: "active" })
    .then(() => res.redirect("/notes/list"))
    .catch((error) => next(error));
});

// HARD-DELETE just one note
router.post("/notes/:noteId/deleteone", isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findByIdAndDelete(noteId)
    .then(() => res.redirect("/notes/trash"))
    .catch((error) => next(error));
});

// HARD-DELETE notes with status "deleted" > via "empty trash" button
router.post("/notes/emptyTrash", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;

  Note.deleteMany({ user: userId, status: "deleted" })
    .then(() => res.redirect("/notes/list"))
    .catch((error) => next(error));
});

// UPDATE note and see details > render view with current values
router.get("/notes/:noteId/edit", isLoggedIn, (req, res, next) => {
  const { noteId } = req.params;

  Note.findById(noteId)
    .then((note) => {
      res.render("notes/note-details", { note });
    })
    .catch((error) => next(error));
});

// UPDATE note and see details > process update ensuring empty optional fields not stored as 'undefined'
router.post(
  "/notes/:noteId/edit",
  isLoggedIn,
  fileUploader.single("note-image"),
  (req, res, next) => {
    const { noteId } = req.params;
    const {
      title,
      description,
      status,
      checklist,
      label,
      backgroundColor,
      existingImage,
    } = req.body;

    const updateFields = {
      title,
      description,
      status,
      backgroundColor,
    };

    if (req.file) {
      updateFields.imageURL = req.file.path;
    } else {
      updateFields.imageURL = existingImage;
    }

    if (checklist) {
      updateFields.checklist = checklist;
    }

    if (label) {
      updateFields.label = label;
    }

    Note.findByIdAndUpdate(noteId, updateFields, { new: true })
      .then(() => res.redirect("back"))
      .catch((error) => next(error));
  }
);

module.exports = router;