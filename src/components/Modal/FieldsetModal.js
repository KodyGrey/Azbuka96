import Image from "next/dist/client/image";

import styles from "./FieldsetModal.module.css";
import Fieldset from "../Fieldset/Fieldset";
import arrowImage from "../../public/arrow-left-icon.svg";

const FieldsetModal = (props) => {
  return (
    <section className={styles["modal"]}>
      <a>
        <Image src={arrowImage} alt="Назад" layout="fill" />
      </a>
      <div>
        {props.fields.map((args) => (
          <Fieldset key={args.key} {...args} />
        ))}
      </div>
    </section>
  );
};

export default FieldsetModal;
