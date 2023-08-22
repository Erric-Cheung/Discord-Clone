import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import NavItemWrapper from "./NavItemWrapper";
import NotificationBadge from "../UI/NotificationBadge";
import classes from "./NavIcon.module.css";

const NavIcon = (props) => {
  const ctx = useContext(AppContext);

  const clickHandler = () => {
    ctx.setSelectedSidebarItem(props.id);
  };

  let isSelected = false;
  if (ctx.selectedSidebarItem === props.id) {
    isSelected = true;
  }

  return (
    <NavItemWrapper onClick={clickHandler}>
      <div className={classes["pill-wrapper"]}>
        {isSelected && <span className={classes["pill"]}></span>}
      </div>

      <div className={classes["server-item-wrapper"]}>
        <div
          className={`${classes["icon-wrapper"]} ${
            isSelected && classes["selected"]
          }`}
        >
          <img
            className={classes["icon-image"]}
            src="https://animedao.to/images/call-of-the-night.jpg"
            alt=" "
          ></img>
        </div>

        <NotificationBadge amount={props.notifAmount}></NotificationBadge>
      </div>
    </NavItemWrapper>
  );
};

export default NavIcon;
