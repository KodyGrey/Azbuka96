import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./MenuBar.module.css";

import { CartButton, ProfileButton } from "../Header/NavIcons";
import Card from "../UI/Card";
import SearchModal from "../Modal/SearchModal";

import searchButtonIcon from "../../public/search.svg";
import catalogueButtonIcon from "../../public/catalogue.svg";
import mainPageButtonIcon from "../../public/main.svg";

// Navigation buttons for mobile version

const SearchButton = (props) => {
  return (
    <a {...props}>
      <Image src={searchButtonIcon} width={32} height={32} alt="Поиск" />
      {props.children}
    </a>
  );
};

const CatalogueButton = (props) => {
  return (
    <Link href="/catalogue" legacyBehavior>
      <a>
        <Image src={catalogueButtonIcon} width={32} height={32} alt="Каталог" />
        {props.children}
      </a>
    </Link>
  );
};

const MainPageButton = (props) => {
  return (
    <Link href="/" legacyBehavior>
      <a>
        <Image src={mainPageButtonIcon} width={32} height={32} alt="Главная" />
        {props.children}
      </a>
    </Link>
  );
};

const MenuBar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const searchButtonClickHandler = () => {
    setModalOpen(true);
  };

  return (
    <>
      <Card className={styles["menu-bar"]}>
        <MainPageButton>
          <p>Главная</p>
        </MainPageButton>
        <CatalogueButton>
          <p>Каталог</p>
        </CatalogueButton>
        <SearchButton onClick={searchButtonClickHandler}>
          <p>Поиск</p>
        </SearchButton>
        <ProfileButton>
          <p>Профиль</p>
        </ProfileButton>
        <CartButton>
          <p>Корзина</p>
        </CartButton>
      </Card>
      {modalOpen && <SearchModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default MenuBar;
