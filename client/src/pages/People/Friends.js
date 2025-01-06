import React, { useEffect, useState } from "react";
import classes from "./Friends.module.css";
import ListItem from "../../components/People/ListItem";

import { useNavigate } from "react-router-dom";
const Friends = (props) => {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/channel/all", {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });

        const resData = await res.json();
        setFriendList(resData.friendList);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [props.token]);

  const redirectToChatHandler = async (userId) => {
    // Check if userId has a existing chatId.
    const friend = friendList.find((friend) => friend.userId === userId);
    let chatId = friend.chatId;

    if (!chatId) {
      const res = await fetch("/channel/create-chat", {
        method: "POST",
        body: JSON.stringify({ userId: userId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      });
      const resData = await res.json();
      chatId = resData.chatId;
    }

    const res = await fetch("/channel/direct-message/add", {
      method: "PUT",
      body: JSON.stringify({ userId: userId, chatId: chatId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token,
      },
    });
    const resData = await res.json();
    if (resData.createdDM) {
      navigate(`/${chatId}`);
      props.addDirectMessage(resData.dm);
      return;
    }
    navigate(`/${chatId}`);
    props.showDirectMessage(userId);
  };

  return (
    <div className={classes["container"]}>
      {friendList.map((user) => {
        return (
          <ListItem
            key={user.userId}
            userId={user.userId}
            title={user.username}
            type="friend"
            description="Online"
            redirectToChat={redirectToChatHandler.bind(null, user.userId)}
          ></ListItem>
        );
      })}
    </div>
  );
};

export default Friends;
