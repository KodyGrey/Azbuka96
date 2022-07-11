import Card from "../UI/Card";
import Logo from "./Logo";

import styles from "./Header.module.css";
import CatalogueSearchBar from "./CatalogueSearchBar";
import NavIcons from "./NavIcons";

const Header = (props) => {
  return (
    <header>
      <Card className={styles.header}>
        <Logo />
        <CatalogueSearchBar />
        <NavIcons />
      </Card>
    </header>
  );
};

export default Header;
