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

  const [receivingCall, setReceivingCall] = useState(); // isRecievingCall, callerName
  const [isInCall, setIsInCall] = useState(false);

  const localStream = useRef(); // Local client's webcam/audio
  const incomingOfferRef = useRef();
  const incomingAnswerRef = useRef();
  const connectionRef = useRef();
  const connectedToId = useRef();
  const audioRef = useRef();

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

      // chat message
      if (data.type === "message") {
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
      }

      // incoming call
      if (data.type === "offer") {
        setReceivingCall(true);
        connectedToId.current = data.callerId;
        incomingOfferRef.current = data.offer;
      }

      // call accepptd
      if (data.type === "answer") {
        incomingAnswerRef.current = data.answer;
        handleAnswer(data.answer);
      }

      // end call
      if (data.type === "disconnect") {
        setIsInCall(false);
        connectionRef.current.close();
      }

      // candidate
      if (data.type === "candidate") {
        handleCandidate(data.candidate);
      }
    };
  }, [
    addCurrentChatMessage,
    addDirectMessage,
    id,
    playNotification,
    showDirectMessage,
  ]);

  // Starts call to user id
  const startCallHandler = async (id) => {
    await startConnection();
    setIsInCall(true);

    connectedToId.current = id;
    const offer = await connectionRef.current.createOffer();
    await connectionRef.current.setLocalDescription(offer);
    ws.current.send(
      JSON.stringify({
        type: "startCall",
        callerId: userId,
        recipientId: id,
        offer: offer,
      })
    );
  };

  // when we get an offer
  const answerCallHandler = async () => {
    await startConnection();
    setIsInCall(true);
    setReceivingCall(false);

    connectionRef.current.setRemoteDescription(
      new RTCSessionDescription(incomingOfferRef.current)
    );
    const answer = await connectionRef.current.createAnswer();
    await connectionRef.current.setLocalDescription(answer);
    ws.current.send(
      JSON.stringify({
        type: "answerCall",
        answer: answer,
        callerId: connectedToId.current,
      })
    );
  };

  const endCallHandler = async () => {
    ws.current.send(
      JSON.stringify({
        type: "disconnect",
        endCallerId: userId,
        recipientId: connectedToId.current,
      })
    );
  };

  // when we get an answer
  const handleAnswer = async (answer) => {
    const remoteDesc = new RTCSessionDescription(answer);
    await connectionRef.current.setRemoteDescription(remoteDesc);
  };

  // when we get ice candidate
  const handleCandidate = (candidate) => {
    connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const sendMessageHandler = (data) => {
    ws.current.send(JSON.stringify(data));
  };

  // creates the peer connection
  const startConnection = async () => {
    await navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((currentStream) => {
        let configuration = {
          iceServers: [{ url: "stun:stun2.1.google.com:19302" }],
        };

        connectionRef.current = new RTCPeerConnection(configuration);

        currentStream.getTracks().forEach((track) => {
          connectionRef.current.addTrack(track, currentStream);
        });

        // adds remote stream
        connectionRef.current.ontrack = (event) => {
          const [remoteStream] = event.streams;
          audioRef.current.srcObject = remoteStream;
        };

        connectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log(connectedToId.current);
            ws.current.send(
              JSON.stringify({
                type: "candidate",
                candidate: event.candidate,
                recipientId: connectedToId.current,
              })
            );
          }
        };

        connectionRef.current.onconnectionstatechange = (event) => {
          console.log(connectionRef.current.connectionState);
          if (connectionRef.current.connectionState === "connected") {
          }
        };
      });
  };

  return (
    <WebSocketContext.Provider
      value={{
        sendMessageHandler,
        startCallHandler,
        answerCallHandler,
        endCallHandler,
        isInCall,
        receivingCall,
        audioRef,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
