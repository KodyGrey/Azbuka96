import { useState, useEffect, useRef } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import ProductAdminHorizontalCard from "../../components/Products/ProductAdminHorizontalCard";
import styles from "../../styles/admin/products.module.css";
import Button from "../../components/UI/Button";

export default function ProductsAdmin(props) {
  let productsList = props.productsList;

  const [searchQuery, setSearchQuery] = useState("");

  const [amountOfShownCards, setAmountOfShownCards] = useState(48);

  const [gradesList, setGradesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [publishersList, setPublishersList] = useState([]);

  const [gradeChosen, setGradeChosen] = useState("None");
  const [publisherChosen, setPublisherChosen] = useState("None");
  const [subjectChosen, setSubjectChosen] = useState("None");

  if (gradeChosen !== "None") {
    productsList = productsList.filter(
      (el) => el.categories.grade === gradeChosen
    );
  }
  if (publisherChosen !== "None") {
    productsList = productsList.filter(
      (el) => el.categories.publisher === publisherChosen
    );
  }
  if (subjectChosen !== "None") {
    productsList = productsList.filter(
      (el) => el.categories.subject === subjectChosen
    );
  }

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
  });

  function getCountOfMatchingWords(element, searchQuery) {
    const searchRegex = new RegExp(`${searchQuery}`, "gi");
    let count = 0;
    const properties = [
      element.title,
      element.author,
      element.description,
      String(element.bookID),
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

  if (searchQuery) {
    productsList.sort((a, b) => {
      const countA = getCountOfMatchingWords(a, searchQuery.toLowerCase());
      const countB = getCountOfMatchingWords(b, searchQuery.toLowerCase());
      return countB - countA;
    });
  }

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
        {productsList.slice(0, amountOfShownCards).map((product) => {
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
