import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/index.module.css";

import ProductCard from "../components/Products/ProductCard";
import IndexImageSection from "../components/InfoElements/IndexImageSection";

export default function Home(props) {
  const productsList = props.productsList;

  const relevantList = productsList
    .filter((product) => product.relevanceCoefficient)
    .sort((a, b) => b.relevanceCoefficient - a.relevanceCoefficient);

  const discountList = productsList
    .filter((product) => product.discountCoefficient)
    .sort((a, b) => b.discountCoefficient - a.discountCoefficient);

  return (
    <>
      <Head>
        <title>Азбука96 - Учебники, рабочие тетради</title>
      </Head>
      <IndexImageSection className={styles["image-section"]} />
      {relevantList.length ? (
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
      ) : (
        <></>
      )}
      {discountList.length ? (
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
      ) : (
        <></>
      )}
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
