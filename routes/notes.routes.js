const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /notes/list
router.get("/notes/list", isLoggedIn, (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.render("notes/note-list", { userDetails });
  }
});

module.exports = router;
