import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header/Header";
import ProductCard from "../components/Products/ProductCard";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

import productImage from "../public/product-image.jpg";

export default function Home() {
  return (
    <>
      <Header></Header>
      <ProductCard
        author="Александрова Ольга Маратовна"
        discountedPrice={1422}
        image={productImage}
        price={2022}
        title="Русский родной язык. 3 класс. Учебник. ФГОС"
        type="inCart"
        amount="12"
      />
    </>
  );
}
