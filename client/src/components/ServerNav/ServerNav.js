import NavIcon from "./NavIcon";
import Seperator from "../UI/Seperator";
import SidebarItemWrapper from "./NavItemWrapper";
import classes from "./ServerNav.module.css";

const ServerNav = () => {
  return (
    <div className={classes["nav-container"]}>
      <NavIcon id="Direct-Message"></NavIcon>

      <SidebarItemWrapper>
        <Seperator></Seperator>
      </SidebarItemWrapper>

      <NavIcon id="1" notifAmount={222}></NavIcon>
      <NavIcon id="2" notifAmount={1}></NavIcon>
      <NavIcon id="3" notifAmount={0}></NavIcon>
    </div>
  );
};

export default ServerNav;
