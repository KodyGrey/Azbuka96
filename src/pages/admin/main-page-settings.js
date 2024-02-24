import styles from "../../styles/admin/main-page-settings.module.css";
import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function MainPageSettings(props) {
  const productsList = props.productsList;
  const router = useRouter();
  const amountOfElements = 25;

  function findRelevant(c) {
    const foundElement = productsList.find(
      (product) => product.relevanceCoefficient === c
    );
    if (!foundElement) return "";
    return foundElement.bookID;
  }

  const [relevant, setRelevant] = useState([]);

  const [successfulRelevanceSave, setSuccessfulRelevanceSave] = useState(false);

  async function updateRelevanceCoefficients() {
    for (let i = 0; i < relevant.length; i++) {
      let el = productsList.find(
        (product) => findRelevant(amountOfElements - i) === product.bookID
      );
      if (el) {
        let index = productsList.findIndex((product) => product === el);
        productsList[index].relevanceCoefficient = 0;
        props.setProductsList(productsList);
        const res = await fetch(`/api/products/${el._id}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({ relevanceCoefficient: 0 }),
        });
        console.log(res);
      }
    }
    for (let i = 0; i < relevant.length; i++) {
      if (!relevant[i]) continue;
      let el = productsList.find((product) => product.bookID === relevant[i]);
      if (el) {
        let index = productsList.findIndex((product) => product === el);
        productsList[index].relevanceCoefficient = amountOfElements - i;
        props.setProductsList(productsList);
        const res = await fetch(`/api/products/${el._id}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            relevanceCoefficient: amountOfElements - i,
          }),
        });
        console.log(res);
      }
    }

    setSuccessfulRelevanceSave(true);
  }

  function findDiscounted(c) {
    const foundElement = productsList.find(
      (product) => product.discountCoefficient === c
    );
    if (!foundElement) return "";
    return foundElement.bookID;
  }

  const [discount, setDiscount] = useState([]);

  const [successfulDiscountSave, setSuccessfulDiscountSave] = useState(false);

  async function updateDiscountedCoefficients() {
    for (let i = 0; i < discount.length; i++) {
      let el = productsList.find(
        (product) => findDiscounted(amountOfElements - i) === product.bookID
      );
      if (el) {
        let index = productsList.findIndex((product) => product === el);
        productsList[index].discountCoefficient = 0;
        props.setProductsList(productsList);
        const res = await fetch(`/api/products/${el._id}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({ discountCoefficient: 0 }),
        });
        console.log(res);
      }
    }
    for (let i = 0; i < discount.length; i++) {
      if (!discount[i]) continue;
      let el = productsList.find((product) => product.bookID === discount[i]);
      if (el) {
        let index = productsList.findIndex((product) => product === el);
        productsList[index].discountCoefficient = amountOfElements - i;
        props.setProductsList(productsList);
        const res = await fetch(`/api/products/${el._id}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            discountCoefficient: amountOfElements - i,
          }),
        });
        console.log(res);
      }
    }

    setSuccessfulDiscountSave(true);
  }

  useEffect(() => {
    console.log("start");
    const [rel, dis] = [[], []];
    for (let i = 0; i < amountOfElements; i++) {
      rel.push(findRelevant(amountOfElements - i));
      dis.push(findDiscounted(amountOfElements - i));
    }
    setRelevant(rel);
    setDiscount(dis);
    console.log(relevant);
  }, []);

  return (
    <>
      <Head>
        <title>Азбука96 - Настройка главной страницы</title>
      </Head>
      <div className={styles["main-page-settings-page"]}>
        <div>
          <h2>Настройка актуального</h2>
          <form className={styles["form"]}>
            <p>
              В полях необходимо указать артикул требуемого продукта, например,
              00158
            </p>
            {relevant.map((value, index) => {
              return (
                <label key={index + 1}>
                  {index + 1}.
                  <TextInput
                    value={value}
                    onChange={(event) => {
                      const obj = [...relevant];
                      obj[index] = event.target.value.trim();
                      setRelevant(obj);
                    }}
                  ></TextInput>
                </label>
              );
            })}
            <Button
              type="button"
              className={styles["save-button"]}
              onClick={updateRelevanceCoefficients}
            >
              Сохранить
            </Button>
            {successfulRelevanceSave && (
              <p style={{ color: "green" }}>Успешно сохранено</p>
            )}
            <p>
              В случае, если значения будут пустыми - первыми будут наиболее
              часто покупаемые продукты
            </p>
          </form>
        </div>
        <div>
          <h2>Настройка скидок</h2>
          <form className={styles["form"]}>
            <p>
              В полях необходимо указать артикул требуемого продукта, например,
              00158
            </p>

            {discount.map((value, index) => {
              return (
                <label key={index + 1}>
                  {index + 1}.
                  <TextInput
                    value={value}
                    onChange={(event) => {
                      const obj = [...discount];
                      obj[index] = event.target.value.trim();
                      setDiscount(obj);
                    }}
                  ></TextInput>
                </label>
              );
            })}

            <Button
              type="button"
              className={styles["save-button"]}
              onClick={updateDiscountedCoefficients}
            >
              Сохранить
            </Button>
            {successfulDiscountSave && (
              <p style={{ color: "green" }}>Успешно сохранено</p>
            )}
            <p>
              В случае, если значения будут пустыми - первыми будут продукты с
              наибольшей скидкой (в процентах)
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
