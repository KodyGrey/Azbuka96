import Card from "../UI/Card";
import Logo from "./Logo";

import styles from "./Header.module.css";
import CatalogueSearchBar from "./CatalogueSearchBar";
import NavIcons from "./NavIcons";

const Header = (props) => {
  return (
    <nav>
      <Card className={styles.header}>
        <Logo />
        <CatalogueSearchBar />
        <NavIcons />
      </Card>
    </nav>
  );
};

export default Header;
