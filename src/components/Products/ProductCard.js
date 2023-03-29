import React, { useEffect, useState } from "react";
import Image from "next/image";

import Card from "../UI/Card";
import QuantityChanging from "../UI/QuantityChanging";
import Button from "../UI/Button";

import styles from "./ProductCard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import { useRouter } from "next/router";

// Product card for catalogue, search page, etc

const ProductCard = (props) => {
  const id = props.id;
  const productInCart = useSelector((state) => state.cart[id]);
  const dispatch = useDispatch();
  const router = useRouter();

  const [quantityInCart, setQuantityInCart] = useState(productInCart || 0);

  function onRedirectElementClicked() {
    router.push(`/product/${id}`);
  }

  function onAddInCartButtonPressed() {
    dispatch(cartActions.addProduct({ id, quantity: 1 }));
    setQuantityInCart(1);
  }

  function onDecreaseQuantityButtonPressed() {
    if (productInCart > 1) {
      dispatch(cartActions.changeItem({ id, quantity: productInCart - 1 }));
      setQuantityInCart(productInCart - 1);
    } else {
      dispatch(cartActions.removeProduct(id));
    }
  }

  function onIncreaseQuantityButtonPressed() {
    dispatch(cartActions.changeItem({ id, quantity: productInCart + 1 }));
    setQuantityInCart(productInCart + 1);
  }

  const insertAddContentToCartBlock = (props) => {
    if (props.inStock) {
      if (!productInCart) {
        return (
          <div className={styles["in-stock"]}>
            <Button onClick={onAddInCartButtonPressed}>В корзину</Button>
            <div>в наличии</div>
          </div>
        );
      } else {
        return (
          <QuantityChanging
            className={styles["quantity-changing-item"]}
            amount={quantityInCart}
            decrease={{ onClick: onDecreaseQuantityButtonPressed }}
            increase={{ onClick: onIncreaseQuantityButtonPressed }}
          />
        );
      }
    } else if (!props.inStock) {
      return (
        <div className={styles["out-of-stock"]}>
          <div>не в наличии</div>
        </div>
      );
    }
  };

  return (
    <Card className={styles["product-card"]}>
      {/* Product image */}

      <div
        className={styles["product-image"]}
        onClick={onRedirectElementClicked}
      >
        <Image
          src={`${props.url}/${props.image}`}
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

      <div
        className={styles["prices-block"]}
        onClick={onRedirectElementClicked}
      >
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

      <div
        className={styles["description-block"]}
        onClick={onRedirectElementClicked}
      >
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
