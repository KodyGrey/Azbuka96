import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../styles/profile/index.module.css";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

import imageArrow from "../../public/arrow-down-black.svg";
import OrderBar from "../../components/Order/OrderBar";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import Link from "next/link";

export default function Profile(props) {
  const [ProfileOpened, setProfileOpened] = useState(false);
  const [OrdersOpened, setOrdersOpened] = useState(false);

  const [orders, setOrders] = useState([]);

  const onProfileClickHandler = () => {
    setProfileOpened(!ProfileOpened);
  };
  const onOrdersClickHandler = () => {
    setOrdersOpened(!OrdersOpened);
  };

  useEffect(() => {
    async function getOrders() {
      const data = await (
        await fetch("/api/orders", {
          credentials: "same-origin",
        })
      ).json();
      for (let i = 0; i < data.length; i++) {
        data[i].date = new Date(data[i].date);
      }
      setOrders(data);
    }
    getOrders();
  }, []);

  return (
    <section className={`${styles["profile"]}`}>
      <section>
        <Card
          className={`${styles["head-card"]}`}
          onClick={onProfileClickHandler}
        >
          <h2>Данные профиля</h2>
          <span>
            <Image
              src={imageArrow}
              alt=""
              height={24}
              width={20}
              style={{
                transform: `rotate(${ProfileOpened ? 180 : 0}deg)`,
              }}
            />
          </span>
        </Card>

        <div
          className={`${styles["elements"]}`}
          style={{
            display: ProfileOpened ? "flex" : "none",
          }}
        >
          <Card className={`${styles["element-card"]}`}>
            <h3>ФИО</h3>
            <p>{props["user-name"]}</p>
          </Card>

          <Card className={`${styles["element-card"]}`}>
            <h3>Город</h3>
            <p>{props["user-city"]}</p>
          </Card>

          <Card className={`${styles["element-card"]}`}>
            <h3>E-mail</h3>
            <p>{props["email"]}</p>
          </Card>
          <Card className={`${styles["element-card"]}`}>
            <h3>Номер Телефона</h3>
            <p>{props["user-phone-number"]}</p>
          </Card>
        </div>
      </section>

      <section>
        <Card
          className={`${styles["head-card"]}`}
          onClick={onOrdersClickHandler}
        >
          <h2>Мои заказы</h2>
          <span>
            <Image
              src={imageArrow}
              alt=""
              height={24}
              width={20}
              style={{
                transform: `rotate(${OrdersOpened ? 180 : 0}deg)`,
              }}
            />
          </span>
        </Card>
        <div
          className={`${styles["elements"]}`}
          style={{
            display: OrdersOpened ? "flex" : "none",
          }}
        >
          {orders.map((order) => {
            return (
              <OrderBar
                id={order["_id"]}
                key={order.number}
                Number={order.number}
                Money={order.totalPrice}
                Date={`${order.date.getDate()}.${order.date.getMonth()}.${order.date.getFullYear()}`}
                Text={order.status}
                TextStyle={{
                  color: "#4C9F70",
                }}
              />
            );
          })}
        </div>
      </section>
      {props.isAdmin && (
        <Link className={styles["admin-link"]} href="/admin">
          Зайти в админ панель
        </Link>
      )}
    </section>
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
      "user-id": session.user.id,
      "user-name": session.user.name,
      "user-city": session.user.city,
      "user-phone-number": session.user.phoneNumber,
      email: session.user.email,
      isAdmin: session.user.isAdmin || null,
    },
  };
}
