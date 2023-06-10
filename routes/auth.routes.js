const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcryptjs run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/auth/signup", (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.redirect("/");
  } else {
    res.render("auth/signup");
  }
});

// POST /auth/signup
router.post("/auth/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (!username || !email || !password) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }
  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Create a new user - start by hashing the password
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt);
    })
    .then((hash) => {
      const newUser = {
        username: username,
        email: email,
        passwordHash: hash,
      };

      return User.create(newUser);
    })
    .then((userFromDB) => {
      res.redirect("/auth/login"); // user has been created, redirect to /auth/login
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log("this is a mongoose validator error");
        res.status(400).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res
          .status(400)
          .render("auth/signup", { errorMessage: "Email needs to be unique." });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/auth/login", (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.redirect("/");
  } else {
    res.render("auth/login");
  }
});

// POST /auth/login
router.post("/auth/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //user doesn't exist (mongoose returns "null")
        res.status(400).render("auth/login", {
          errorMessage: "Email is not registered. Sign up first!",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //login successful
        req.session.currentUser = user;
        res.render("notes/note-list", { userDetails: user });
      } else {
        //login failed
        res
          .status(400)
          .render("auth/login", { errorMessage: "Incorrect credentials." });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// GET /auth/logout
router.get("/auth/logout", (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).render("auth/logout", { errorMessage: err.message });
        return;
      }
      res.redirect("/auth/login");
    });
  } else {
    res.redirect("/");
  }
});

//GET /auth/user-profile
router.get("/auth/user-profile", (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.render("auth/user-profile", { userDetails });
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;
