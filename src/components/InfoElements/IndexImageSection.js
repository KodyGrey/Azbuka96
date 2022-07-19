import Image from "next/dist/client/image";

import styles from "./IndexImageSection.module.css";
import indexImage from "../../public/index-page-image.svg";
import indexTextPc from "../../public/index-page-text-pc.svg";
import indexTextMobile from "../../public/index-page-text-mobile.svg";

const IndexImageSection = (props) => {
  const text = `Учебники
  Рабочие тетради
  Методическая литература`;

  return (
    <section className={`${props.className} ${styles["section"]}`}>
      <span className={styles["image"]}>
        <Image src={indexImage} alt="" layout="fill" />
      </span>
      <span className={styles["text-pc"]}>
        <Image src={indexTextPc} alt={text} layout="fill" />
      </span>
      <span className={styles["text-mobile"]}>
        <Image src={indexTextMobile} alt={text} layout="fill" />
      </span>
    </section>
  );
};

export default IndexImageSection;
