import { useState } from "react";
import useInput from "../../hooks/useInput";
import Button from "../../components/Auth/Button";
import Input from "../../components/Auth/Input";
import TextButton from "../../components/Auth/TextButton";
// import Dropdown from "../../components/Auth/Dropdown";
import classes from "./Login.module.css";

const Register = (props) => {
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const {
    value: enteredEmail,
    valueChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
  } = useInput((value) => value.includes("@"));

  const {
    value: enteredPassword,
    valueChangeHandler: passwordChangeHandler,
    onBlurHandler: passwordBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredUsername,
    valueChangeHandler: usernameChangeHandler,
    onBlurHandler: usernameBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const submitHandler = async (event) => {
    event.preventDefault();

    const data = {
      email: enteredEmail,
      password: enteredPassword,
      username: enteredUsername,
    };

    // Add validation for input before sending request

    const resData = await props.registerHandler(data);
    console.log(resData);

    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);
    setUsernameError(null);

    if (resData.errors) {
      resData.errors.forEach((element) => {
        if (element.path === "email") {
          setEmailError(element.msg);
        }
        if (element.path === "username") {
          setUsernameError(element.msg);
        }
        if (element.path === "password") {
          setPasswordError(element.msg);
        }
      });
      return;
    }

    // Registration success and log in
    props.loginHandler(data);
  };

  return (
    <div className={classes["wrapper"]}>
      <form className={classes["form"]} onSubmit={submitHandler}>
        <div className={classes["header"]}>
          <h1 className={classes["heading"]}>Create an account </h1>
        </div>
        <div className={classes["block"]}>
          <Input
            name="email"
            label="email"
            type="text"
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            value={enteredEmail}
            error={emailError}
          ></Input>
          <Input
            name="username"
            label="username"
            type="text"
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
            value={enteredUsername}
            error={usernameError}
          ></Input>
          <Input
            name="password"
            label="password"
            type="password"
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            value={enteredPassword}
            error={passwordError}
          ></Input>
          {/* <fieldset>
            <Dropdown></Dropdown>
            <Dropdown></Dropdown>
            <Dropdown></Dropdown>
          </fieldset> */}
          <Button type="submit">Continue</Button>
          <div>
            <TextButton link="/login">Already have an account?</TextButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
