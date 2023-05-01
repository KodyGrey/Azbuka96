import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

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
  const [filesMessage, setFilesMessage] = useState("");

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

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setFileMessage(`Загружено: ${percentComplete}%`);
      }
    });

    xhr.addEventListener("load", (event) => {
      if (xhr.status === 200) {
        setFileMessage("Остатки обновлены");
      } else {
        setFileMessage("Ошибка во время отправки");
      }
    });

    xhr.addEventListener("error", (event) => {
      setFileMessage("Ошибка во время отправки");
    });

    xhr.open("POST", "/api/products/remnants");
    xhr.withCredentials = true;
    xhr.send(formData);
  }

  async function onImagesFileSelection(event) {
    const formData = new FormData();

    for (let i = 0; i < event.target.files.length; i++) {
      formData.append(`image${i}`, event.target.files[i]);
    }

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setFilesMessage(`Загружено: ${percentComplete}%`);
      }
    });

    xhr.addEventListener("load", (event) => {
      if (xhr.status === 200) {
        setFilesMessage("Изображения загружены");
      } else {
        setFilesMessage("Ошибка во время отправки");
      }
    });

    xhr.addEventListener("error", (event) => {
      setFilesMessage("Ошибка во время отправки");
    });

    xhr.open("POST", "/api/products/images");
    xhr.withCredentials = true;
    xhr.send(formData);
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
          {fileMessage && <p>{fileMessage}</p>}
        </div>
        <Link href="/product/new" className={styles["add-new-product-link"]}>
          Добавить товар
        </Link>
        <div>
          <label className={styles["csv-block"]}>
            Загрузить изображения
            <input
              type="file"
              accept=".jpg"
              onChange={onImagesFileSelection}
              multiple
            />
          </label>
          {filesMessage && <p>{filesMessage}</p>}
        </div>
        <Link href="/admin/products" className={styles["add-new-product-link"]}>
          Страница с товарами
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

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  } else if (!session.user.isAdmin) {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session: session.user.id,
      },
    };
  }
}
