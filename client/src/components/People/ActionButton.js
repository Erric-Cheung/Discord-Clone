import classes from "./ActionButton.module.css";

const ActionButton = (props) => {
  return (
    <div onClick={props.onClick} className={classes["action-button"]}>
      {props.children}
    </div>
  );
};
export default ActionButton;
