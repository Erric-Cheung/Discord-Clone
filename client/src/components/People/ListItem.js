import classes from "./ListItem.module.css";
import Avatar from "../UI/Avatar";
import ActionButton from "./ActionButton";

const ListItem = (props) => {
  if (props.type === "incoming") {
  }

  const onAcceptHandler = () => {
    props.acceptRequest();
  };

  const onCancelHandler = () => {};

  return (
    <div className={classes["container"]}>
      <div className={classes["user-info"]}>
        <Avatar
          image={"https://animedao.to/images/call-of-the-night.jpg"}
          size={32}
        ></Avatar>
        <div className={classes["nametag"]}>
          <div className={classes["panel-title"]}>{props.title}</div>
          <div className={classes["subtext"]}>{props.description}</div>
        </div>
      </div>
      {props.type === "friend" && (
        <div>
          <button onClick={props.redirectToChat}>Chat</button>
        </div>
      )}
      {props.type === "incoming" && (
        <div className={classes["actions"]}>
          <ActionButton onClick={onAcceptHandler}>A</ActionButton>
          <ActionButton onClick={onAcceptHandler}>A</ActionButton>
          {/* <button onClick={onAcceptHandler}>Accept</button>
          <button>Reject</button> */}
        </div>
      )}
    </div>
  );
};

export default ListItem;
