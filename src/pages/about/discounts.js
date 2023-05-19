import styles from "../../styles/about/text-page.module.css";
import discountsStyles from "../../styles/about/discounts.module.css";

export default function DiscountsInfoPage(props) {
  return (
    <div className={styles["text-page"]}>
      <h1>Способы оплаты</h1>
      <div className={styles["text-block"]}>
        <p>
          <strong>Минимальная сумма для оформления заказа 2000руб.</strong>
        </p>
        <table className={discountsStyles["table"]}>
          <tr>
            <th>Сумма</th>
            <th>Скидка</th>
          </tr>
          <tr>
            <td>5 000 – 20 000 руб.</td>
            <td>2%</td>
          </tr>
          <tr>
            <td>20 000 – 50 000 руб.</td>
            <td>4%</td>
          </tr>
          <tr>
            <td>50 000 – 100 000 руб.</td>
            <td>6%</td>
          </tr>
          <tr>
            <td>более 100 000 руб.</td>
            <td>8%</td>
          </tr>
        </table>
        <p>
          <strong>Скидки разовые</strong> и распространяются на один заказ.
        </p>
      </div>
    </div>
  );
}
