import styles from "./Fieldset.module.css";

const Fieldset = (props) => {
  return (
    <fieldset className={styles["fieldset"]} style={{ height: props.height }}>
      <legend className={styles["legend"]}>{props.legend}</legend>
      {props.categories.map((label) => {
        return (
          <div className={styles["option"]} key={label}>
            <input type={props.type} id={label} name={props.legend} />
            <label htmlFor={label}>{label}</label>
          </div>
        );
      })}
    </fieldset>
  );
};

export default Fieldset;
