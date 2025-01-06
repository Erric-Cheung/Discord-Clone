const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    usernames: [{ type: String }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
