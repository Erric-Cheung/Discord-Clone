import Header from "../../components/Header/Header";
import classes from "./Chat.module.css";
import ChatForm from "../../components/Chat/ChatForm";
import React, { useState, useEffect, useRef, useContext } from "react";
import ChatMessage from "../../components/Chat/ChatMessage";
import { useParams } from "react-router-dom";
import { WebSocketContext } from "../../store/websocket-context";

const Chat = (props) => {
  // const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState(null);
  const params = useParams();
  const users = useRef(null);
  const userIds = useRef(null);
  const { sendMessageHandler, localStream } = useContext(WebSocketContext);
  const { currentChatMessages, setCurrentChatMessages } = props;

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
        setCurrentChatMessages(data.messages);

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

    console.log("~~~~FETCHING MESSAGES~~~~~");
    fetchData();
  }, [props.token, props.userId, params.id, setCurrentChatMessages]);

  const submitMessageHandler = (message) => {
    const data = {
      type: "message",
      message: message,
      senderId: props.userId,
      chatId: params.id,
      userIds: userIds.current,
    };

    sendMessageHandler(data);
  };

  return (
    <div className={classes["container"]}>
      <Header
        title={title}
        avatar=""
        tabBar={false}
        call={true}
      ></Header>
      <div className={classes["messages-wrapper"]}>
        <ol className={classes["messages"]}>
          {currentChatMessages.map((item) => (
            <ChatMessage
              key={item._id}
              message={item.message}
              user={item.senderName}
              createdAt={item.createdAt}
              avatar=""
            ></ChatMessage>
          ))}
          <div className={classes["messages-spacer"]}></div>
        </ol>
      </div>
      <ChatForm submitMessage={submitMessageHandler}></ChatForm>
      {/* <video ref={localStream} muted autoPlay width="600px" playsInline></video> */}
    </div>
  );
};

export default Chat;
