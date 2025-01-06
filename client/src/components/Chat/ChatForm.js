import classes from "./ChatForm.module.css";
import ChatInput from "./ChatInput";

const ChatForm = (props) => {
  return (
    <form id="chat-form" className={classes["form"]}>
      <div className={classes["container"]}>
        {/* <div className={classes["attach"]}>+</div> */}
        <ChatInput submitMessage={props.submitMessage}></ChatInput>
      </div>
    </form>
  );
};

export default ChatForm;
