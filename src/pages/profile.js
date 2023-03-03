import { useState } from "react";
import Image from "next/image";
import styles from "../styles/profile.module.css";

import Card from "../components/UI/Card";
import Button from "../components/UI/Button";

import imageArrow from "../public/arrow-down-black.svg";

export default function Profile() {
  const [ProfileOpened, setProfileOpened] = useState(false);
  const [OrdersOpened, setOrdersOpened] = useState(false);

  const onProfileClickHandler = () => {
    setProfileOpened(!ProfileOpened);
  };
  const onOrdersClickHandler = () => {
    setOrdersOpened(!OrdersOpened);
  };

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
            <p>Иванов Иван Иванович</p>
          </Card>

          <Card className={`${styles["element-card"]}`}>
            <h3>Город</h3>
            <p>Екатеринбург</p>
          </Card>

          <Card className={`${styles["element-card"]}`}>
            <h3>E-mail</h3>
            <p>ivan@yandex.net</p>
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
        ></div>
      </section>
    </section>
  );
}
