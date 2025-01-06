import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={classes["container"]}>
      <div className={classes["text"]}>Connecting</div>
    </div>
  );
};

export default Loading;
