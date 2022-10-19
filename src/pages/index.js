import styles from "../styles/index.module.css";

import ProductCard from "../components/Products/ProductCard";
import IndexImageSection from "../components/InfoElements/IndexImageSection";

import productImage from "../public/product-image.jpg";

export default function Home() {
  const testProductArgs = {
    key: 32456,
    type: "inStock",
    price: 2022,
    discountedPrice: 1422,
    title: "Русский родной язык. 3 класс. Учебник. ФГОС",
    author: "Александрова Ольга Маратовна",
    amount: 0,
    image: productImage,
  };

  return (
    <>
      <IndexImageSection className={styles["image-section"]} />
      <section className={styles["products-grid"]}>
        <h2>Актуальное</h2>
        <div>
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
        </div>
      </section>
      <section className={styles["products-grid"]}>
        <h2>Скидки</h2>
        <div>
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
          <ProductCard {...testProductArgs} />
        </div>
      </section>
    </>
  );
}
