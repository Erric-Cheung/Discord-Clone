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
  .connect(
    "mongodb+srv://erriccheung:7fXeGb6MwPwCVmOV@cluster0.ifep27x.mongodb.net/?retryWrites=true&w=majority"
  )
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
            const foundUser = await User.findById(data.senderId);
            const msg = new Message({
              chatId: data.chatId,
              message: data.message,
              senderId: data.senderId,
              senderName: foundUser.username,
            });
            const createdMsg = await msg.save();

            await Chat.updateOne(
              { _id: data.chatId },
              { $push: { messages: msg } }
            );

            // Send data to each of the chat users
            wss.clients.forEach((client) => {
              if (data.userIds.includes(client.id)) {
                client.send(JSON.stringify(createdMsg));
              }
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
  })

  .catch((err) => {
    console.log(err);
  });
