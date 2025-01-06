const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

// Route for logging in to an account.
router.post(
  "/login",
  [
    body("email").custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject("Invalid password or email");
        }
        req.body.user = user;
      });
    }),
    body("password").custom((value, { req }) => {
      if (!req.body.user) {
        return Promise.reject("Invalid password or email");
      }
      return bcrypt.compare(value, req.body.user.password).then((isEqual) => {
        if (!isEqual) {
          return Promise.reject("Invalid password or email");
        }
      });
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Login error.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    loginUser = req.body.user;
    const token = jwt.sign(
      { userId: loginUser._id.toString(), username: loginUser.username },
      "secret",
      { expiresIn: "7d" }
    );

    // Send token and login data to client
    res.status(200).json({
      message: "Successfully logged in.",
      token: token,
      userId: loginUser._id.toString(),
    });
  }
);

// Route for registering for an account
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email is already in use.");
          }
        });
      }),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Must be atleast 8 letters long."),
    body("username")
      .isLength({ min: 4 })
      .withMessage("Must be atleast 4 characters long."),
  ],
  (req, res, next) => {
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;

    // Validation result from validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Registration error.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    bcrypt.hash(password, 10).then((hashPassword) => {
      const user = new User({
        email: email,
        username: username,
        password: hashPassword,
      });

      // Save new created user to database
      user
        .save()
        .then((createdUser) => {
          res.status(201).json({
            message: "Successfully registered user",
            userId: createdUser._id,
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    });
  }
);

router.post("/token", isAuth, (req, res, next) => {
  res.status(200).json({
    message: "Valid token",
  });
});

module.exports = router;
