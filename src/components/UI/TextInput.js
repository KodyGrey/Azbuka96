import Card from "./Card";

import styles from "./TextInput.module.css";

function TextInput(props) {
  const properties = {};
  for (let key in props) {
    if (key === "innerRef") continue;
    properties[key] = props[key];
  }
  return (
    <input
      {...properties}
      className={`${styles["text-input"]} ${props["className"]}`}
      ref={props.innerRef}
    />
  );
}

export default TextInput;
