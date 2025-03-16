import styles from "../../styles/about/text-page.module.css";
import Head from "next/head";

export default function AddressPage(props) {
  return (
    <>
      <Head>
        <title>Азбука96 - Адреса пунктов выдачи</title>
      </Head>
      <div className={styles["text-page"]}>
        <h1>Адреса пунктов выдачи</h1>
        <div>
          <h2>Пункт выдачи (самовывоз)</h2>
          <p>620087, город Екатеринбург, улица Самолетная, дом 55.</p>
        </div>
      </div>
    </>
  );
}
