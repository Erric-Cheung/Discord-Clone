const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

const User = require("../models/user");

router.get("/:userId", isAuth, async (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  await User.findById(userId)
    .then((foundUser) => {
      res.status(200).json({ username: foundUser.username });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
