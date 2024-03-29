import styles from "./Fieldset.module.css";

import checked from "../../public/check-mark_checked.svg";
import unchecked from "../../public/check-mark_unchecked.svg";
import { useRef, useEffect } from "react";

const Fieldset = (props) => {
  const handleChoiceSelect = (event) => {
    if (props.onChoiceSelect) {
      props.onChoiceSelect(event.target.value);
    }
  };

  useEffect(() => {
    if (
      props.fieldset_options &&
      props.fieldset_options.ref &&
      props.fieldset_options.defaultValue
    ) {
      // Set the default value when the component mounts
      const defaultValue = props.fieldset_options.defaultValue;
      props.fieldset_options.ref.current.querySelector(
        `input[value="${defaultValue}"]`
      ).checked = true;
    }
  }, [props.fieldset_options]);

  return (
    <>
      <fieldset
        className={styles["fieldset"]}
        style={{ height: props.height }}
        {...props.fieldset_options}
      >
        <legend className={styles["legend"]}>{props.legend}</legend>
        {props.categories.map((label) => {
          const checked = {};
          if (
            props.fieldset_options &&
            props.fieldset_options.readOnly &&
            props.choice === label
          )
            checked["checked"] = true;
          else if (props.fieldset_options && props.fieldset_options.readOnly) {
            checked["checked"] = false;
          }
          return (
            <div className={styles["option"]} key={label}>
              <input
                type={props.type}
                id={label}
                name={props.legend}
                value={label}
                readOnly={
                  props.fieldset_options && props.fieldset_options.readOnly
                }
                onChange={handleChoiceSelect}
                {...checked}
              />
              <label htmlFor={label}>{label}</label>
            </div>
          );
        })}
      </fieldset>
    </>
  );
};

export default Fieldset;
