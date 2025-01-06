import classes from "./SearchButton.module.css";

const SearchButton = () => {
  return (
    <div className={classes["search-button-wrapper"]}>
      <button className={classes["search-button"]}>
        Find or start a conversation
      </button>
    </div>
  );
};

export default SearchButton;
