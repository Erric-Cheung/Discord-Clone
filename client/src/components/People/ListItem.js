import classes from "./ListItem.module.css";
import Avatar from "../UI/Avatar";
import ActionButton from "./ActionButton";
import React from "react";

const ListItem = (props) => {
  const onAcceptHandler = () => {
    props.acceptRequest();
  };

  const onCancelHandler = () => {};

  return (
    <div className={classes["container"]}>
      <div className={classes["user-info"]}>
        <Avatar
          size={32}
        ></Avatar>
        <div className={classes["text"]}>
          <div className={classes["username"]}>{props.title}</div>
          <div className={classes["subtext"]}>{props.description}</div>
        </div>
      </div>
      <div className={classes["actions"]}>
        {props.type === "friend" && (
          <React.Fragment>
            <ActionButton onClick={props.redirectToChat}>M</ActionButton>
            <ActionButton onClick={props.redirectToChat}>...</ActionButton>
          </React.Fragment>
        )}
        {props.type === "incoming" && (
          <React.Fragment>
            <ActionButton onClick={props.acceptRequest}>A</ActionButton>
            <ActionButton onClick={props.cancelRequest}>R</ActionButton>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default ListItem;
