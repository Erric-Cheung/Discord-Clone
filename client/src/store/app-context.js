import React, { useState } from "react";

export const AppContext = React.createContext({
  selectedSidebarItem: null,
  setSelectedSidebarItem: () => {},
});

export const AppContextProvider = (props) => {
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState("Direct-Message");

  const setSelectedSidebarItemHandler = (id) => {
    setSelectedSidebarItem(id);
  };

  return (
    <AppContext.Provider
      value={{
        selectedSidebarItem: selectedSidebarItem,
        setSelectedSidebarItem: setSelectedSidebarItemHandler,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
