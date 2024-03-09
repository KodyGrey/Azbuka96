import { useEffect, useState } from "react";
import Head from "next/head";

import { useRouter } from "next/router";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import styles from "../../styles/product/[id].module.css";

import Button from "../../components/UI/Button";
import QuantityChanging from "../../components/UI/QuantityChanging";

import { cartActions } from "../../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ProductPage(props) {
  const router = useRouter();
  const id = router.query.id;

  const [productInfo, setProductInfo] = useState();

  const productInCart = useSelector((state) => state.cart[id]);
  const dispatch = useDispatch();

  const [quantityInCart, setQuantityInCart] = useState(productInCart || 0);

  useEffect(() => {
    async function getProductInfo() {
      const data = await (await fetch(`/api/products/${id}`)).json();
      if (!data || data.error) router.push("/404");
      setProductInfo(data);
    }

    getProductInfo();
  }, [id, router]);

  function onAddInCartButtonPressed() {
    dispatch(cartActions.addProduct({ id, quantity: 1 }));
    setQuantityInCart(1);
  }

  function onDecreaseQuantityButtonPressed() {
    if (productInCart > 1) {
      dispatch(cartActions.changeItem({ id, quantity: productInCart - 1 }));
      setQuantityInCart(productInCart - 1);
    } else {
      dispatch(cartActions.removeProduct(id));
    }
  }

  function onIncreaseQuantityButtonPressed() {
    dispatch(cartActions.changeItem({ id, quantity: productInCart + 1 }));
    setQuantityInCart(productInCart + 1);
  }

  return (
    <>
      <Head>
        <title>
          Азбука96 - {props.productsList.find((el) => (el._id = id)).title}{" "}
          {props.productsList.find((el) => (el._id = id)).author}
        </title>
      </Head>
      <div className={styles["product-page"]}>
        {productInfo ? (
          <>
            <section className={styles["image-section"]}>
              {/* Image */}
              <div className={styles["product-image"]}>
                {productInfo["image"] ? (
                  <Image
                    src={`${props.url}/${productInfo["image"]}`}
                    alt={productInfo["title"]}
                    objectFit="scale-down"
                    layout="fill"
                  />
                ) : (
                  <></>
                )}

                {productInfo["discountedPrice"] && (
                  <div>
                    {`${
                      Math.round(
                        (productInfo["discountedPrice"] /
                          productInfo["price"]) *
                          100
                      ) - 100
                    }%`}
                  </div>
                )}
              </div>

              {/* Cart action buttons */}

              {productInfo["inStock"] ? (
                <div className={styles["interactive-buttons"]}>
                  {productInCart ? (
                    <QuantityChanging
                      className={styles["quantity-changing-in-cart"]}
                      amount={quantityInCart}
                      decrease={{ onClick: onDecreaseQuantityButtonPressed }}
                      increase={{ onClick: onIncreaseQuantityButtonPressed }}
                    />
                  ) : (
                    <Button
                      className={styles["add-in-cart-button"]}
                      onClick={onAddInCartButtonPressed}
                    >
                      В корзину
                    </Button>
                  )}
                </div>
              ) : (
                <></>
              )}
            </section>
            <section className={styles["description-section"]}>
              <div>
                <h2 className={styles["title"]}>{productInfo["title"]}</h2>
                <div className={styles["author"]}>{productInfo["author"]}</div>
                <div className={styles["bookID"]}>#{productInfo["bookID"]}</div>
              </div>

              <div>
                <div className={styles["prices-block"]}>
                  <div className={styles["price"]}>
                    {`${
                      productInfo["discountedPrice"] ?? productInfo["price"]
                    } ₽`}
                  </div>
                  {productInfo["discountedPrice"] && (
                    <div
                      className={styles["price-without-discount"]}
                    >{`${productInfo["price"]} ₽`}</div>
                  )}
                </div>
                <div
                  className={styles["is-in-stock"]}
                  style={{
                    color: productInfo["inStock"] ? "#4C9F70" : "#d64550",
                  }}
                >
                  {productInfo["inStock"] ? "в наличии" : "не в наличии"}
                </div>
              </div>

              <div className={styles["description"]}>
                <h3>Описание</h3>
                <p>{productInfo["description"]}</p>
              </div>
            </section>
          </>
        ) : (
          <></>
        )}
      </div>
      {props.isAdmin && (
        <Button
          className={styles["edit-button"]}
          onClick={(event) => {
            event.preventDefault();
            router.push(`/product/edit/${id}`);
          }}
        >
          Редактировать
        </Button>
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  // console.log(session.user.isAdmin);

  return {
    props: {
      url: process.env.RESOURCE_URL,
      isAdmin: session && session.user.isAdmin,
    },
  };
}
