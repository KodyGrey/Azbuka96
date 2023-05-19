import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

import styles from "./Footer.module.css";
import arrowDown from "../../public/arrow-down.svg";
import Card from "../UI/Card";

const Footer = () => {
  const [showingList, setShowingList] = useState({
    first: false,
    second: false,
    third: false,
  });

  const onDropDownListHeaderClickHandler = (event) => {
    const id = event.currentTarget.id;
    setShowingList({
      ...showingList,
      [id]: !showingList[id],
    });
  };

  return (
    <Card>
      <footer className={styles["footer"]}>
        <section
          className={`${showingList.first && styles["show-list"]} ${
            styles["information-section"]
          }`}
        >
          <div onClick={onDropDownListHeaderClickHandler} id="first">
            <h2>О компании</h2>
            <span className={styles["arrow-down"]}>
              <Image src={arrowDown} alt="" layout="fill" />
            </span>
          </div>
          <ul>
            <li>
              <Link href="/about/seller-info">Информация о продавце</Link>
            </li>
            <li>
              <Link href="/about/address">Адрес пунктов выдачи</Link>
            </li>
            <li>
              <Link href="/about/delivery">Доставка</Link>
            </li>
            <li>
              <Link href="/about/work-schedule">График работы</Link>
            </li>
          </ul>
        </section>
        <section
          className={`${showingList.second && styles["show-list"]} ${
            styles["information-section"]
          }`}
        >
          <div onClick={onDropDownListHeaderClickHandler} id="second">
            <h2>Покупателям</h2>
            <span className={styles["arrow-down"]}>
              <Image src={arrowDown} alt="" layout="fill" />
            </span>
          </div>
          <ul>
            <li>
              <Link href="/about/payment">Способы оплаты заказа</Link>
            </li>
            <li>
              <Link href="/about/discounts">Скидки</Link>
            </li>
          </ul>
        </section>
        <section
          className={`${showingList.third && styles["show-list"]} ${
            styles["information-section"]
          }`}
        >
          <div onClick={onDropDownListHeaderClickHandler} id="third">
            <h2>Контакты</h2>
            <span className={styles["arrow-down"]}>
              <Image src={arrowDown} alt="" layout="fill" />
            </span>
          </div>
          <ul>
            <li>🖁 +7(343)200-28-80</li>
            <li>✉ torg5@azbuka96.ru</li>
          </ul>
        </section>
      </footer>
    </Card>
  );
};

export default Footer;
