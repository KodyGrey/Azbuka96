import styles from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      {...props}
      className={`${props.className} ${
        props.isSecondary ? styles.secondary : styles.primary
      }`}
    >
      {props.children}
    </button>
  );
};

export default Button;
