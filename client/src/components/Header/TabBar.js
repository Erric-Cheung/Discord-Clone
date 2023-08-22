import MainHeaderTab from "./Tab";
import classes from "./TabBar.module.css";
import { useLocation } from "react-router-dom";

const TabBar = () => {
  let { pathname } = useLocation();
  
  return (
    <div className={classes["tab-bar"]}>
      <MainHeaderTab
        link="/friends/online"
        title="Online"
        selectedTab={pathname}
      ></MainHeaderTab>
      <MainHeaderTab
        link="/friends/all"
        title="All"
        selectedTab={pathname}
      ></MainHeaderTab>
      <MainHeaderTab
        link="/friends/pending"
        title="Pending"
        selectedTab={pathname}
      ></MainHeaderTab>
      <MainHeaderTab
        link="/friends/blocked"
        title="Blocked"
        selectedTab={pathname}
      ></MainHeaderTab>
      <MainHeaderTab
        link="/friends/add"
        title="Add Friend"
        selectedTab={pathname}
      ></MainHeaderTab>
    </div>
  );
};

export default TabBar;
