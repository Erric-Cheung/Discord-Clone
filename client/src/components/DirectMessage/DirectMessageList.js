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
        link="/friends"
        selectedTab={pathname}
      ></DirectMessageItem>

      <DirectMessagesHeader></DirectMessagesHeader>

      {props.directMessages.map((directMessage) => {
        if (!directMessage.visibility) {
          return null;
        }
        return (
          <DirectMessageItem
            token={props.token}
            key={directMessage.chatId}
            hideDirectMessage={props.hideDirectMessage}
            text={directMessage.username}
            userId={directMessage.userId}
            chatId={directMessage.chatId}
            link={`/${directMessage.chatId}`}
            selectedTab={pathname}
          ></DirectMessageItem>
        );
      })}
    </ul>
  );
};

export default DirectMessageList;
