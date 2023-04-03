import styles from "./OrderBar.module.css";

import Card from "../UI/Card";
import Button from "../UI/Button";

import { useRouter } from "next/router";

function OrderBar(props) {
  const router = useRouter();
  function onAboutButtonClicked(event) {
    router.push(`/order/${props.id}`);
  }

  return (
    <Card className={styles["order-bar"]} onClick={onAboutButtonClicked}>
      <div className={styles["number"]}>№{props["Number"]}</div>

      <div
        className={`${styles["text"]} ${props["TextClass"]}`}
        style={props["TextStyle"]}
      >
        {props["Text"]}
      </div>

      <div className={styles["money"]}>{props["Money"]} ₽</div>

      <div className={styles["date"]}>{props["Date"]}</div>

      <Button
        isSecondary={true}
        className={styles["about-button"]}
        onClick={onAboutButtonClicked}
      >
        Подробнее
      </Button>
    </Card>
  );
}

export default OrderBar;
