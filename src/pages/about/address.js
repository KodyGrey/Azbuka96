import styles from "../../styles/about/text-page.module.css";

export default function AddressPage(props) {
  return (
    <div className={styles["text-page"]}>
      <h1>Адрес пунктов выдачи</h1>
      <div>
        <h2>Пункт выдачи (самовывоз)</h2>
        <p>620087, город Екатеринбург, улица Самолетная, дом 55, офис 7а.</p>
      </div>
    </div>
  );
}
