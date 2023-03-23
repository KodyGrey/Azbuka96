import React, { useState } from "react";

import Button from "./Button";
import styles from "./QuantityChanging.module.css";

// Block that allows to change quantity of the product in cart or
// somewhere else directly from product card

const QuantityChanging = (props) => {
  const [value, setValue] = useState(props.amount ?? "1");
  const [prevValue, setPrevValue] = useState(value);

  const onValueChangeHandler = (event) => {
    setValue(event.target.value);
  };
  const onBlurHandler = () => {
    if (value === "0") {
      return;
    }
    if (!value || Number(value) % 1 !== 0 || value < 0) {
      setValue(prevValue);
    } else {
      setPrevValue(value);
    }
  };

  return (
    <div
      className={`${props.className ?? ""} ${
        styles["quantity-changing-block"]
      }`}
    >
      {/* NB! there is unicode minus */}
      <Button className={styles["decrease"]} {...props.decrease}>
        −
      </Button>
      <input
        className={styles["number"]}
        type="number"
        value={props.amount}
        min="0"
        readOnly
        // onChange={onValueChangeHandler}
        // onBlur={onBlurHandler}
      />
      <Button className={styles["increase"]} {...props.increase}>
        +
      </Button>
    </div>
  );
};

export default QuantityChanging;
