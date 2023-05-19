import ProductHorizontalCard from "../components/Products/ProductHorizontalCard";
import Button from "../components/UI/Button";
import TextInput from "../components/UI/TextInput";
import Fieldset from "../components/Fieldset/Fieldset";
import Card from "../components/UI/Card";

import styles from "../styles/cart.module.css";

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/cartSlice";
import { useState, useRef } from "react";
import { useRouter } from "next/router";

export default function CartPage(props) {
  const productsList = props.productsList;
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [makeOrderClicked, setMakeOrderClicked] = useState(false);
  const fieldsetRef = useRef();
  const isLegalEntityRef = useRef();
  const deliveryAddressRef = useRef();
  const commentRef = useRef();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const router = useRouter();

  let total = 0;

  function onMakeOrderButtonClicked(event) {
    if (!props.isLoggedIn) {
      router.push("/api/auth/signin");
    } else if (!makeOrderClicked) {
      setMakeOrderClicked(true);
    }
    event.preventDefault();
  }

  async function onOrderSubmitting(event) {
    const order = {};
    event.preventDefault();
    if (!fieldsetRef.current.querySelector("input:checked")) {
      setErrorMessage("Выберете тип доставки");
      return;
    }

    order.userId = props["user-id"];
    order.deliveryType =
      fieldsetRef.current.querySelector("input:checked").value;
    order.isLegalEntity =
      !!isLegalEntityRef.current.querySelector("input:checked");
    order.deliveryAddress = deliveryAddressRef.current.value;
    order.comment = commentRef.current.value;
    order.products = {};
    for (let key in cart) {
      if (key === "amount") continue;
      order.products[key] = {
        amount: cart[key],
        ...productsList.find((item) => item["_id"] === key),
      };
    }

    if (Object.keys(order.products).length === 0) {
      setErrorMessage("Добавьте товары в корзину");
      return;
    }

    fetch("/api/orders", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(order),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Сетевой запрос не удался");
        }

        return res.json();
      })
      .then((data) => {
        setSuccessMessage("Заказ успешно создан");
        setErrorMessage(null);
        for (let el in cart) {
          if (el === "amount") continue;
          dispatch(cartActions.removeProduct(el));
        }
      })
      .catch((error) => {
        setErrorMessage(String(error));
      });
  }

  return (
    <div className={styles["cart-page"]}>
      <h2>Корзина</h2>
      <div className={styles["products-list"]}>
        {productsList.map((el) => {
          if (cart[el["_id"]]) {
            total += cart[el["_id"]] * (el.discountedPrice ?? el.price);
            return (
              <ProductHorizontalCard
                {...el}
                url={props.url}
                key={el["_id"]}
                id={el["_id"]}
                amount={cart[el["_id"]]}
              />
            );
          }
          return;
        })}
      </div>
      <div className={styles["total-price-block"]}>
        <div className={styles["total-price-text"]}>Итого:</div>
        <div className={styles["total-price"]}>{total} ₽</div>
      </div>
      <p className={styles["text-info"]}>
        Информация о подтверждении заказа, изменениях по вашему заказу,
        предоставленной скидке, накладная, а также информация о способах оплаты
        придет на электронную почту, указанную в вашем профиле
      </p>

      {makeOrderClicked && (
        <form className={styles["delivery-form"]} onSubmit={onOrderSubmitting}>
          <Fieldset
            key="delivery"
            legend="Тип доставки"
            type="radio"
            height="fit-content"
            categories={[
              "Забрать из пункта выдачи",
              "Доставка по Екатеринбургу",
              "Доставка по России",
            ]}
            fieldset_options={{ ref: fieldsetRef, required: true }}
          />
          <Fieldset
            key="isLegalEntity"
            legend="Тип заказа"
            type="radio"
            height="fit-content"
            categories={["Заказать как Юрлицо"]}
            fieldset_options={{ ref: isLegalEntityRef, required: false }}
          />
          <TextInput
            placeholder="Адрес доставки"
            innerRef={deliveryAddressRef}
          />
          <TextInput placeholder="Комментарий к заказу" innerRef={commentRef} />
          {errorMessage && (
            <Card className={styles["error-message"]}>{errorMessage}</Card>
          )}
          {successMessage && (
            <Card className={styles["success-message"]}>{successMessage}</Card>
          )}
          <Button type="submit" className={styles["make-order-button"]}>
            Оформить заказ
          </Button>
        </form>
      )}

      {!makeOrderClicked && (
        <Button
          className={styles["make-order-button"]}
          onClick={onMakeOrderButtonClicked}
        >
          Оформить заказ
        </Button>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      props: {
        isLoggedIn: false,
        url: process.env.RESOURCE_URL,
      },
    };
  } else if (
    !session.user.name ||
    !session.user.city ||
    !session.user.phoneNumber
  ) {
    return {
      redirect: {
        destination: "/profile/update",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isLoggedIn: true,
      "user-id": session.user.id,
      "user-name": session.user.name,
      "user-city": session.user.city,
      email: session.user.email,
      url: process.env.RESOURCE_URL,
    },
  };
}
