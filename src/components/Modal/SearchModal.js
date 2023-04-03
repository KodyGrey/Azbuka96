import React, { useState } from "react";

import Image from "next/image";

import styles from "./SearchModal.module.css";
import { SearchBar } from "../Header/CatalogueSearchBar";
import arrowBackImage from "../../public/arrow-left-icon.svg";

const SearchModal = (props) => {
  const closeHandler = () => {
    props.onClose();
  };
  return (
    <div className={styles["modal-wrapper"]}>
      <div className={styles["modal-background"]} onClick={closeHandler}></div>
      <div className={styles["modal-element"]}>
        <a className={styles["close-button"]} onClick={closeHandler}>
          <Image src={arrowBackImage} alt="Назад" layout="fill" />
        </a>
        <SearchBar className={styles["search-bar"]} onClose={props.onClose} />
      </div>
    </div>
  );
};

export default SearchModal;
