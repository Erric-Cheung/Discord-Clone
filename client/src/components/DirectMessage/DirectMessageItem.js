import Avatar from "../UI/Avatar";
import classes from "./DirectMessageItem.module.css";
import { Link } from "react-router-dom";

const DirectMessageItem = (props) => {
  let isSelected = false;
  if (
    props.selectedTab === props.link ||
    (props.selectedTab.indexOf("/friends") === 0 && props.link === "/friends")
  ) {
    isSelected = true;
  }

  return (
    <li className={classes["item-wrapper"]}>
      <div className={classes["link-button"]}>
        <Link className={classes["link"]} to={props.link}>
          {
            <div
              className={`${classes["content-layout"]} ${
                isSelected && classes["content-selected"]
              }`}
            >
              <div className={classes["avatar-wrapper"]}>
                <Avatar image={props.avatar} size={32}></Avatar>
              </div>
              <div className={classes["text"]}>
                <div> {props.text}</div>
                <div></div>
              </div>
            </div>
          }
        </Link>
      </div>
    </li>
  );
};

export default DirectMessageItem;
