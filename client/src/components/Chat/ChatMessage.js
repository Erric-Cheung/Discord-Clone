import Avatar from "../UI/Avatar";
import classes from "./ChatMessage.module.css";

const ChatMessage = (props) => {
  if (props.group) {
  }

  const createdAt = new Date(props.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentDate = new Date();

  const formattedDate = createdAt.split(",").join("");

  return (
    <li className={classes["message"]}>
      <div className={classes["contents"]}>
        <div className={classes["avatar"]}>
          <Avatar size={40} image={props.avatar}></Avatar>
        </div>
        <h3 className={classes["header"]}>
          <span className={classes["username"]}>{props.user}</span>
          <span className={classes["timestamp"]}>
            <time>{formattedDate}</time>
          </span>
        </h3>
        <div className={classes["message-content"]}>{props.message}</div>
      </div>
    </li>
  );
};

export default ChatMessage;
