import Head from "next/head";
import styles from "../../styles/auth/verify-request.module.css";

export default function VerifyRequestPage(props) {
  return (
    <>
      <Head>
        <title>Азбука96 - Проверьте почту</title>
      </Head>

      <div className={styles["verify-request-page"]}>
        <h1 className={styles["header"]}>Проверьте вашу почту</h1>
        <p className={styles["text"]}>
          {" "}
          Ссылка для входа придет будет в письме
        </p>
      </div>
    </>
  );
}
