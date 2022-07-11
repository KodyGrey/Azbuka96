import Image from "next/image";
import React, { useState } from "react";

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
            <li>Информация о продавце</li>
            <li>Адрес и пунуты выдачи</li>
            <li>Доставка</li>
            <li>График работы</li>
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
            <li>Способы оплаты заказа</li>
            <li>Скидки</li>
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
