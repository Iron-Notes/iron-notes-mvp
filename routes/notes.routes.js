const express = require("express");
const router = express.Router();

// GET /notes/list
router.get("/notes/list", (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.render("notes/note-list", { userDetails });
  }
});

module.exports = router;
