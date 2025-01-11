import React, { useContext, useEffect, useState } from "react";
import {
  createBrowserRouter,
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
import AddFriend from "./pages/People/AddFriend";
import LoginLayout from "./components/Layout/LoginLayout";
import Header from "./components/Header/Header";
import Pending from "./pages/People/Pending";
import { UserContext } from "./store/user-context";
import { WebSocketProvider } from "./store/websocket-context";
import notificationAudio from './assets/notification.mp3'

const AppContainer = (props) => {
  // Clear state on logout
  const [isLoading, setIsLoading] = useState(true);
  const [directMessages, setDirectMessages] = useState([]);
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const userCtx = useContext(UserContext);

  const hideDirectMessage = (userId) => {
    const updatedDirectMessages = directMessages.map((dm) => {
      if (dm.userId === userId) {
        dm.visibility = false;
      }
      return dm;
    });
    setDirectMessages(updatedDirectMessages);
  };

  const showDirectMessage = (userId) => {
    const updatedDirectMessages = directMessages.map((dm) => {
      if (dm.userId === userId) {
        dm.visibility = true;
      }
      return dm;
    });
    setDirectMessages(updatedDirectMessages);
  };

  const addDirectMessage = (dm) => {
    console.log(dm);
    setDirectMessages([dm, ...directMessages]);
  };

  // Function to add message to current chat
  const addCurrentChatMessage = (newMessage) => {
    setCurrentChatMessages((messages) => [...messages, newMessage]);
  };

  const playNotification = () => {
    new Audio(notificationAudio).play();
  }

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

        const userRes = await fetch(`/user/${userCtx.userId}`, {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });

        if (userRes.status !== 200) {
          throw new Error("An error has occurred.");
        }

        const userData = await userRes.json();
        setUsername(userData.username);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [props.token]);

  const router = createBrowserRouter([
    {
      path: "/",
      loader: () => {
        if (!props.isAuth && !isLoading) {
          console.log("NOT LOGGED IN REDIRECT");
          return redirect("/login");
        }
        return null;
      },
      element: (
        <WebSocketProvider
          userId={userCtx.userId}
          addCurrentChatMessage={addCurrentChatMessage}
          addDirectMessage={addDirectMessage}
          showDirectMessage={showDirectMessage}
          playNotification={playNotification}
        >
          <AppLayout
            // nav={<ServerNav />}
            sidebar={
              <Sidebar
                logoutHandler={props.logoutHandler}
                directMessages={directMessages}
                hideDirectMessage={hideDirectMessage}
                token={props.token}
                username={username}
              />
            }
          >
            <Outlet></Outlet>
          </AppLayout>
        </WebSocketProvider>
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
                tabBar={true}
              ></Header>
              <Outlet></Outlet>
            </React.Fragment>
          ),

          children: [
            {
              path: "/friends",
              element: (
                <Friends
                  token={props.token}
                  showDirectMessage={showDirectMessage}
                  addDirectMessage={addDirectMessage}
                ></Friends>
              ),
              loader: () => {
                return redirect("/friends/all");
              },
            },
            {
              path: "/friends/online",
              element: (
                <Friends
                  token={props.token}
                  showDirectMessage={showDirectMessage}
                  addDirectMessage={addDirectMessage}
                ></Friends>
              ),
            },
            {
              path: "/friends/all",
              element: (
                <Friends
                  token={props.token}
                  showDirectMessage={showDirectMessage}
                  addDirectMessage={addDirectMessage}
                ></Friends>
              ),
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
              userId={props.userId}
              currentChatMessages={currentChatMessages}
              setCurrentChatMessages={setCurrentChatMessages}
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
