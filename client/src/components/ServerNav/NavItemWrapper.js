import classes from "./NavItemWrapper.module.css";

const NavItemWrapper = (props) => {
  return (
    <div className={classes["wrapper"]} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default NavItemWrapper;
