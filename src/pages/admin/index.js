import { useState, useEffect } from "react";

import OrderBar from "../../components/Order/OrderBar";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import styles from "../../styles/admin/index.module.css";
import Link from "next/link";

export default function AdminPage(props) {
  const statusesList = [
    "В обработке",
    "В сборке",
    "В пункте выдачи",
    "В доставке",
    "Отменен",
    "Завершен",
  ];
  const [selectedStatus, setSelectedStatus] = useState(statusesList[0]);
  const [ordersList, setOrdersList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [fileMessage, setFileMessage] = useState("");

  useEffect(() => {
    async function getOrders() {
      const data = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      for (let i = 0; i < data.length; i++) {
        data[i].date = new Date(data[i].date);
      }

      setOrdersList(data);
    }

    async function getUsers() {
      const data = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());

      setUsersList(data);
    }

    getUsers();
    getOrders();
  }, []);

  async function onRemnantsFileSelection(event) {
    const formData = new FormData();
    formData.append("remnants", event.target.files[0]);

    fetch("/api/products/remnants", {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then((res) => {
      if (res.ok) setFileMessage("Остатки обновлены");
      else setFileMessage("Ошибка во время отправки");
      console.log(res);
    });
  }

  return (
    <div className={styles["admin-page"]}>
      <h2>Страница администратора</h2>
      <div className={styles["products-editing-block"]}>
        <div>
          <label className={styles["csv-block"]}>
            Загрузить файл с товарами
            <input
              type="file"
              accept=".csv"
              onChange={onRemnantsFileSelection}
            />
          </label>
          <p>{fileMessage}</p>
        </div>
        <Link href="/product/new" className={styles["add-new-product-link"]}>
          Добавить товар
        </Link>
      </div>
      <Card className={styles["statuses-bar"]}>
        {statusesList.map((el) => {
          return (
            <div
              className={
                el === selectedStatus
                  ? styles["selected-status"]
                  : styles["unselected-status"]
              }
              key={el}
              onClick={() => setSelectedStatus(el)}
            >
              {el}
            </div>
          );
        })}
      </Card>
      <div className={styles["orders-list"]}>
        {ordersList
          .filter((order) => order.status === selectedStatus)
          .map((order) => {
            let customer = usersList.find((user) => user._id === order.userId);
            return (
              <OrderBar
                id={order["_id"]}
                key={order.number}
                Number={order.number}
                Money={order.totalPrice}
                Date={`${order.date.getDate()}.${order.date.getMonth()}.${order.date.getFullYear()}`}
                Text={customer && customer.name}
              />
            );
          })}
      </div>
    </div>
  );
}
