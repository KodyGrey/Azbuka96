import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";

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
  const [value, setValue] = useState("");
  const [valueFlag, setValueFlag] = useState(false);

  function onRedirectElementClicked() {
    router.push(`/product/${id}`);
  }

  function onAddInCartButtonPressed() {
    dispatch(cartActions.addProduct({ id, quantity: 1 }));
  }

  function onDecreaseQuantityButtonPressed() {
    if (productInCart > 1) {
      dispatch(cartActions.changeItem({ id, quantity: productInCart - 1 }));
    } else {
      dispatch(cartActions.removeProduct(id));
    }
  }

  function onIncreaseQuantityButtonPressed() {
    dispatch(cartActions.changeItem({ id, quantity: productInCart + 1 }));
  }

  function onBlurAmountHandler(event) {
    event.preventDefault();
    if (isNaN(event.target.value)) {
      setValueFlag(false);
      setValue(productInCart.toString());
    }
    if (Number(event.target.value) < 1) {
      setValueFlag(false);
      setValue(productInCart.toString());
    } else {
      dispatch(
        cartActions.changeItem({ id, quantity: Number(event.target.value) })
      );
      setValueFlag(false);
      setValue(productInCart.toString());
    }
  }
  function onChangeAmountHandler(event) {
    event.preventDefault();
    setValueFlag(true);
    setValue(event.target.value);
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
            key={id}
            className={styles["quantity-changing-item"]}
            amount={productInCart}
            decrease={{ onClick: onDecreaseQuantityButtonPressed }}
            increase={{ onClick: onIncreaseQuantityButtonPressed }}
            changeAmount={{
              onBlur: onBlurAmountHandler,
              onChange: onChangeAmountHandler,
            }}
            value={value}
            valueFlag={valueFlag}
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
        {props.discountedPrice && (
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
