import classes from "./ActivityBadge.module.css";

const ActivityBadge = () => {
  return (
    <div>
      <div className={classes.badge}>
        <div className={classes.amount}></div>
      </div>
    </div>
  );
};

export default ActivityBadge;
