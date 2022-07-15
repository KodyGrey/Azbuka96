import Image from "next/image";
import styles from "./ProductHorizontalCard.module.css";

import Card from "../UI/Card";
import QuantityChanging from "../UI/QuantityChanging";
import deleteButtonImage from "../../public/delete.svg";

const ProductHorizontalCard = (props) => {
  console.log(props);
  return (
    <Card className={styles["card"]}>
      <div className={styles["first-block"]}>
        <div className={styles["product-id"]}>{`#${props.id}`}</div>

        <div className={styles["product-image"]}>
          <Image
            src={props.image}
            alt={props.title}
            objectFit="scale-down"
            objectPosition={"50% 50%"}
            layout="fill"
          />
        </div>

        <div className={styles["product-description"]}>
          <div className={styles["title"]}>{props.title}</div>
          <div className={styles["author"]}>{props.author}</div>
        </div>
      </div>

      <div className={styles["second-block"]}>
        {props.type === "inCart" && (
          <QuantityChanging
            className={styles["q-changing-block"]}
            amount={props.amount}
          />
        )}

        <div className={styles["prices-block"]}>
          <div className={styles["total-price"]}>{`${
            (props.discountedPrice ?? props.price) * props.amount
          } ₽`}</div>
          <div className={styles["price"]}>{`${
            props.discountedPrice ?? props.price
          } ₽`}</div>
        </div>

        {props.type === "inOrder" && (
          <div className={styles["amount"]}>{`${props.amount} шт.`}</div>
        )}

        {props.type === "inCart" && (
          <Image src={deleteButtonImage} alt="Удалить" width={27} height={27} />
        )}
      </div>
    </Card>
  );
};

export default ProductHorizontalCard;
