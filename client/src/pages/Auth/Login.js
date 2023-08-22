import { useState } from "react";
import Button from "../../components/Auth/Button";
import Input from "../../components/Auth/Input";
import TextButton from "../../components/Auth/TextButton";
import useInput from "../../hooks/useInput";
import classes from "./Login.module.css";

const Login = (props) => {
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const {
    value: enteredEmail,
    valueChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput((value) => value.includes("@"));

  const {
    value: enteredPassword,
    valueChangeHandler: passwordChangeHandler,
    onBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput((value) => value.trim() !== "");

  const submitHandler = async (event) => {
    event.preventDefault();

    const data = { email: enteredEmail, password: enteredPassword };

    // Add validation for input before sending request

    const resData = await props.loginHandler(data);
    console.log(resData);

    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);

    // Get errors from response from server, show same error for email and password
    if (resData.errors) {
      resData.errors.forEach((element) => {
        if (element.path === "email" || element.path === "password") {
          setPasswordError(element.msg);
          setEmailError(element.msg);
        }
      });

      resetEmail();
      resetPassword();
      return;
    }
  };

  return (
    <div className={classes["wrapper"]}>
      <form className={classes["form"]} onSubmit={submitHandler}>
        <div className={classes["header"]}>
          <h1 className={classes["heading"]}>Welcome back!</h1>
          <div className={classes["header-text"]}>
            We're so excited to see you again!
          </div>
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
            name="password"
            label="password"
            type="password"
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            value={enteredPassword}
            error={passwordError}
          ></Input>
          <Button type="submit">Log In</Button>
          <div>
            <span className={classes["text"]}>Need an account?</span>
            <TextButton link="/register">Register</TextButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
