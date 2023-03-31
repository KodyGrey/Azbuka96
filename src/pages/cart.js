import ProductHorizontalCard from "../components/Products/ProductHorizontalCard";
import Button from "../components/UI/Button";
import TextInput from "../components/UI/TextInput";
import Fieldset from "../components/Fieldset/Fieldset";

import styles from "../styles/cart.module.css";

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CartPage(props) {
  const productsList = props.productsList;
  const cart = useSelector((state) => state.cart);
  const [makeOrderClicks, setMakeOrderClicks] = useState(0);

  const router = useRouter();

  let total = 0;

  function onMakeOrderButtonClicked(event) {
    if (!props.isLoggedIn) {
      router.push("/api/auth/signin");
    } else if (makeOrderClicks === 0) {
      setMakeOrderClicks(1);
    }
    event.preventDefault();
  }

  return (
    <div className={styles["cart-page"]}>
      <h2>Корзина</h2>
      <div className={styles["products-list"]}>
        {productsList.map((el) => {
          if (cart[el["_id"]]) {
            total += cart[el["_id"]] * (el.discountedPrice ?? el.price);
            return (
              <ProductHorizontalCard
                {...el}
                url={props.url}
                key={el["_id"]}
                id={el["_id"]}
              />
            );
          }
          return;
        })}
      </div>
      <div className={styles["total-price-block"]}>
        <div>Итого:</div>
        <div className={styles["total-price"]}>{total} ₽</div>
      </div>
      <p className={styles["text-info"]}>
        Информация о подтверждении заказа, изменениях по вашему заказу,
        предоставленной скидке, накладная, а также информация о способах оплаты
        придет на электронную почту, указанную в вашем профиле
      </p>
      {makeOrderClicks > 0 && (
        <form className={styles["delivery-form"]}>
          <Fieldset
            key="delivery"
            legend="Тип доставки"
            type="radio"
            height="fit-content"
            categories={[
              "Забрать из пункта выдачи",
              "Доставка по Екатеринбургу",
              "Доставка по России",
            ]}
          />
          <TextInput placeholder="Адрес доставки" />
          <TextInput placeholder="Комментарий к заказу" />
        </form>
      )}
      <Button
        className={styles["make-order-button"]}
        onClick={onMakeOrderButtonClicked}
      >
        Оформить заказ
      </Button>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      props: {
        isLoggedIn: false,
        url: process.env.RESOURCE_URL,
      },
    };
  } else if (!session.user.name || !session.user.city) {
    return {
      redirect: {
        destination: "/profile/update",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isLoggedIn: true,
      "user-id": session.user.id,
      "user-name": session.user.name,
      "user-city": session.user.city,
      email: session.user.email,
      url: process.env.RESOURCE_URL,
    },
  };
}
