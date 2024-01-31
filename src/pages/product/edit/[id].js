import { useRouter } from "next/router";
import NewProduct from "../new";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Head from "next/head";

export default function EditProduct(props) {
  //   const router = useRouter();
  //   const id = router.query.id;
  //   const product = props.productsList.find((el) => el.id === id);
  //   if (!product) router.push("/404");
  return (
    <>
      <Head>
        <title>Азбука96 - Редактировать {props.product.title}</title>
      </Head>
      <NewProduct {...props} {...props.product} />;
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const { query } = ctx;
  const data = await fetch(
    `https://next.na4u.ru/api/products/${query.id}`
  ).then((res) => res.json());
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  } else if (!session.user.isAdmin) {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  }
  if (!data || data.error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session: session.user.id,
        product: data,
      },
    };
  }
}
