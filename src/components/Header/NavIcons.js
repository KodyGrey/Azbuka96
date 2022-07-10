import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import cartImage from "../../public/cart.svg";
import profileImage from "../../public/profile.svg";
import styles from "./NavIcons.module.css";

const CartButton = () => {
  const productsInCart = useSelector((state) => state.cart.amount);

  return (
    <Link href="/cart">
      <a className={styles["cart-button"]}>
        <Image src={cartImage} alt="Корзина" height={32} width={32} />
        <div>
          <p>{productsInCart}</p>
        </div>
      </a>
    </Link>
  );
};

const ProfileButton = () => {
  return (
    <Link href="/profile">
      <a>
        <Image src={profileImage} alt="Профиль" height={32} width={32} />
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
