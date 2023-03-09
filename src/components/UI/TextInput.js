import Card from "./Card";

import styles from "./TextInput.module.css";

function TextInput(props) {
  return (
    <input
      {...props}
      className={`${styles["text-input"]} ${props["className"]}`}
    />
  );
}

export default TextInput;
