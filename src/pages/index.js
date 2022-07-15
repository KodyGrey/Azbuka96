import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header/Header";
import ProductCard from "../components/Products/ProductCard";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Footer from "../components/Footer/Footer";

import productImage from "../public/product-image.jpg";
import checkimage from "../public/check-mark_checked.svg";
import ProductHorizontalCard from "../components/Products/ProductHorizontalCard";
import MenuBar from "../components/MenuBar/MenuBar";

export default function Home() {
  return (
    <>
      <Header></Header>
      <ProductCard
        key="32456"
        author="Александрова Ольга Маратовна"
        discountedPrice={1422}
        image={productImage}
        price={2022}
        title="Русский родной язык. 3 класс. Учебник. ФГОС"
        type="inCart"
        amount="12"
      />
      <Footer />
      <ProductHorizontalCard
        key="32456"
        author="Александрова Ольга Маратовна"
        discountedPrice={1422}
        image={productImage}
        price={2022}
        title="Русский родной язык. 3 класс. Учебник. ФГОС"
        type="inOrder"
        amount="12"
      />
      <MenuBar />
      <Image src={checkimage} />
    </>
  );
}
