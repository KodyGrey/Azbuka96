import styles from "../styles/index.module.css";

import ProductCard from "../components/Products/ProductCard";
import IndexImageSection from "../components/InfoElements/IndexImageSection";

export default function Home() {
  const testProductArgs = {
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
