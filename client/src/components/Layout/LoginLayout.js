import classes from "./Layout.module.css";

const LoginLayout = (props) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["base"]}>
        <div className={classes["content"]}>{props.children}</div>
      </div>
    </div>
  );
};

export default LoginLayout;
