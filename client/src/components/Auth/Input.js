import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div className={classes["container"]}>
      {props.label && (
        <label
          className={`${classes["label"]} ${props.error && classes["error"]}`}
        >
          {props.label}
          {props.error && (
            <span className={classes["error-text"]}> - {props.error} </span>
          )}
        </label>
      )}
      <div className={classes["input-wrapper"]}>
        <input
          className={classes["input"]}
          name={props.name}
          id={props.id}
          type={props.type}
          aria-label={props.label}
          autoComplete="off"
          onChange={props.onChange}
          onBlur={props.onBlur}
          value={props.value}
        ></input>
      </div>
    </div>
  );
};
export default Input;
