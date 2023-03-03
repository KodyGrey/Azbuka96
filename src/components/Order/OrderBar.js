import styles from "./OrderBar.module.css";

import Card from "../UI/Card";
import Button from "../UI/Button";

function OrderBar(props) {
  return (
    <Card className={styles["order-bar"]}>
      <div className={styles["number"]}>№{props["Number"]}</div>

      <div
        className={`${styles["text"]} ${props["TextClass"]}`}
        style={props["TextStyle"]}
      >
        {props["Text"]}
      </div>

      <div className={styles["money"]}>{props["Money"]} ₽</div>

      <div className={styles["date"]}>{props["Date"]}</div>

      <Button isSecondary={true} className={styles["about-button"]}>
        Подробнее
      </Button>
    </Card>
  );
}

export default OrderBar;
