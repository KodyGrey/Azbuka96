import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/catalogue.module.css";

import Fieldset from "../components/Fieldset/Fieldset";
import ProductCard from "../components/Products/ProductCard";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import arrowImage from "../public/arrow-left-icon.svg";

export default function Catalogue(props) {
  const searchQuery = props.searchQuery;

  const [amountOfShownCards, setAmountOfShownCards] = useState(48);

  const [isFieldsetModalHidden, setIsFieldsetModalHidden] = useState(true);
  let productsList = props.productsList.filter((el) => el.inStock);
  productsList.sort((a, b) => b.boughtScore - a.boughtScore);

  const [gradeChosenList, setGradeChosenList] = useState([]);
  const handleGradeChoiceSelection = (choice) => {
    setGradeChosenList((prevSelectedChoices) =>
      prevSelectedChoices.includes(choice)
        ? prevSelectedChoices.filter((c) => c !== choice)
        : [...prevSelectedChoices, choice]
    );
  };
  const gradeArgsFieldset = {
    key: "grade",
    legend: "Класс",
    type: "checkbox",
    height: "fit-content",
    categories: [
      ...new Set(
        productsList.map((el) => el.categories.grade && el.categories.grade)
      ),
    ].filter((el) => el),
  };
  gradeArgsFieldset.categories.sort();

  const [subjectChosenList, setSubjectChosenList] = useState([]);
  const handleSubjectChoiceSelection = (choice) => {
    setSubjectChosenList((prevSelectedChoices) =>
      prevSelectedChoices.includes(choice)
        ? prevSelectedChoices.filter((c) => c !== choice)
        : [...prevSelectedChoices, choice]
    );
  };
  const subjectArgsFieldset = {
    key: "subject",
    legend: "Предмет",
    type: "checkbox",
    height: "fit-content",
    categories: [
      ...new Set(productsList.map((el) => el.categories.subject)),
    ].filter((el) => el),
  };
  subjectArgsFieldset.categories.sort();

  const [publisherChosenList, setPublisherChosenList] = useState([]);
  const handlePublisherChoiceSelection = (choice) => {
    setPublisherChosenList((prevSelectedChoices) =>
      prevSelectedChoices.includes(choice)
        ? prevSelectedChoices.filter((c) => c !== choice)
        : [...prevSelectedChoices, choice]
    );
  };
  const publisherArgsFieldset = {
    key: "publisher",
    legend: "Издательство",
    type: "checkbox",
    height: "fit-content",
    categories: [
      ...new Set(productsList.map((el) => el.categories.publisher)),
    ].filter((el) => el),
  };
  publisherArgsFieldset.categories.sort();

  function onChangeFieldsetModalHidden(event) {
    event.preventDefault();
    setIsFieldsetModalHidden(!isFieldsetModalHidden);
  }

  productsList = productsList.filter((el) => {
    if (
      gradeChosenList.length !== 0 &&
      !gradeChosenList.includes(el.categories.grade)
    )
      return false;
    if (
      subjectChosenList.length !== 0 &&
      !subjectChosenList.includes(el.categories.subject)
    )
      return false;
    if (
      publisherChosenList.length !== 0 &&
      !publisherChosenList.includes(el.categories.publisher)
    )
      return false;
    else return true;
  });

  function getCountOfMatchingWords(element, searchQuery) {
    const searchRegex = new RegExp(`${searchQuery}`, "gi");
    let count = 0;
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

  let searchRes = undefined;
  if (searchQuery) {
    productsList.sort((a, b) => {
      const countA = getCountOfMatchingWords(a, searchQuery.toLowerCase());
      const countB = getCountOfMatchingWords(b, searchQuery.toLowerCase());
      return countB - countA;
    });

    const tempProductsList = productsList.filter((product) => {
      return (
        String(product.bookID) === searchQuery ||
        (product.author &&
          product.author.toLowerCase() === searchQuery.toLowerCase())
      );
    });
    if (tempProductsList.length > 0) {
      productsList = tempProductsList;
    }
    console.log(productsList);
  }

  return (
    <>
      <Head>
        <title>Азбука96 - Каталог учебников, рабочих тетрадей</title>
      </Head>
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
          <div onClick={onChangeFieldsetModalHidden}>
            <Image src={arrowImage} alt="Назад" layout="fill" />
          </div>
          <Fieldset
            {...gradeArgsFieldset}
            onChoiceSelect={handleGradeChoiceSelection}
          />
          <Fieldset
            {...subjectArgsFieldset}
            onChoiceSelect={handleSubjectChoiceSelection}
          />
          <Fieldset
            {...publisherArgsFieldset}
            onChoiceSelect={handlePublisherChoiceSelection}
          />
        </Card>
        <div className={styles["products-placement"]}>
          <div className={styles["products-grid"]}>
            <div className={styles["headers"]}>
              <h2>{searchQuery ? "Результаты поиска" : "Каталог"}</h2>
              <p onClick={onChangeFieldsetModalHidden}>Фильтры</p>
            </div>
            <div>
              {productsList.slice(0, amountOfShownCards).map((el) => {
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
          </div>
          <Button
            onClick={(event) => {
              setAmountOfShownCards(
                Math.min(amountOfShownCards + 24, productsList.length)
              );
            }}
            className={styles["show-more-button"]}
          >
            Показать ещё
          </Button>
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
