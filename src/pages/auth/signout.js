import { signOut } from "next-auth/react";
import Head from "next/head";

import Button from "../../components/UI/Button";

export default function SignOutPage() {
  return (
    <>
      <Head>
        <title>Азбука96 - Выйти из аккаунта</title>
      </Head>
      <Button
        style={{
          height: "48px",
          width: "200px",
          "align-self": "center",
          margin: "20% 0 0 0",
        }}
        onClick={() => {
          signOut({ redirect: { destination: "/" } });
        }}
      >
        Выйти из аккаунта
      </Button>
    </>
  );
}
