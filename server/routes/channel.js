const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");

// Route for list of pending requests
router.get("/all", isAuth, async (req, res, next) => {
  const userId = req.userId;
  try {
    let friendList = [];

    const foundUser = await User.findById(userId);
    const foundUsers = await User.find({
      _id: { $in: foundUser.friends },
    });

    for (const user in foundUsers) {
      let foundChat = await Chat.findOne({
        users: [userId, foundUsers[user]._id],
      });

      let friend = {
        userId: foundUsers[user]._id,
        username: foundUsers[user].username,
      };

      if (foundChat) {
        friend.chatId = foundChat._id;
      }

      friendList.push(friend);
    }

    res.status(200).json({
      friendList: friendList,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Route for list of direct messages of user
router.get("/direct-messages", isAuth, async (req, res, next) => {
  const userId = req.userId;
  let directMessageIds;
  let directMessageUsers = [];
  let directMessageList = [];

  // Finds user and gets list of ids from direct messages.
  await User.findById(userId)
    .then((user) => {
      directMessageIds = user.directMessages;
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // Finds users from the list of ids from direct messages.
  for (const id of directMessageIds) {
    await User.findById(id)
      .then((user) => {
        directMessageUsers.push(user);
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }

  // Find chat ids from the list of users from direct messages
  for (const user of directMessageUsers) {
    await Chat.findOne({ users: [userId, user._id] })
      .then((chat) => {
        if (chat) {
          directMessageList.push({
            username: user.username,
            userId: user._id,
            chatId: chat._id,
            updatedAt: chat.updatedAt,
          });
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }

  // Sorted by update time
  directMessageList.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  res.status(200).json(directMessageList);
});

// Route for direct message
router.get("/:chatId", isAuth, async (req, res, next) => {
  const chatId = req.params.chatId;
  let userIds;
  let users = [];

  // Check if database has existing chat
  await Chat.findOne({
    _id: chatId,
  })
    .then((foundChat) => {
      if (!foundChat) {
        const error = new Error("Can not find chat.");
        error.statusCode = 404;
        throw error;
      }
      userIds = foundChat.users;
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // Find users with list of userIds
  await User.find({ _id: { $in: userIds } })
    .then((foundUsers) => {
      foundUsers.forEach((user) => {
        users.push({ username: user.username, _id: user._id });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // Find messages with corresponding chatId
  await Message.find({ chatId: chatId })
    .then((foundMessages) => {
      if (!foundMessages) {
        res.status(200).json({ users: users });
        return;
      }

      res.status(200).json({ messages: foundMessages, users: users });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

// Create chat
router.post("/create-chat", isAuth, async (req, res, next) => {
  try {
    const user1 = await User.findById(req.userId);
    const user2 = await User.findById(req.body.userId);

    let chat = await Chat.findOne({ users: [user1._id, user2._id] });
    if (!chat) {
      console.log("CREATING CHAT");
      const createChat = new Chat({
        users: [user1._id, user2._id],
        usernames: [user1.username, user2.username],
      });

      chat = await createChat.save();
    }

    // await User.updateOne(
    //   { _id: user1._id },
    //   { $pull: { directMessages: user2._id } }
    // );

    await User.updateOne(
      { _id: user1._id },
      { $addToSet: { directMessages: user2._id } }
    );

    res.status(200).json({ chatId: chat._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

module.exports = router;
