import React, { useEffect, useState } from "react";
import Image from "next/image";

import Card from "../UI/Card";
import QuantityChanging from "../UI/QuantityChanging";
import Button from "../UI/Button";

import styles from "./ProductCard.module.css";

// Product card for catalogue, search page, etc

const ProductCard = (props) => {
  const [type, setType] = useState(props.type);

  const insertAddContentToCartBlock = (props) => {
    if (props.type === "inStock") {
      return (
        <div className={styles["in-stock"]}>
          <Button>В корзину</Button>
          <div>в наличии</div>
        </div>
      );
    } else if (props.type === "outOfStock") {
      return (
        <div className={styles["out-of-stock"]}>
          <div>не в наличии</div>
        </div>
      );
    } else if (props.type === "inCart") {
      return (
        <QuantityChanging
          className={styles["quantity-changing-item"]}
          amount={props.amount}
        />
      );
    }
  };

  return (
    <Card className={styles["product-card"]}>
      {/* Product image */}

      <div className={styles["product-image"]}>
        <Image
          src={props.image}
          alt={props.title}
          objectFit="scale-down"
          objectPosition={"50% 50%"}
          layout="fill"
        />
        {props.discountedPrice && (
          <div>
            {`${
              Math.round((props.discountedPrice / props.price) * 100) - 100
            }%`}
          </div>
        )}
      </div>

      {/* Price block */}

      <div className={styles["prices-block"]}>
        <div className={styles["price"]}>
          {`${props.discountedPrice ?? props.price} ₽`}
        </div>
        {typeof props.discountedPrice !== "undefined" && (
          <div
            className={styles["price-without-discount"]}
          >{`${props.price} ₽`}</div>
        )}
      </div>

      {/* Product description block */}

      <div className={styles["description-block"]}>
        <div className={styles["title"]}>{props.title}</div>
        <div className={styles["author"]}>{props.author}</div>
      </div>

      {/* Cart manipulation block */}

      <div className={styles["add-to-cart-block"]}>
        {insertAddContentToCartBlock(props)}
      </div>
    </Card>
  );
};

export default ProductCard;
