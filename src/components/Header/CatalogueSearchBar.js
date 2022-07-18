import React, { useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/dist/client/link";

import styles from "./CatalogueSearchBar.module.css";
import Button from "../UI/Button";

const CatalogueButton = () => {
  return (
    <Link href="/catalogue">
      <a>
        <Button type="button" className={styles["catalogue-button"]}>
          {"🕮  Каталог"}
        </Button>
      </a>
    </Link>
  );
};

// Search <input> and search <button>

export const SearchBar = (props) => {
  const searchInputRef = useRef();
  const router = useRouter();

  const onSearchButtonClickHandler = () => {
    router.push(`/search/${searchInputRef.current.value}`);
  };

  return (
    <div className={`${props.className} ${styles["search-bar"]}`}>
      <input
        className={styles["search-input"]}
        type="text"
        placeholder="Введите запрос"
        ref={searchInputRef}
      />
      <Button
        onClick={onSearchButtonClickHandler}
        className={styles["search-button"]}
      >
        Поиск
      </Button>
    </div>
  );
};

// Combining both parts

const CatalogueSearchBar = () => {
  return (
    <div className={styles["combined-bar"]}>
      <CatalogueButton />
      <SearchBar />
    </div>
  );
};

export default CatalogueSearchBar;
