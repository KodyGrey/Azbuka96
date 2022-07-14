import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import cartImage from "../../public/cart.svg";
import profileImage from "../../public/profile.svg";
import styles from "./NavIcons.module.css";

export const CartButton = (props) => {
  // const productsInCart = useSelector((state) => state.cart.amount);
  const productsInCart = 0;

  return (
    <Link href="/cart">
      <a className={styles["cart-button"]}>
        <div className={styles["cart-image"]}>
          <Image src={cartImage} alt="Корзина" height={32} width={32} />
          <div className={styles["products-counter"]}>
            <span>{productsInCart}</span>
          </div>
        </div>
        {props.children}
      </a>
    </Link>
  );
};

export const ProfileButton = (props) => {
  return (
    <Link href="/profile">
      <a>
        <Image src={profileImage} alt="Профиль" height={32} width={32} />
        {props.children}
      </a>
    </Link>
  );
};

const NavIcons = () => {
  return (
    <div className={styles["nav-icons"]}>
      <ProfileButton />
      <CartButton />
    </div>
  );
};

export default NavIcons;
