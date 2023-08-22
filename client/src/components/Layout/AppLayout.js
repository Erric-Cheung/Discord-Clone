import classes from "./Layout.module.css";

const AppLayout = (props) => {
  return (
    <div className={classes["container"]}>
      <nav className={classes["nav-wrapper"]}>{props.nav}</nav>
      <div className={`${classes["base"]} ${classes["app-background"]}`}>
        {props.sidebar}
        <div className={classes["content"]}>{props.children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
