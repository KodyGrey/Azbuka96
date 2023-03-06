import Card from "./Card";

import styles from "./TextInput.module.css";

function TextInput(props) {
  return <input className={styles["text-input"]} {...props} />;
}

export default TextInput;
