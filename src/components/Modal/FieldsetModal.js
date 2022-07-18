import Image from "next/dist/client/image";

import styles from "./FieldsetModal.module.css";
import Fieldset from "../Fieldset/Fieldset";
import arrowImage from "../../public/arrow-left-icon.svg";

const FieldsetModal = () => {
  const args = {
    legend: "Класс",
    type: "checkbox",
    height: "fit-content",
    categories: [
      "1 класс",
      "2 класс",
      "3 класс",
      "4 класс",
      "5 класс",
      "6 класс",
      "7 класс",
      "8 класс",
      "9 класс",
      "10 класс",
      "11 класс",
      "Ясельная группа",
      "Младшая группа",
      "Средняя группа",
      "Старшая группа",
      "Подготовительная группа",
    ],
  };
  return (
    <section className={styles["modal"]}>
      <a>
        <Image src={arrowImage} alt="Назад" layout="fill" />
      </a>
      <div>
        <Fieldset {...args} />
        <Fieldset {...args} />
      </div>
    </section>
  );
};

export default FieldsetModal;
