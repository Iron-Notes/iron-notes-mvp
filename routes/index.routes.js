const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
//GET home page
router.get("/", (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.render("index", { userDetails });    
  } else {
    res.render("index");
  }
});

module.exports = router;
