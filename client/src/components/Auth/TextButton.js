import { useNavigate } from "react-router-dom";
import classes from "./TextButton.module.css";

const TextButton = (props) => {
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(props.link);
  };

  return (
    <button
      type="button"
      className={classes["text-button"]}
      onClick={onClickHandler}
    >
      {props.children}
    </button>
  );
};

export default TextButton;
