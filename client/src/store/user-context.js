import { useContext } from "react";

export const UserContext = createContext({
    token: null,
    userId: null,
    username: null,
    loginHandler: () => {},
    logoutHandler: () => {},
    registerHandler: () => {},
  });