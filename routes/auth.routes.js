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

  if (!username || !email || !password) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

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
      res.redirect("/auth/login");
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
        res.status(400).render("auth/login", {
          errorMessage: "Email is not registered. Sign up first!",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/notes/list");
      } else {
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
router.get("/auth/user-profile", isLoggedIn, (req, res, next) => {
  const userDetails = req.session.currentUser;
  if (userDetails) {
    res.render("auth/user-profile", { userDetails });
  } else {
    res.redirect("/auth/login");
  }
});

// GET /auth/user-details
router.get("/auth/user-details", isLoggedIn, (req, res, next) => {
  const userDetails = req.session.currentUser;

  if (userDetails) {
    User.findById(userDetails._id)
      .then((user) => {
        if (!user) {
          res.status(404).send("User not found");
          return;
        }

        const updatedUserDetails = {
          username: user.username,
          email: user.email,
        };

        res.json(updatedUserDetails);
      })
      .catch((error) => next(error));
  } else {
    res.redirect("/auth/login");
  }
});

// POST /auth/user-profile
router.post("/auth/user-profile", isLoggedIn, (req, res, next) => {
  const userDetails = req.session.currentUser;
  const { field, value } = req.body;

  if (userDetails) {
    User.findById(userDetails._id)
      .then((user) => {
        if (!user) {
          res.redirect("/auth/login");
          return;
        }

        if (field === "username") {
          user.username = value;
        } else if (field === "password") {
          bcryptjs
            .genSalt(saltRounds)
            .then((salt) => {
              return bcryptjs.hash(value, salt);
            })
            .then((hash) => {
              user.passwordHash = hash;
              return user.save();
            })
            .then(() => {
              res.redirect("/auth/user-profile");
            })
            .catch((error) => next(error));
          return;
        }
        user
          .save()
          .then(() => {
            res.redirect("/auth/user-profile");
          })
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;
