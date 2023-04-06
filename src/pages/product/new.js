import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";
import Fieldset from "../../components/Fieldset/Fieldset";
import Card from "../../components/UI/Card";

import styles from "../../styles/product/new.module.css";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState, useRef } from "react";

export default function NewProduct(props) {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const inStockFieldsetRef = useRef();
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [bookID, setBookID] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const onNewProductFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const inStockElement =
      inStockFieldsetRef.current.querySelector("input:checked");
    if (
      !(
        image &&
        title &&
        publisher &&
        author &&
        grade &&
        subject &&
        inStockElement
      )
    ) {
      setErrorMessage("Не заполнены необходимые поля");
      return;
    }

    formData.append("image", image);
    formData.append("title", title);
    formData.append("publisher", publisher);
    formData.append("author", author);
    formData.append("grade", grade);
    formData.append("subject", subject);
    formData.append("inStock", inStockElement.value === "В наличии");
    formData.append("price", price);
    formData.append("discountedPrice", discountedPrice);
    formData.append("bookID", bookID);
    formData.append("description", description);

    fetch("/api/products", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          setSuccessMessage("Товар успешно добавлен!");
        } else {
          setErrorMessage("Ошибка при отправке");
        }
      })
      .catch((error) => {
        setErrorMessage(String(error));
      });
  };
  return (
    <div className={styles["new-product-page"]}>
      <h2>Добавление товара</h2>
      {errorMessage && (
        <Card className={styles["error-message"]}>{errorMessage}</Card>
      )}
      {successMessage && (
        <Card className={styles["success-message"]}>{successMessage}</Card>
      )}
      <form
        onSubmit={onNewProductFormSubmit}
        className={styles["product-form"]}
      >
        <label className={styles["image-block"]}>
          Изображение
          <input
            type="file"
            accept="image/png, image/jpg, image/gif, image/jpeg"
            onChange={(event) => setImage(event.target.files[0])}
          />
          {image && <p>{image.name}</p>}
        </label>
        <label className={styles["text-input-block"]}>
          Название
          <TextInput
            placeholder="Русский родной язык. 3 класс. Учебник. ФГОС"
            required={true}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className={styles["text-input-block"]}>
          Автор
          <TextInput
            placeholder="Александрова Ольга Маратовна"
            required={true}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>
        <label className={styles["text-input-block"]}>
          Описание
          <TextInput
            placeholder="Описание"
            required={false}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label className={styles["text-input-block"]}>
          Цена
          <TextInput
            placeholder="1000"
            required={true}
            type="number"
            min="0"
            step="0.01"
            onChange={(event) => setPrice(event.target.value)}
          />
        </label>
        <label className={styles["text-input-block"]}>
          Скидочная цена
          <TextInput
            placeholder="900"
            required={false}
            type="number"
            min="0"
            step="0.01"
            onChange={(event) => setDiscountedPrice(event.target.value)}
          />
        </label>
        <label className={styles["text-input-block"]}>
          ID книги
          <TextInput
            placeholder="12345"
            required={true}
            onChange={(event) => setBookID(event.target.value)}
          />
        </label>
        <Fieldset
          key="inStock"
          legend="Наличие"
          type="radio"
          categories={["В наличии", "Не в наличии"]}
          fieldset_options={{ required: true, ref: inStockFieldsetRef }}
        />
        <label className={styles["text-input-block"]}>
          Класс
          <TextInput
            placeholder="3 класс"
            required={true}
            onChange={(event) => setGrade(event.target.value)}
          />
        </label>
        <label className={styles["text-input-block"]}>
          Предмет
          <TextInput
            placeholder="Русский родной язык"
            required={true}
            onChange={(event) => setSubject(event.target.value)}
          />
        </label>
        <label className={styles["text-input-block"]}>
          Издательство
          <TextInput
            placeholder="Просвещение"
            required={true}
            onChange={(event) => setPublisher(event.target.value)}
          />
        </label>
        <Button type="submit" className={styles["add-product-button"]}>
          Добавить
        </Button>
      </form>
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
