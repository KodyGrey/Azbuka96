import { useRouter } from "next/router";

import styles from "../../styles/search/[query].module.css";
import indexPageStyles from "../../styles/index.module.css";
import Card from "../../components/UI/Card";
import Fieldset from "../../components/Fieldset/Fieldset";
import ProductCard from "../../components/Products/ProductCard";

const SearchPage = () => {
  const router = useRouter();
  const query = router.query.query;
  console.log(query);

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

  return (
    <section className={styles["search-results"]}>
      <h2>Результаты по запросу</h2>
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
      </div>
    </section>
  );
};

export default SearchPage;
