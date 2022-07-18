import React, { useState } from "react";

import Image from "next/image";

import styles from "./SearchModal.module.css";
import { SearchBar } from "../Header/CatalogueSearchBar";
import arrowBackImage from "../../public/arrow-left-icon.svg";

const SearchModal = () => {
  return (
    <section>
      <div className={styles["modal-background"]}></div>
      <div className={styles["modal-element"]}>
        <a>
          <Image src={arrowBackImage} alt="Назад" layout="fill" />
        </a>
        <SearchBar className={styles["search-bar"]} />
      </div>
    </section>
  );
};

export default SearchModal;
