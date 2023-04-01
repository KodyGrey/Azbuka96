import styles from "./Fieldset.module.css";

import checked from "../../public/check-mark_checked.svg";
import unchecked from "../../public/check-mark_unchecked.svg";

const Fieldset = (props) => {
  return (
    <>
      <fieldset
        className={styles["fieldset"]}
        style={{ height: props.height }}
        {...props.fieldset_options}
      >
        <legend className={styles["legend"]}>{props.legend}</legend>
        {props.categories.map((label) => {
          return (
            <div className={styles["option"]} key={label}>
              <input
                type={props.type}
                id={label}
                name={props.legend}
                value={label}
                checked={props.choice === label}
                readOnly={
                  props.fieldset_options && props.fieldset_options.readOnly
                }
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
