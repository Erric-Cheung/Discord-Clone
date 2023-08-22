import { useState } from "react";
import classes from "./ChatInput.module.css";

const ChatInput = (props) => {
  const [enteredValue, setEnteredValue] = useState("");

  let isEmpty = true;
  if (enteredValue !== "") {
    isEmpty = false;
  }

  // Sends message
  const submitHandler = () => {
    props.submitMessage(enteredValue);
    document.getElementById("chatbox").innerHTML = "";
    setEnteredValue("");
  };

  // Handles submission with enter key
  const onKeydownHandler = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitHandler();
      return;
    }
  };

  // Handles input
  const onInputHandler = (event) => {
    setEnteredValue(event.currentTarget.textContent);
  };

  // Handles copy and paste inputs
  const onPasteHandler = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };

  return (
    <div className={classes["text-area"]}>
      <div className={classes["textbox"]}>
        {isEmpty && (
          <div
            className={`${classes["placeholder"]} ${classes["text-padding"]}`}
          >
            Message
          </div>
        )}
        <div
          className={`${classes["text"]} ${classes["text-padding"]}`}
          id="chatbox"
          role="textbox"
          contentEditable="true"
          aria-multiline="true"
          spellCheck="true"
          onKeyDown={onKeydownHandler}
          onInput={onInputHandler}
          onPaste={onPasteHandler}
        ></div>
      </div>
    </div>
  );
};

export default ChatInput;
