import styles from "../../styles/about/text-page.module.css";
import scheduleStyles from "../../styles/about/work-schedule.module.css";
import Head from "next/head";

export default function WorkSchedule(props) {
  return (
    <>
      <Head>
        <title>Азбука96 - График работы</title>
      </Head>

      <div className={styles["text-page"]}>
        <h1>График работы</h1>
        <div className={scheduleStyles["table-block"]}>
          <h2>Режим работы пункта выдачи</h2>
          <table>
            <tr>
              <td>
                <strong>понедельник</strong>
              </td>
              <td rowSpan={5}>10.00 - 18.00</td>
            </tr>
            <tr>
              <td>
                <strong>вторник</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>среда</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>четверг</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>пятница</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>суббота</strong>
              </td>
              <td rowSpan={2}>выходной</td>
            </tr>
            <tr>
              <td>
                <strong>воскресенье</strong>
              </td>
            </tr>
          </table>
        </div>
        <div className={scheduleStyles["managers-time-block"]}>
          <h2>График работы менеджеров</h2>
          <div className={scheduleStyles["region-time-block"]}>
            <h3>По времени города Екатеринбург</h3>
            <p>
              <strong>С понедельника по пятницу</strong> 10.00-18.00
            </p>
          </div>
          <div className={scheduleStyles["region-time-block"]}>
            <h3>По времени города Москва, Санкт-Петербург</h3>
            <p>
              <strong>С понедельника по пятницу</strong> 08.00-16.00
            </p>
          </div>
          <div className={scheduleStyles["region-time-block"]}>
            <h3>По времени города Ижевск</h3>
            <p>
              <strong>С понедельника по пятницу</strong> 09.00-17.00
            </p>
          </div>
          <div className={scheduleStyles["region-time-block"]}>
            <h3>По времени города Новосибирск</h3>
            <p>
              <strong>С понедельника по пятницу</strong> 12.00-20.00
            </p>
          </div>
          <div className={scheduleStyles["region-time-block"]}>
            <h3>По времени города Владивосток, Хабаровск</h3>
            <p>
              <strong>С понедельника по пятницу</strong> 15.00-23.00
            </p>
          </div>
          <div className={scheduleStyles["region-time-block"]}>
            <h3>По времени города Петропавловск-Камчатский</h3>
            <p>
              <strong>С понедельника по пятницу</strong> 17.00-01.00
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
