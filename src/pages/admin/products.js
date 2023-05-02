import { useState, useEffect, useRef } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import ProductAdminHorizontalCard from "../../components/Products/ProductAdminHorizontalCard";
import styles from "../../styles/admin/products.module.css";
import Button from "../../components/UI/Button";

export default function ProductsAdmin(props) {
  const [productsList, setProductsList] = useState(props.productsList);
  const [filteredProducts, setFilteredProducts] = useState(productsList);

  const [searchQuery, setSearchQuery] = useState("");

  const [amountOfShownCards, setAmountOfShownCards] = useState(48);

  const [gradesList, setGradesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [publishersList, setPublishersList] = useState([]);

  const [gradeChosen, setGradeChosen] = useState("None");
  const [publisherChosen, setPublisherChosen] = useState("None");
  const [subjectChosen, setSubjectChosen] = useState("None");
  const [withPhotoChosen, setWithPhotoChosen] = useState("None");

  useEffect(() => {
    let grades = [
      ...new Set(
        productsList.map((el) => el.categories.grade && el.categories.grade)
      ),
    ];
    grades.sort();
    setGradesList(grades);

    let subjects = [
      ...new Set(productsList.map((el) => el.categories.subject)),
    ];
    subjects.sort();
    setSubjectsList(subjects);

    let publishers = [
      ...new Set(productsList.map((el) => el.categories.publisher)),
    ];
    publishers.sort();
    setPublishersList(publishers);
  }, [productsList]);

  function getCountOfMatchingWords(element, searchQuery) {
    const searchRegex = new RegExp(`${searchQuery}`, "gi");
    let count = 0;
    if (String(element.bookID).match(searchRegex)) count += 1000;
    const properties = [
      element.title,
      element.author,
      element.description,
      element.categories.grade,
      element.categories.publisher,
      element.categories.subject,
    ];
    properties.forEach((property) => {
      if (property) {
        const matches = property.match(searchRegex);
        count += matches ? matches.length : 0;
      }
    });
    return count;
  }

  useEffect(() => {
    let filteredProducts = productsList;

    if (gradeChosen !== "None") {
      filteredProducts = filteredProducts.filter(
        (el) => el.categories.grade === gradeChosen
      );
    }
    if (publisherChosen !== "None") {
      filteredProducts = filteredProducts.filter(
        (el) => el.categories.publisher === publisherChosen
      );
    }
    if (subjectChosen !== "None") {
      filteredProducts = filteredProducts.filter(
        (el) => el.categories.subject === subjectChosen
      );
    }
    if (withPhotoChosen !== "None") {
      if (withPhotoChosen === "with")
        filteredProducts = filteredProducts.filter((el) => !!el.image);
      else if (withPhotoChosen === "without")
        filteredProducts = filteredProducts.filter((el) => !el.image);
    }

    if (searchQuery) {
      filteredProducts.sort((a, b) => {
        const countA = getCountOfMatchingWords(a, searchQuery.toLowerCase());
        const countB = getCountOfMatchingWords(b, searchQuery.toLowerCase());
        return countB - countA;
      });
    }

    setFilteredProducts(filteredProducts);
  }, [
    productsList,
    gradeChosen,
    publisherChosen,
    subjectChosen,
    searchQuery,
    withPhotoChosen,
  ]);

  return (
    <div className={styles["admin-products-page"]}>
      <h2>Номенклатура товаров</h2>
      <div className={styles["filters-block"]}>
        <input
          className={styles["search-bar"]}
          type="search"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Найти товар"
        />
        <div className={styles["selectors-block"]}>
          <select
            onChange={(event) => setWithPhotoChosen(event.target.value)}
            id="photo"
          >
            <option value="None">Выберите фото</option>
            <option value="with">С фото</option>
            <option value="without">Без фото</option>
          </select>
          <select
            onChange={(event) => setGradeChosen(event.target.value)}
            id="grade"
          >
            <option key="grade" value="None">
              Выберите класс
            </option>
            {gradesList.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
          <select
            onChange={(event) => setPublisherChosen(event.target.value)}
            id="publisher"
          >
            <option key="publisher" value="None">
              Выберите издательство
            </option>
            {publishersList.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
          <select
            onChange={(event) => setSubjectChosen(event.target.value)}
            id="subject"
          >
            <option key="subject" value="None">
              Выберите предмет
            </option>
            {subjectsList.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles["products-block"]}>
        {filteredProducts.slice(0, amountOfShownCards).map((product) => {
          return (
            <ProductAdminHorizontalCard
              {...product}
              url={props.url}
              key={product["_id"]}
              id={product["_id"]}
            />
          );
        })}
      </div>
      <Button
        className={styles["show-more-button"]}
        onClick={() => setAmountOfShownCards((prev) => prev + 48)}
      >
        Показать ещё
      </Button>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  } else if (!session.user.isAdmin) {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session: session.user.id,
        url: process.env.RESOURCE_URL,
      },
    };
  }
}
