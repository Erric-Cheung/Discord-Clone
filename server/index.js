require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const url = require("url");
const authRoutes = require("./routes/auth");
const channelRoutes = require("./routes/channel");
const userRoutes = require("./routes/user");
const requestRoutes = require("./routes/request");

const Chat = require("./models/chat");
const Message = require("./models/message");
const User = require("./models/user");
const DirectMessage = require("./models/direct-message");

const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/channel", channelRoutes);
app.use("/user", userRoutes);
app.use("/request", requestRoutes);

app.use((error, req, res, next) => {
  console.log("ERROR MIDDLEWARE");
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, errors: data });
});

mongoose
  .connect(uri)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on("connection", (ws, req) => {
      const parameters = url.parse(req.url, true);
      ws.id = parameters.query.userId;

      wss.clients.forEach((client) => {
        console.log("CLIENT ID: " + client.id);
      });

      console.log("Connected to websocket");

      ws.on("message", async (msgData) => {
        const data = JSON.parse(msgData);

        if (data.type === "message") {
          console.log("Message Sent");
          try {
            const sender = await User.findById(data.senderId);
            const recipient = await User.findById(
              data.userIds.filter((id) => !(id == data.senderId))
            );
            const msg = new Message({
              chatId: data.chatId,
              message: data.message,
              senderId: data.senderId,
              senderName: sender.username,
            });
            const createdMsg = await msg.save();

            await Chat.updateOne(
              { _id: data.chatId },
              { $push: { messages: msg } }
            );

            // Create new DM for the recipent
            const chat = await Chat.findById(data.chatId);
            let dm = await DirectMessage.findOne({
              $and: [{ chatId: chat._id }, { userId: sender._id }],
            });

            let isCreated = false;
            if (!dm) {
              const createDirectMessage = new DirectMessage({
                chatId: chat._id,
                userId: sender._id,
                visibility: true,
              });

              dm = await createDirectMessage.save();
              isCreated = true;
            }

            // Add DM id to the user
            await User.updateOne(
              { _id: recipient._id },
              { $addToSet: { directMessages: dm._id } }
            );

            // Update visibility if dm already exists.
            await DirectMessage.updateOne(
              { _id: dm._id },
              { visibility: true }
            );

            // Send data to each of the chat users
            wss.clients.forEach((client) => {
              if (data.userIds.includes(client.id)) {
                // Send new DM to recipeint
                if (client.id == recipient._id) {
                  client.send(
                    JSON.stringify({
                      type: "message",
                      msg: createdMsg,
                      dm: {
                        chatId: chat._id,
                        userId: sender._id,
                        username: sender.username,
                        visibility: dm.visibility,
                        updatedAt: chat.updatedAt,
                      },
                      dmCreated: isCreated,
                    })
                  );
                } else {
                  client.send(
                    JSON.stringify({ msg: createdMsg, dmIsUpdated: true })
                  );
                }
              }
            });
          } catch (err) {
            console.log(err);
          }
        }

        if (data.type === "startCall") {
          console.log("STARTING CALL TO ", data.recipientId);

          // id to offer call to
          const callingId = data.recipientId;
          wss.clients.forEach((client) => {
            if (client.id == callingId) {
              client.send(
                JSON.stringify({
                  type: "offer",
                  offer: data.offer,
                  callerId: data.callerId,
                })
              );
              console.log("SENT OFFER");
            }
          });
        }

        if (data.type === "answerCall") {
          const callerId = data.callerId;
          wss.clients.forEach((client) => {
            if (client.id == callerId) {
              client.send(
                JSON.stringify({
                  type: "answer",
                  answer: data.answer,
                })
              );
              console.log("SENT ANSWER");
            }
          });
        }

        if (data.type === "candidate") {
          const recipientId = data.recipientId;
          wss.clients.forEach((client) => {
            if (client.id == recipientId) {
              client.send(
                JSON.stringify({
                  type: "candidate",
                  candidate: data.candidate,
                })
              );
              console.log("SENT CANDIDATE");
            }
          });
        }
        
        if (data.type === "disconnect") {
          const recipientId = data.recipientId;
          const endCallerId = data.endCallerId;
          wss.clients.forEach((client) => {
            if (client.id == recipientId || client.id == endCallerId) {
              client.send(
                JSON.stringify({
                  type: "disconnect",
                })
              );
            }
          });
        }
      });
    });
  })

  .catch((err) => {
    console.log(err);
  });
