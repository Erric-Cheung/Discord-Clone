import classes from "./AddFriendInput.module.css";

const AddFriendInput = (props) => {
  // Sends message
  return (
    <div className={classes["input-wrapper"]}>
      <input
        onChange={(e) => props.onChange(e)}
        value={props.value}
        className={`${classes["input"]} ${classes["input-padding"]}`}
        placeholder="You can add friends with their username."
      ></input>
    </div>
  );
};

export default AddFriendInput;
