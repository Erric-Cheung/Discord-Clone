const mongoose = require("mongoose");

const DirectMessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  visiblity: { type: Boolean },
});

module.exports = mongoose.model("Direct-Message", DirectMessageSchema);
