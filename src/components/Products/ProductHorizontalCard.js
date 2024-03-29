import Image from "next/legacy/image";
import styles from "./ProductHorizontalCard.module.css";

import Card from "../UI/Card";
import QuantityChanging from "../UI/QuantityChanging";
import deleteButtonImage from "../../public/delete.svg";

import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import { useRouter } from "next/router";

import { useState } from "react";

const ProductHorizontalCard = (props) => {
  const id = props.id;
  const productInCart = useSelector((state) => state.cart[id]);
  const dispatch = useDispatch();
  const router = useRouter();

  const [quantityInCart, setQuantityInCart] = useState(productInCart || 0);

  const [value, setValue] = useState("");
  const [valueFlag, setValueFlag] = useState(false);

  function onRedirectElementClicked() {
    router.push(`/product/${id}`);
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

  function onDeleteButtonClicked() {
    dispatch(cartActions.removeProduct(id));
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
        {productInCart && props.type !== "inOrder" && (
          <QuantityChanging
            className={styles["q-changing-block"]}
            amount={quantityInCart}
            decrease={{ onClick: onDecreaseQuantityButtonPressed }}
            increase={{ onClick: onIncreaseQuantityButtonPressed }}
            changeAmount={{
              onBlur: onBlurAmountHandler,
              onChange: onChangeAmountHandler,
            }}
            value={value}
            valueFlag={valueFlag}
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

        {productInCart && props.type !== "inOrder" && (
          <Image
            src={deleteButtonImage}
            alt="Удалить"
            width={27}
            height={27}
            onClick={onDeleteButtonClicked}
          />
        )}
      </div>
    </Card>
  );
};

export default ProductHorizontalCard;
