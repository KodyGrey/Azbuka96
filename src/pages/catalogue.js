import { useState } from "react";
import Image from "next/image";
import styles from "../styles/catalogue.module.css";

import Fieldset from "../components/Fieldset/Fieldset";
import ProductCard from "../components/Products/ProductCard";
import Card from "../components/UI/Card";
import arrowImage from "../public/arrow-left-icon.svg";

export default function Catalogue() {
  const [isFieldsetModalHidden, setIsFieldsetModalHidden] = useState(true);

  const testArgsProductCard = {
    key: 32456,
    type: "inStock",
    price: 2022,
    discountedPrice: 1422,
    title: "Русский родной язык. 3 класс. Учебник. ФГОС",
    author: "Александрова Ольга Маратовна",
    amount: 0,
    image:
      "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproduct-image.f90bfa51.jpg&w=1920&q=75",
  };

  const testArgsFieldset = {
    key: "grade",
    legend: "Класс",
    type: "checkbox",
    height: "fit-content",
    categories: [
      "1 класс",
      "2 класс",
      "3 класс",
      "4 класс",
      "5 класс",
      "6 класс",
      "7 класс",
      "8 класс",
      "9 класс",
      "10 класс",
      "11 класс",
      "Ясельная группа",
      "Младшая группа",
      "Средняя группа",
      "Старшая группа",
      "Подготовительная группа",
    ],
  };

  return (
    <section
      className={`${!isFieldsetModalHidden && styles["overflow-hidden"]} ${
        styles["catalogue"]
      }`}
    >
      <Card
        className={`${!isFieldsetModalHidden && styles["filter-modal"]} ${
          styles["filter-field"]
        }`}
      >
        <a>
          <Image src={arrowImage} alt="Назад" layout="fill" />
        </a>
        <Fieldset {...testArgsFieldset} />
        <Fieldset {...testArgsFieldset} />
      </Card>
      <div className={styles["products-grid"]}>
        <h2>Каталог</h2>
        <div>
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
          <ProductCard {...testArgsProductCard} />
        </div>
      </div>
    </section>
  );
}
