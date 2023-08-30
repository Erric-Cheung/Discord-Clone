import { createContext, useEffect, useState } from "react";

export const SidebarContext = createContext({
  directMessages: [],
});

// Provider component that handles the state changes with the sidebar context

export default (props) => {
  const [directMessages, setDirectMessages] = useState([]);

  return <SidebarContext.Provider>{props.children}</SidebarContext.Provider>;
};
