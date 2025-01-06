import Avatar from "../UI/Avatar";
import classes from "./DirectMessageItem.module.css";
import { Link, useNavigate } from "react-router-dom";

const DirectMessageItem = (props) => {
  const navigate = useNavigate();
  
  let isSelected = false;
  if (
    props.selectedTab === props.link ||
    (props.selectedTab.indexOf("/friends") === 0 && props.link === "/friends")
  ) {
    isSelected = true;
  }

  const closeHandler = async () => {
    const res = await fetch("/channel/direct-message/remove", {
      method: "PUT",
      body: JSON.stringify({ userId: props.userId, chatId: props.chatId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token,
      },
    });

    if (isSelected) {
      navigate(`/friends/all`);
    }
    props.hideDirectMessage(props.userId);
  };

  return (
    <li className={classes["item-wrapper"]}>
      <div
        className={`${classes["interactive"]} ${
          isSelected && classes["selected"]
        }`}
      >
        <Link className={classes["link"]} to={props.link}>
          {
            <div className={classes["content-layout"]}>
              <div className={classes["avatar-wrapper"]}>
                <Avatar image={props.avatar} size={32}></Avatar>
              </div>
              <div className={classes["text"]}>
                <div> {props.text}</div>
              </div>
            </div>
          }
        </Link>
        {props.userId && (
          <div className={classes["close-button"]} onClick={closeHandler}>
            X
          </div>
        )}
      </div>
    </li>
  );
};

export default DirectMessageItem;
