import React from "react";

// Context for user info as data rarely changes.

export const UserContext = React.createContext({
  token: null,
  userId: null,
  username: null,
  loginHandler: () => {},
  logoutHandler: () => {},
  registerHandler: () => {},
});
