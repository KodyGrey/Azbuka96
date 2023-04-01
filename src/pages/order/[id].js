import ProductHorizontalCard from "../../components/Products/ProductHorizontalCard";
import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";
import Fieldset from "../../components/Fieldset/Fieldset";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import styles from "../../styles/cart.module.css";

export default function OrderPage(props) {
  const fieldsetRef = useRef();
  const deliveryAddressRef = useRef();
  const commentRef = useRef();
  const router = useRouter();

  const id = router.query.id;
  const [orderInfo, setOrderInfo] = useState({});
  const productsList = props.productsList;

  useEffect(() => {
    async function getOrderInfo() {
      fetch(`/api/orders/${id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setOrderInfo(data);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          router.push("/404");
        });
    }

    getOrderInfo();
  }, [id, router]);

  return (
    <div className={styles["cart-page"]}>
      {Object.keys(orderInfo).length !== 0 && (
        <>
          <h2>Заказ №{orderInfo.number}</h2>
          <div className={styles["products-list"]}>
            {Object.keys(orderInfo.products).map((key) => {
              const el = orderInfo.products[key];
              return (
                <ProductHorizontalCard
                  type="inOrder"
                  {...el}
                  url={props.url}
                  key={el["_id"]}
                  id={el["_id"]}
                />
              );
            })}
          </div>
          <div className={styles["total-price-block"]}>
            <div className={styles["total-price-text"]}>Итого:</div>
            <div className={styles["total-price"]}>
              {orderInfo.totalPrice} ₽
            </div>
          </div>
          <form className={styles["delivery-form"]} readOnly>
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
              fieldset_options={{
                ref: fieldsetRef,
                required: true,
                readOnly: true,
              }}
              choice={orderInfo.deliveryType}
            />
            <TextInput
              placeholder="Адрес доставки"
              innerRef={deliveryAddressRef}
              value={orderInfo.deliveryAddress}
              readOnly
            />
            <TextInput
              placeholder="Комментарий к заказу"
              innerRef={commentRef}
              value={orderInfo.comment}
              readOnly
            />
          </form>{" "}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  } else if (!session.user.name || !session.user.city) {
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
