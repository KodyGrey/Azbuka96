import ProductHorizontalCard from "../../components/Products/ProductHorizontalCard";
import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";
import Fieldset from "../../components/Fieldset/Fieldset";
import Card from "../../components/UI/Card";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import styles from "../../styles/cart.module.css";
import profileStyles from "../../styles/profile/index.module.css";

export default function OrderPage(props) {
  const fieldsetRef = useRef();
  const isLegalEntityRef = useRef();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [comment, setComment] = useState("");

  const statusRef = useRef();
  const router = useRouter();

  const id = router.query.id;
  const [orderInfo, setOrderInfo] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [statusChangingMessage, setStatusChangingMessage] = useState("");
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
          console.log(data);
          setDeliveryAddress(data.deliveryAddress);
          setComment(data.comment);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          router.push("/404");
        });
    }

    getOrderInfo();
  }, [id, router]);

  useEffect(() => {
    async function getClientInfo(userId) {
      fetch(`/api/users/${userId}`, {
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
          setClientInfo(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          // router.push("/404");
        });
    }

    getClientInfo(orderInfo.userId);
  }, [orderInfo]);

  async function onChangingOrderSubmit(event) {
    event.preventDefault();
    if (!statusRef.current.querySelector("input:checked")) {
      setStatusChangingMessage("Выберете тип доставки");
      return;
    }
    const data = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: statusRef.current.querySelector("input:checked").value,
        deliveryType: fieldsetRef.current.querySelector("input:checked").value,
        deliveryAddress,
        comment,
        isLegalEntity:
          !!isLegalEntityRef.current.querySelector("input:checked"),
      }),
    }).then((res) => res.json());
    setStatusChangingMessage(
      data.ok ? "Успешно изменено" : "Ошибка при изменении"
    );
  }

  return (
    <>
      <Head>
        <title>Азбука96 - Заказ №{orderInfo.number}</title>
      </Head>
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
            <div className={styles["totals-block"]}>
              <div className={styles["total-price-block"]}>
                <div className={styles["total-price-text"]}>Итого:</div>
                <div className={styles["total-price"]}>
                  {orderInfo.totalPrice} ₽
                </div>
              </div>
              <div className={styles["total-price-block"]}>
                <div className={styles["total-price-text"]}>
                  Предоставленная скидка:
                </div>
                <div className={styles["total-price"]}>
                  {orderInfo.shopDiscount}%
                </div>
              </div>
            </div>
            {props.isAdmin && (
              <div
                className={`${profileStyles["elements"]}`}
                style={{
                  display: "flex",
                }}
              >
                <h2>Информация о покупателе</h2>
                <Card className={`${profileStyles["element-card"]}`}>
                  <h3>ФИО</h3>
                  <p>{clientInfo.name}</p>
                </Card>

                <Card className={`${profileStyles["element-card"]}`}>
                  <h3>Город</h3>
                  <p>{clientInfo.city}</p>
                </Card>

                <Card className={`${profileStyles["element-card"]}`}>
                  <h3>E-mail</h3>
                  <p>{clientInfo.email}</p>
                </Card>
                <Card className={`${profileStyles["element-card"]}`}>
                  <h3>Номер Телефона</h3>
                  <p>{clientInfo.phoneNumber}</p>
                </Card>
              </div>
            )}
            <form className={styles["delivery-form"]}>
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
                  readOnly: !props.isAdmin,
                  defaultValue: orderInfo.deliveryType,
                  onChange: (event) => {
                    setOrderInfo({
                      ...orderInfo,
                      deliveryType: event.target.value,
                    });
                  },
                }}
              />
              <Fieldset
                key="isLegalEntity"
                legend="Тип заказа"
                type="checkbox"
                height="fit-content"
                categories={["Заказать как Юрлицо"]}
                fieldset_options={{
                  ref: isLegalEntityRef,
                  required: false,
                  readOnly: !props.isAdmin,
                  defaultValue: orderInfo.isLegalEntity
                    ? "Заказать как Юрлицо"
                    : undefined,
                }}
              />
              <TextInput
                placeholder="Адрес доставки"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                readOnly={!props.isAdmin}
              />
              <TextInput
                placeholder="Комментарий к заказу"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                readOnly={!props.isAdmin}
              />
            </form>
            {props.isAdmin && (
              <>
                <Button
                  isSecondary={true}
                  style={{ width: "297px", height: "48px" }}
                  onClick={() => {
                    fetch(`/api/orders/reciept/${id}`)
                      .then((response) => response.blob())
                      .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `Счёт № ${orderInfo.number} Азбука96.xlsx`;
                        link.click();
                      });
                  }}
                >
                  Скачать накладную
                </Button>
                <form className={styles["delivery-form"]}>
                  <Fieldset
                    key="status"
                    legend="Статус"
                    type="radio"
                    height="230px"
                    categories={[
                      "В обработке",
                      "В сборке",
                      "В пункте выдачи",
                      "В доставке",
                      "Отменен",
                      "Завершен",
                    ]}
                    fieldset_options={{
                      ref: statusRef,
                      required: true,
                      defaultValue: orderInfo.status,
                      onChange: (event) => {
                        setOrderInfo({
                          ...orderInfo,
                          status: event.target.value,
                        });
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    style={{ width: "297px", height: "48px" }}
                    onClick={onChangingOrderSubmit}
                  >
                    Сохранить изменения в заказе
                  </Button>
                  {statusChangingMessage && <p>{statusChangingMessage}</p>}
                </form>
              </>
            )}
          </>
        )}
      </div>
    </>
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
      isAdmin: session.user.isAdmin,
    },
  };
}
