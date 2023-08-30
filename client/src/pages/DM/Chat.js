import Header from "../../components/Header/Header";
import classes from "./Chat.module.css";
import ChatForm from "../../components/Chat/ChatForm";
import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "../../components/Chat/ChatMessage";
import { useLoaderData, useParams } from "react-router-dom";

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState(null);
  const params = useParams();
  const users = useRef(null);
  const userIds = useRef(null);
  // const storedMessages = useLoaderData();
  // const { storeMessages } = props;

  // if stored message exists, get messages
  // on chat exit, store messages so app is not rerendered ?

  console.log("CHAT RERENDERED");

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        const res = await fetch(`/channel/${params.id}`, {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });

        const data = await res.json();
        console.log(data);

        users.current = data.users;
        userIds.current = users.current.map((user) => user._id);
        setMessages(data.messages);

        // Creates title not including current user.
        let title = "";
        users.current.forEach((user) => {
          if (user._id !== props.userId) {
            if (title === "") {
              title = user.username;
            } else {
              title = title + ", " + user.username;
            }
          }
        });
        setTitle(title);
      } catch (err) {
        console.log(err);
      }
    };

    console.log("FETCHING MESSAGES");
    fetchData();
  }, [props.token, props.userId, params.id]);

  // Updates websocket's onMessage and reverts on cleanup.
  useEffect(() => {
    const prevOnMessage = props.ws.onmessage;
    props.ws.onmessage = (message) => {
      // Handles updating messages array on message.
      console.log("IN CHAT ");
      let data = JSON.parse(message.data);
      addMessage(data);
    };

    return () => {
      props.ws.onmessage = prevOnMessage;
    };
  }, [props.ws]);

  const submitMessageHandler = (message) => {
    const data = {
      type: "message",
      message: message,
      senderId: props.userId,
      chatId: params.id,
      userIds: userIds.current,
    };

    props.sendMessageHandler(data);
  };

  const addMessage = (newMessage) => {
    setMessages((messages) => [...messages, newMessage]);
  };

  return (
    <div className={classes["container"]}>
      <Header
        title={title}
        avatar="https://animedao.to/images/call-of-the-night.jpg"
        tabBar={false}
      ></Header>
      <div className={classes["messages-wrapper"]}>
        <ol className={classes["messages"]}>
          {messages.map((item) => (
            <ChatMessage
              key={item._id}
              message={item.message}
              user={item.senderName}
              createdAt={item.createdAt}
              avatar="https://animedao.to/images/call-of-the-night.jpg"
            ></ChatMessage>
          ))}
          <div className={classes["messages-spacer"]}></div>
        </ol>
      </div>
      <ChatForm submitMessage={submitMessageHandler}></ChatForm>
    </div>
  );
};

export default Chat;
