const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

const User = require("../models/user");
const Request = require("../models/request");
const { ObjectId } = require("mongodb");

module.exports = router;

// Route for accepting a pending request
router.post("/accept", isAuth, async (req, res, next) => {
  const requestId = req.body.requestId;

  try {
    const foundRequest = await Request.findById(requestId);

    if (!foundRequest) {
      const error = new Error("Error finding this request");
      error.statusCode = 404;
      throw error;
    }

    // Add users to friend lists.
    await User.updateOne(
      { _id: foundRequest.senderId },
      { $push: { friends: foundRequest.recieverId } }
    );

    await User.updateOne(
      { _id: foundRequest.recieverId },
      { $push: { friends: foundRequest.senderId } }
    );

    //  Delete the request from users and requests.
    await User.updateMany(
      { _id: { $in: [foundRequest.senderId, foundRequest.recieverId] } },
      { $pull: { pendingRequests: foundRequest._id } }
    );

    await Request.deleteOne({ _id: foundRequest._id });

    res.status(200).json({ message: "Accepted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Route for creating a request
router.post("/add-friend", isAuth, async (req, res, next) => {
  const username = req.body.username;

  try {
    const foundUser = await User.findOne({ username: username });

    if (!foundUser) {
      const error = new Error("Can not find user.");
      error.statusCode = 404;
      throw error;
    }
    if (foundUser._id.toString() === req.userId) {
      const error = new Error("Error adding this user.");
      error.statusCode = 400;
      throw error;
    }

    if (foundUser.friends.includes(new ObjectId(req.userId))) {
      const error = new Error("Already friends with this user.");
      error.statusCode = 400;
      throw error;
    }

    const foundRequest = await Request.findOne({
      $or: [
        { senderId: req.userId, recieverId: foundUser._id },
        { recieverId: req.userId, senderId: foundUser._id },
      ],
    });

    if (foundRequest) {
      const error = new Error("Friend request already sent.");
      error.statusCode = 400;
      throw error;
    }

    const request = new Request({
      senderId: req.userId,
      recieverId: foundUser._id,
    });

    const newRequest = await request.save();

    await User.updateOne(
      { _id: foundUser._id },
      { $push: { pendingRequests: newRequest } }
    );

    await User.updateOne(
      { _id: req.userId },
      { $push: { pendingRequests: newRequest } }
    );

    console.log("Friend request sent.");
    res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Route for list of pending requests
router.get("/pending", isAuth, async (req, res, next) => {
  const userId = req.userId;
  try {
    let pendingRequests = [];

    const foundUser = await User.findById(userId);

    // Find requests with list of request ids.
    const foundRequests = await Request.find({
      _id: { $in: foundUser.pendingRequests },
    });

    // For earch request find the other user and check if it is outgoing or incoming.
    for (const request of foundRequests) {
      const otherUser =
        request.senderId.toString() === req.userId
          ? request.recieverId
          : request.senderId;

      const found = await User.findById(otherUser);

      const requestType =
        request.senderId.toString() === req.userId ? "outgoing" : "incoming";

      pendingRequests.push({
        userId: found._id,
        username: found.username,
        requestType: requestType,
        requestId: request._id,
      });
    }
    res.status(200).json({
      pendingRequests: pendingRequests,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});
