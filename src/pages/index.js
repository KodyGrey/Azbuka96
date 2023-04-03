import { useEffect, useState } from "react";
import styles from "../styles/index.module.css";

import ProductCard from "../components/Products/ProductCard";
import IndexImageSection from "../components/InfoElements/IndexImageSection";

export default function Home(props) {
  const productsList = props.productsList;

  productsList.sort((a, b) => b.boughtScore - a.boughtScore);
  const relevantList = productsList.slice(0, 6);
  productsList.sort(
    (a, b) =>
      (a.discountedPrice ?? a.price) / a.price -
      (b.discountedPrice ?? b.price) / b.price
  );
  const discountList = productsList.slice(0, 6);

  return (
    <>
      <IndexImageSection className={styles["image-section"]} />
      <section className={styles["products-grid"]}>
        <h2>Актуальное</h2>
        <div>
          {relevantList.map((el) => {
            return (
              <ProductCard
                {...el}
                url={props.url}
                key={el["_id"]}
                id={el["_id"]}
              />
            );
          })}
        </div>
      </section>
      <section className={styles["products-grid"]}>
        <h2>Скидки</h2>
        <div>
          {discountList.map((el) => {
            return (
              <ProductCard
                {...el}
                url={props.url}
                key={el["_id"]}
                id={el["_id"]}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      url: process.env.RESOURCE_URL,
    },
  };
}
