import classes from "./Avatar.module.css";

const Avatar = (props) => {
  return (
    <div className={classes["avatar"]}>
      <img
        style={{ width: `${props.size}px`, height: `${props.size}px` }}
        className={`${classes["avatar-image"]}`}
        src={"https://assets.mofoprod.net/network/images/discord.width-250.jpg"}
        alt=" "
      ></img>
    </div>
  );
};

export default Avatar;
