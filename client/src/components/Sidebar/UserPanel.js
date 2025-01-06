import Avatar from "../UI/Avatar";
import classes from "./UserPanel.module.css";

const UserPanel = (props) => {
  return (
    <section className={classes["container"]}>
      <div className={classes["user-info"]}>
        <Avatar
          image={"https://animedao.to/images/call-of-the-night.jpg"}
          size={32}
        ></Avatar>
        <div className={classes["nametag"]}>
          <div className={classes["panel-title"]}>{props.username}</div>
          {/* <div className={classes["subtext"]}>Invisible</div> */}
        </div>
      </div>

      <div className={classes["buttons"]}>
        <button
          className={classes["button-container"]}
          onClick={props.logoutHandler}
        >
          <div>Logout</div>
        </button>
      </div>
    </section>
  );
};

export default UserPanel;
