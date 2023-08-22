import { useState } from "react";

const useInput = (validation) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const validInput = validation(enteredValue);
  const shouldDisplayError = isTouched && ! validInput;

  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  const onBlurHandler = () => {
    setIsTouched(true);
  };

  return {
    value: enteredValue,
    isValid: validInput,
    shouldDisplayError: shouldDisplayError,
    valueChangeHandler: valueChangeHandler,
    onBlurHandler: onBlurHandler,
    reset: reset,
  };
};
export default useInput;
