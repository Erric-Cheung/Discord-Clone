import { useEffect, useState } from "react";
import { UserContext } from "./store/user-context";

import AppContainer from "./AppContainer";

function App() {
  const [token, setToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    console.log("APP RUNNING");
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    const userId = localStorage.getItem("userId");

    if (!token || !expiryDate) {
      setIsLoading(false);
      return;
    }

    if (new Date(expiryDate) <= new Date()) {
      setIsLoading(false);
      logoutHandler();
      return;
    }

    const checkTokenValidity = async () => {
      const res = await fetch("/auth/token", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200) {
        logoutHandler();
        return;
      }
      setToken(token);
      setUserId(userId);
      setIsAuth(true);
      setIsLoading(false);
    };

    checkTokenValidity();
  }, [isAuth]);

  // Fetch data for user?
  useEffect(() => {});

  // token + auth + user data context?

  const logoutHandler = () => {
    setIsAuth(false);
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  const loginHandler = async (formData) => {
    const data = { email: formData.email, password: formData.password };

    const res = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    let resData = await res.json();

    if (!resData.errors) {
      const remainingTimeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
      const expiryDate = new Date(new Date().getTime() + remainingTimeMs);
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      localStorage.setItem("token", resData.token);
      localStorage.setItem("userId", resData.userId);
      setToken(resData.token);
      setUserId(resData.userId);
      setIsAuth(true);
    }

    return resData;
  };

  const registerHandler = async (formData) => {
    const data = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
    };

    const res = await fetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    let resData = await res.json();
    return resData;
  };

  if (isLoading) {
    return;
  }

  return (
    <UserContext.Provider
      value={{
        token: token,
        userId: userId,
        logoutHandler: logoutHandler,
        loginHandler: loginHandler,
        registerHandler: registerHandler,
      }}
    >
      <AppContainer
        isAuth={isAuth}
        token={token}
        userId={userId}
        logoutHandler={logoutHandler}
        loginHandler={loginHandler}
        registerHandler={registerHandler}
      ></AppContainer>
    </UserContext.Provider>
  );
}

export default App;
