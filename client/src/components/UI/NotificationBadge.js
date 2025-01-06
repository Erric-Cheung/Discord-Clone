import classes from "./NotificationBadge.module.css";

const NotificationBadge = (props) => {
  return (
    <div>
      {props.amount > 0 && (
        <div className={classes.badge}>
          <div className={classes.amount}>{props.amount}</div>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;
