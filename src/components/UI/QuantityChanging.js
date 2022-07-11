import React, { useState } from "react";

import Button from "./Button";
import styles from "./QuantityChanging.module.css";

// Block that allows to change quantity of the product in cart or
// somewhere else directly from product card

const QuantityChanging = (props) => {
  const [value, setValue] = useState(props.amount);
  const [prevValue, setPrevValue] = useState(value);

  const onValueChangeHandler = (event) => {
    setValue(event.target.value);
  };
  const onBlurHandler = () => {
    if (value === "0") {
      return;
    }
    if (!value || Number(value) % 1 !== 0) {
      setValue(prevValue);
    } else {
      setPrevValue(value);
    }
  };

  return (
    <div
      className={`${props.blockClass ?? ""} ${
        styles["quantity-changing-block"]
      }`}
    >
      {/* NB! there is unicode minus */}
      <Button className={`${props.buttonClass ?? ""} ${styles["decrease"]}`}>
        −
      </Button>
      <input
        className={styles["number"]}
        type="number"
        value={value}
        min="0"
        onChange={onValueChangeHandler}
        onBlur={onBlurHandler}
      />
      <Button className={`${props.buttonClass ?? ""} ${styles["increase"]}`}>
        +
      </Button>
    </div>
  );
};

export default QuantityChanging;
