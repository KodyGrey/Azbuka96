import styles from "../../styles/about/text-page.module.css";
import Head from "next/head";

export default function PaymentInfoPage(props) {
  return (
    <>
      <Head>
        <title>Азбука96 - Информация об оплате</title>
      </Head>
      <div className={styles["text-page"]}>
        <h1>Способы оплаты</h1>
        <div className={styles["text-block"]}>
          <p>
            <strong>Вид оплаты физические лица (частные):</strong> наличный,
            безналичный или перевод.
          </p>
          <p>
            <strong>
              Вид оплаты юридические лица и индивидуальные предприниматели:
            </strong>
            {
              " безналичный перевод от ЮЛ или ИП с которым заключен договор и на"
            }
            которого выставлен счет.
          </p>
          <p>
            <strong>Сборка и отгрузка товара:</strong> по 100% предоплате.
          </p>
          <p>
            <strong>Счет на оплату:</strong> действует в течении 3-х рабочих
            дней, с резервированием товара и сохранением цены на время действия
            счета.
          </p>
          <p>
            <strong>НДС</strong> не облагается на основании п.2 ст.346.11 НК РФ.
          </p>
        </div>
      </div>
    </>
  );
}
