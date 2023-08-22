import React, { useEffect, useRef, useState } from "react";
import {
  createBrowserRouter,
  createMemoryRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Chat from "./pages/DM/Chat";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Friends from "./pages/People/Friends";
import Loading from "./pages/LoadingScreen/Loading";
import AppLayout from "./components/Layout/AppLayout";
import Sidebar from "./components/Sidebar/Sidebar";
import ServerNav from "./components/ServerNav/ServerNav";
import AddFriend from "./pages/People/AddFriend";
import LoginLayout from "./components/Layout/LoginLayout";
import Header from "./components/Header/Header";
import Pending from "./pages/People/Pending";


const AppContainer = (props) => {
  // Clear state on logout
  const [isLoading, setIsLoading] = useState(true);
  const [directMessages, setDirectMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  // const notificationAudio = new Audio("../src/assets/notifcation.mp3");

  useEffect(() => {
    console.log("APP FETCHING");
    if (!props.token) {
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch("/channel/direct-messages", {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });

        if (res.status !== 200) {
          throw new Error("An error has occurred.");
        }

        const messagesList = await res.json();
        setDirectMessages(messagesList);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [props.token]);

  useEffect(() => {
    console.log("APP WEBSOCKET");
    if (!props.userId) {
      return;
    }

    ws.current = new WebSocket(`ws://localhost:8080/?userId=${props.userId}`);

    ws.current.onopen = () => {
      console.log("Connection Open");
      const data = {
        userId: props.userId,
      };
      ws.current.send(JSON.stringify(data));
    };

    ws.current.onmessage = (message) => {
      // Handles notifcation
      console.log("IN APP CONTAINER");
      let data = JSON.parse(message.data);
      console.log(data);
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
  }, [props.userId]);

  const sendMessageHandler = (data) => {
    ws.current.send(JSON.stringify(data));
  };

  const storeMessages = (newMessages, chatId) => {
    setMessages((messages) => [
      ...messages,
      { chatId: chatId, messages: newMessages },
    ]);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      loader: () => {
        if (!props.isAuth && !isLoading) return redirect("/login");

        return null;
      },
      element: (
        <AppLayout
          nav={<ServerNav />}
          sidebar={
            <Sidebar
              logoutHandler={props.logoutHandler}
              directMessages={directMessages}
            />
          }
        >
          <Outlet></Outlet>
        </AppLayout>
      ),
      children: [
        {
          path: "/",
          loader: () => {
            return redirect("/friends/all");
          },
        },
        {
          path: "/friends",
          element: (
            // Pass params into header for state
            <React.Fragment>
              <Header
                title="Friends"
                avatar="https://animedao.to/images/call-of-the-night.jpg"
                tabBar={true}
              ></Header>
              <Outlet></Outlet>
            </React.Fragment>
          ),

          children: [
            {
              path: "/friends",
              element: <Friends token={props.token}></Friends>,
              loader: () => {
                return redirect("/friends/all");
              },
            },
            {
              path: "/friends/online",
              element: <Friends token={props.token}></Friends>,
            },
            {
              path: "/friends/all",
              element: <Friends token={props.token}></Friends>,
            },
            {
              path: "/friends/pending",
              element: <Pending token={props.token}></Pending>,
            },
            {
              path: "/friends/blocked",
              element: <Friends token={props.token}></Friends>,
            },
            {
              path: "/friends/add",
              element: <AddFriend token={props.token}></AddFriend>,
            },
          ],
        },
        {
          path: "/:id",
          element: (
            <Chat
              token={props.token}
              sendMessageHandler={sendMessageHandler}
              userId={props.userId}
              storeMessages={storeMessages}
              ws={ws.current}
            ></Chat>
          ),
          loader: ({ params }) => {
            return null;
          },
        },
      ],
    },
    {
      path: "/",
      loader: () => {
        if (props.isAuth && !isLoading) return redirect("/");
        return null;
      },
      element: (
        <LoginLayout>
          <Outlet></Outlet>
        </LoginLayout>
      ),
      children: [
        {
          path: "/login",
          element: <Login loginHandler={props.loginHandler} />,
        },
        {
          path: "/register",
          element: (
            <Register
              registerHandler={props.registerHandler}
              loginHandler={props.loginHandler}
            />
          ),
        },
      ],
    },
  ]);

  if (isLoading) {
    return <Loading></Loading>;
  }

  return <RouterProvider router={router}></RouterProvider>;
};

export default AppContainer;
