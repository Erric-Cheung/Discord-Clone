import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Context for websocket
export const WebSocketContext = React.createContext({
  sendMessageHandler: () => {},
  startCallHandler: () => {},
  answerCallHandler: () => {},
  leaveCallHandler: () => {},
});

export const WebSocketProvider = (props) => {
  const ws = useRef(null);
  const { id } = useParams();
  const {
    userId,
    addCurrentChatMessage,
    addDirectMessage,
    showDirectMessage,
    playNotification,
  } = props;
  const [stream, setStream] = useState();
  const [recievingCall, setRecievingCall] = useState(); // isRecievingCall, callerName
  const localStream = useRef(); // Local client's webcam/audio
  const remoteStream = useRef(); // Remote client's webcam/audio

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const peerConnection = new RTCPeerConnection(configuration);

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
    if (!ws.current) {
      return;
    }

    ws.current.onmessage = (message) => {
      let data = JSON.parse(message.data);

      const msg = data.msg;
      const dm = data.dm;

      // Update messages if user is on same chat page
      if (msg.chatId === id) {
        addCurrentChatMessage(msg);
      }

      // Updates DM list
      if (data.dmCreated) {
        addDirectMessage(dm);
      }

      // Sender already has DM updated
      if (!data.dmIsUpdated && !data.dmCreated) {
        showDirectMessage(dm.userId);
      }

      // Create notification if user is not on same chat page
      if (data.dm) {
        playNotification();
      }
    };
  }, [addCurrentChatMessage, addDirectMessage, id]);

  // WebRTC
  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //       setStream(currentStream);
  //       if (localStream.current) {
  //         localStream.current.srcObject = currentStream;
  //       }
  //     });

  //   ws.current.addEventListener("message", (message) => {
  //     console.log("SECOND ON MESSAGE");
  //     let data = JSON.parse(message.data);
  //     if (data) {
  //       console.log(data);
  //     }
  //   });
  // }, []);

  const startCallHandler = async (id) => {
    // const configuration = {
    //   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    // };
    // const peerConnection = new RTCPeerConnection(configuration);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  };

  const answerCallHandler = () => {};

  const leaveCallhandler = () => {};

  const sendMessageHandler = (data) => {
    ws.current.send(JSON.stringify(data));
  };

  return (
    <WebSocketContext.Provider
      value={{
        sendMessageHandler,
        startCallHandler,
        answerCallHandler,
        leaveCallhandler,
        localStream,
        stream,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
