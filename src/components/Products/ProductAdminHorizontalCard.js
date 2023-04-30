import Image from "next/legacy/image";
import { useRouter } from "next/router";
import Link from "next/link";

import styles from "./ProductAdminHorizontalCard.module.css";

import Card from "../UI/Card";

export default function ProductAdminHorizontalCard(props) {
  const id = props.id;
  const router = useRouter();

  function onRedirectElementClicked() {
    router.push(`/product/${id}`);
  }

  return (
    <Card className={styles["card"]}>
      <div className={styles["first-block"]} onClick={onRedirectElementClicked}>
        <div className={styles["product-id"]}>{`#${props.bookID}`}</div>

        <div className={styles["product-image"]}>
          <Image
            src={`${props.url}/${props.image}`}
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
        <div className={styles["categories-block"]}>
          <div>{props.categories.subject}</div>
          <div>{props.categories.grade}</div>
          <div>{props.categories.publisher}</div>
        </div>
        <div className={styles["prices-block"]}>
          {props.discountedPrice && (
            <div
              className={styles["discounted-price"]}
            >{`${props.discountedPrice} ₽`}</div>
          )}
          <div className={styles["price"]}>{`${props.price} ₽`}</div>
        </div>
      </div>
      <Link href={`/product/edit/${id}`} className={styles["edit-link"]}>
        ✎
      </Link>
    </Card>
  );
}
