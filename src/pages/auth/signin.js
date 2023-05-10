import { getCsrfToken } from "next-auth/react";

import styles from "../../styles/auth/signin.module.css";
import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";

export default function SignIn(props) {
  return (
    <div className={styles["sign-in-page"]}>
      <h1>Вход</h1>
      <form
        method="post"
        action="/api/auth/signin/email"
        className={styles["sign-in-form"]}
      >
        <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
        <label className={styles["email-label"]}>
          Адрес электронной почты:
          <TextInput
            type="email"
            id="email"
            name="email"
            placeholder="address@example.com"
            className={styles["email-input"]}
          />
        </label>
        <Button type="submit" className={styles["sign-in-button"]}>
          Войти
        </Button>
      </form>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const csrfToken = await getCsrfToken(ctx);
  return {
    props: { csrfToken },
  };
}
