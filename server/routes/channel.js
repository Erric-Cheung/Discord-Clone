const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");
const DirectMessage = require("../models/direct-message");

// Route for all friends page.
router.get("/all", isAuth, async (req, res, next) => {
  const userId = req.userId;
  let friendList = [];

  try {
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
  let directMessageUsers = [];
  let directMessageList = [];

  try {
    // Finds user and gets list of ids from direct messages.
    const currUser = await User.findById(userId);
    const directMessages = await DirectMessage.find({
      _id: { $in: currUser.directMessages },
    });

    // Finds users from the ids from direct messages.
    for (const dm of directMessages) {
      let dmUser = await User.findById(dm.userId);
      dmUser.visibility = dm.visiblity;
      directMessageUsers.push(dmUser);
    }

    // Find chat ids from the list of users from direct messages
    for (const user of directMessageUsers) {
      const chat = await Chat.findOne({ users: [userId, user._id] });
      if (chat) {
        directMessageList.push({
          username: user.username,
          userId: user._id,
          chatId: chat._id,
          updatedAt: chat.updatedAt,
          visibility: user.visibility,
        });
      }
    }

    // Sorted by last time updated of the chats.
    directMessageList.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    res.status(200).json(directMessageList);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Route for chat page.
router.get("/:chatId", isAuth, async (req, res, next) => {
  const chatId = req.params.chatId;
  let userIds;
  let users = [];

  // Check if database has existing chat and check if user has access.
  await Chat.findOne({
    _id: chatId,
  })
    .then((foundChat) => {
      if (!foundChat) {
        const error = new Error("Can not find chat.");
        error.statusCode = 404;
        throw error;
      }

      if (!foundChat.users.includes(req.userId)) {
        const error = new Error("Not authorized");
        error.statusCode = 401;
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

// Route for creating chat and new DM.
router.post("/create-chat", isAuth, async (req, res, next) => {
  try {
    const user1 = await User.findById(req.userId);
    const user2 = await User.findById(req.body.userId);

    let chat = await Chat.findOne({ users: { $all: [user1._id, user2._id] } });
    if (!chat) {
      console.log("CREATING CHAT");
      const createChat = new Chat({
        users: [user1._id, user2._id],
        usernames: [user1.username, user2.username],
      });

      chat = await createChat.save();
    }

    let dm = await DirectMessage.findOne({ chatId: chat._id });
    if (!dm) {
      console.log("CREATING DIRECT MESSAGE");
      const createDirectMessage = new DirectMessage({
        chatId: chat._id,
        userId: user2._id,
        visiblity: true,
      });

      dm = await createDirectMessage.save();
    }

    // Update visibility if dm is not created
    await DirectMessage.updateOne({ _id: dm._id }, { visiblity: true });

    // Add DM id to the user
    await User.updateOne(
      { _id: user1._id },
      { $addToSet: { directMessages: dm._id } }
    );

    res.status(200).json({
      chatId: chat._id,
      userId: user2._id,
      username: user2.username,
      visibility: dm.visiblity,
      updatedAt: chat.updatedAt,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Route for closing DM.
router.put("/direct-message/remove", isAuth, async (req, res, next) => {
  try {
    await DirectMessage.updateOne(
      {
        userId: req.body.userId,
        chatId: req.body.chatId,
      },
      { visiblity: false }
    );

    res.status(200).json({ message: "Closed DM" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Route for adding DM.
router.put("/direct-message/add", isAuth, async (req, res, next) => {
  try {
    await DirectMessage.updateOne(
      {
        userId: req.body.userId,
        chatId: req.body.chatId,
      },
      { visiblity: true }
    );

    res.status(200).json({ message: "Added DM" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

module.exports = router;
