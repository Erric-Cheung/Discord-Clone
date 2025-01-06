const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: { type: String },
  password: { type: String, required: true },
  birthdate: { type: Date },
  servers: [],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // directMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  directMessages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Direct-Message" },
  ],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
});

module.exports = mongoose.model("User", UserSchema);
