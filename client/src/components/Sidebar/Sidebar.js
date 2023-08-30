import DirectMessageList from "../DirectMessage/DirectMessageList";

import classes from "./Sidebar.module.css";
import SearchBar from "./SearchButton";
import UserPanel from "./UserPanel";

const Sidebar = (props) => {
  console.log("SIDEBAR RERENDER");
  console.log(props.directMessages);

  return (
    <div className={classes["sidebar"]}>
      <nav className={classes["sidebar-nav"]}>
        <SearchBar></SearchBar>
        <DirectMessageList
          directMessages={props.directMessages}
          hideDirectMessage={props.hideDirectMessage}
          token={props.token}
        ></DirectMessageList>
      </nav>
      <UserPanel logoutHandler={props.logoutHandler}></UserPanel>
    </div>
  );
};

export default Sidebar;
