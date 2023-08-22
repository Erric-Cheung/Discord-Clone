import Avatar from "../UI/Avatar";
import classes from "./ChatMessage.module.css";

const ChatMessage = (props) => {
  if (props.group) {
  }

  return (
    <li className={classes["message"]}>
      <div className={classes["contents"]}>
        <div className={classes["avatar"]}>
          <Avatar size={40} image={props.avatar}></Avatar>
        </div>
        <h3 className={classes["header"]}>
          <span className={classes["username"]}>{props.user}</span>
          <span className={classes["timestamp"]}>
            <time>Yesterday at 12:11 AM</time>
          </span>
        </h3>
        <div className={classes["message-content"]}>{props.message}</div>
      </div>
    </li>
  );
};

export default ChatMessage;
