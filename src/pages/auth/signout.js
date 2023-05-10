import { signOut } from "next-auth/react";

import Button from "../../components/UI/Button";

export default function SignOutPage() {
  return (
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
  );
}
