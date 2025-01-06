import Avatar from "../UI/Avatar";
import Divider from "../UI/Divider";
import FriendsIcon from "../UI/FriendsIcon";
import classes from "./Header.module.css";
import TabBar from "./TabBar";

const Header = (props) => {
  return (
    <section className={classes["header"]}>
      <div className={classes["children-container"]}>
        {props.icon && (
          <div className={classes["icon-wrapper"]}>{props.icon}</div>
        )}
        {props.avatar && (
          <div className={classes["avatar-wrapper"]}>
            <Avatar image={props.avatar} size={24}></Avatar>
          </div>
        )}

        <div className={classes["title-wrapper"]}>
          <h1 className={classes["title"]}>{props.title}</h1>
        </div>

        {props.tabBar && <Divider></Divider>}
        {props.tabBar && <TabBar></TabBar>}
      </div>

      <div className={classes["toolbar"]}>
        {props.call && (
          <div className={classes["icon-wrapper"]} onClick={props.startCall}>
            Call
          </div>
        )}
        <Divider></Divider>
        <div className={classes["icon-wrapper"]}>
          <FriendsIcon></FriendsIcon>
        </div>
      </div>
    </section>
  );
};

export default Header;
