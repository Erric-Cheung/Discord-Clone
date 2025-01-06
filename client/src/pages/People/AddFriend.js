import { useState } from "react";
import AddFriendInput from "../../components/Input/AddFriendInput";
import classes from "./AddFriend.module.css";

const AddFriend = (props) => {
  const [inputtedName, setInputtedName] = useState("");

  const onChangeHandler = (event) => {
    setInputtedName(event.target.value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(inputtedName);
    setInputtedName("");
    const data = { username: inputtedName };

    const res = await fetch("/request/add-friend", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token,
      },
    });

    const resData = await res.json();
    console.log(resData);
  };

  return (
    <header className={classes["header"]}>
      <h2 className={classes["title"]}>ADD FRIEND</h2>
      <form className={classes["form"]} onSubmit={onSubmitHandler}>
        <div className={classes["description"]}>
          You can add friends with their username.
        </div>
        <AddFriendInput
          value={inputtedName}
          onChange={onChangeHandler}
        ></AddFriendInput>
      </form>
    </header>
  );
};

export default AddFriend;
