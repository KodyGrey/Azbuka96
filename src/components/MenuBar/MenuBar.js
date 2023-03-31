import Image from "next/image";
import Link from "next/link";

import styles from "./MenuBar.module.css";

import { CartButton, ProfileButton } from "../Header/NavIcons";
import Card from "../UI/Card";

import searchButtonIcon from "../../public/search.svg";
import catalogueButtonIcon from "../../public/catalogue.svg";
import mainPageButtonIcon from "../../public/main.svg";

// Navigation buttons for mobile version

const SearchButton = (props) => {
  const linkClickHandler = (event) => {
    event.preventDefault();
  };
  return (
    <a onClick={linkClickHandler}>
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
  return (
    <Card className={styles["menu-bar"]}>
      <MainPageButton>
        <p>Главная</p>
      </MainPageButton>
      <CatalogueButton>
        <p>Каталог</p>
      </CatalogueButton>
      <SearchButton>
        <p>Поиск</p>
      </SearchButton>
      <ProfileButton>
        <p>Профиль</p>
      </ProfileButton>
      <CartButton>
        <p>Корзина</p>
      </CartButton>
    </Card>
  );
};

export default MenuBar;
