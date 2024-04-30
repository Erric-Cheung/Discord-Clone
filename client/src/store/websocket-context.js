import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// Context for websocket
export const WebSocketContext = React.createContext({
  sendMessageHandler: () => {},
});

export const WebSocketProvider = (props) => {
  const ws = useRef(null);
  const { id } = useParams();
  const { userId, addCurrentChatMessage } = props;

  // Creates websocket
  useEffect(() => {
    console.log("APP WEBSOCKET");
    if (!userId) {
      return;
    }

    ws.current = new WebSocket(`ws://localhost:8080/?userId=${userId}`);

    ws.current.onopen = () => {
      console.log("Connection Open");
      const data = {
        userId: userId,
      };
      ws.current.send(JSON.stringify(data));
    };

    ws.current.onclose = () => {
      console.log("Connection Closed");
    };
    ws.current.onerror = () => {};

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  // Handles websocket messages
  useEffect(() => {
    console.log("ON MESSAGE EFFECT");
    if (!ws.current) {
      return;
    }

    ws.current.onmessage = (message) => {
      let data = JSON.parse(message.data);
      console.log(data);

      // Update messages if user is on same chat page
      if (data.chatId === id) {
        console.log("ADDED MESSAGE");
        addCurrentChatMessage(data);
      }
    
      // Create notification if user is not on same chat page

    };
  }, [addCurrentChatMessage, id]);

  const sendMessageHandler = (data) => {
    ws.current.send(JSON.stringify(data));
  };

  return (
    <WebSocketContext.Provider value={{ sendMessageHandler }}>
      {props.children}
    </WebSocketContext.Provider>
  );
};
