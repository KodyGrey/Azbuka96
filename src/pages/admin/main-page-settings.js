import styles from "../../styles/admin/main-page-settings.module.css";
import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function MainPageSettings(props) {
  const productsList = props.productsList;
  const router = useRouter();

  function findRelevant(c) {
    const foundElement = productsList.find(
      (product) => product.relevanceCoefficient === c
    );
    if (!foundElement) return "";
    return foundElement.bookID;
  }

  const [relevant1, setRelevant1] = useState("");
  const [relevant2, setRelevant2] = useState("");
  const [relevant3, setRelevant3] = useState("");
  const [relevant4, setRelevant4] = useState("");
  const [relevant5, setRelevant5] = useState("");
  const [relevant6, setRelevant6] = useState("");

  const [successfulRelevanceSave, setSuccessfulRelevanceSave] = useState(false);

  async function updateRelevanceCoefficients() {
    const list = [
      relevant1,
      relevant2,
      relevant3,
      relevant4,
      relevant5,
      relevant6,
    ];
    for (let i = 6; i > 0; i--) {
      let el = productsList.find(
        (product) => findRelevant(i) === product.bookID
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
    for (let i = 6; i > 0; i--) {
      if (!list[6 - i]) continue;
      let el = productsList.find((product) => product.bookID === list[6 - i]);
      if (el) {
        let index = productsList.findIndex((product) => product === el);
        productsList[index].relevanceCoefficient = i;
        props.setProductsList(productsList);
        const res = await fetch(`/api/products/${el._id}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({ relevanceCoefficient: i }),
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

  const [discount1, setDiscount1] = useState("");
  const [discount2, setDiscount2] = useState("");
  const [discount3, setDiscount3] = useState("");
  const [discount4, setDiscount4] = useState("");
  const [discount5, setDiscount5] = useState("");
  const [discount6, setDiscount6] = useState("");

  const [successfulDiscountSave, setSuccessfulDiscountSave] = useState(false);

  async function updateDiscountedCoefficients() {
    const list = [
      discount1,
      discount2,
      discount3,
      discount4,
      discount5,
      discount6,
    ];
    for (let i = 6; i > 0; i--) {
      let el = productsList.find(
        (product) => findDiscounted(i) === product.bookID
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
    for (let i = 6; i > 0; i--) {
      if (!list[6 - i]) continue;
      let el = productsList.find((product) => product.bookID === list[6 - i]);
      if (el) {
        let index = productsList.findIndex((product) => product === el);
        productsList[index].discountCoefficient = i;
        props.setProductsList(productsList);
        const res = await fetch(`/api/products/${el._id}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({ discountCoefficient: i }),
        });
        console.log(res);
      }
    }

    setSuccessfulDiscountSave(true);
  }

  useEffect(() => {
    const relevantList = [
      setRelevant1,
      setRelevant2,
      setRelevant3,
      setRelevant4,
      setRelevant5,
      setRelevant6,
    ];
    const dicountedList = [
      setDiscount1,
      setDiscount2,
      setDiscount3,
      setDiscount4,
      setDiscount5,
      setDiscount6,
    ];

    for (let i = 6; i > 0; i--) {
      relevantList[6 - i](findRelevant(i));
      dicountedList[6 - i](findDiscounted(i));
    }
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
            <label>
              1.
              <TextInput
                value={relevant1}
                onChange={(event) => setRelevant1(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              2.
              <TextInput
                value={relevant2}
                onChange={(event) => setRelevant2(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              3.
              <TextInput
                value={relevant3}
                onChange={(event) => setRelevant3(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              4.
              <TextInput
                value={relevant4}
                onChange={(event) => setRelevant4(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              5.
              <TextInput
                value={relevant5}
                onChange={(event) => setRelevant5(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              6.
              <TextInput
                value={relevant6}
                onChange={(event) => setRelevant6(event.target.value.trim())}
              ></TextInput>
            </label>
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
            <label>
              1.
              <TextInput
                value={discount1}
                onChange={(event) => setDiscount1(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              2.
              <TextInput
                value={discount2}
                onChange={(event) => setDiscount2(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              3.
              <TextInput
                value={discount3}
                onChange={(event) => setDiscount3(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              4.
              <TextInput
                value={discount4}
                onChange={(event) => setDiscount4(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              5.
              <TextInput
                value={discount5}
                onChange={(event) => setDiscount5(event.target.value.trim())}
              ></TextInput>
            </label>
            <label>
              6.
              <TextInput
                value={discount6}
                onChange={(event) => setDiscount6(event.target.value.trim())}
              ></TextInput>
            </label>

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
