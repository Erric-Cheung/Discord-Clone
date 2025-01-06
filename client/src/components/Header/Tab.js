import { Link } from "react-router-dom";
import classes from "./Tab.module.css";

const MainHeaderTab = (props) => {
  let isSelected = false;
  if (props.selectedTab === props.link) {
    isSelected = true;
  }

  return (
    <Link
      to={props.link}
      style={{ textDecoration: "none" }}
      className={`${classes["tab"]} ${isSelected && classes["selected"]}`}
    >
      {props.title}
    </Link>
  );
};

export default MainHeaderTab;
