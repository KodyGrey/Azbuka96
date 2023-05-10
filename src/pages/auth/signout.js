import { useEffect } from "react";
import { signOut } from "next-auth/client";

export default function SignOutPage() {
  useEffect(() => {
    signOut();
  }, []);

  return <p>Вы вышли из аккаунта</p>;
}
