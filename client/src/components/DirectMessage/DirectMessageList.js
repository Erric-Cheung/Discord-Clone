import { useLocation } from "react-router-dom";
import DirectMessageItem from "./DirectMessageItem";
import classes from "./DirectMessageList.module.css";
import DirectMessagesHeader from "./DirectMessagesHeader";

const DirectMessageList = (props) => {
  const { pathname } = useLocation();

  return (
    <ul className={classes["item-list"]}>
      <div className={classes["gap"]}></div>

      <DirectMessageItem
        text="Friends"
        avatar="https://animedao.to/images/call-of-the-night.jpg"
        link="/friends"
        selectedTab={pathname}
      ></DirectMessageItem>

      <DirectMessagesHeader></DirectMessagesHeader>

      {props.directMessages.map((directMessage) => (
        <DirectMessageItem
          text={directMessage.username}
          key={directMessage.chatId}
          avatar={"https://animedao.to/images/call-of-the-night.jpg"}
          link={`/${directMessage.chatId}`}
          selectedTab={pathname}
        ></DirectMessageItem>
      ))}
    </ul>
  );
};

export default DirectMessageList;