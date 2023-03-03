import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <div {...props} className={`${props.className} ${styles.card}`}>
      {props.children}
    </div>
  );
};

export default Card;
