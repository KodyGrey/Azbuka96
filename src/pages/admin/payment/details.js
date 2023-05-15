import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { useEffect, useState } from "react";

import TextInput from "../../../components/UI/TextInput";
import Button from "../../../components/UI/Button";

import styles from "../../../styles/admin/payment/details.module.css";

function PaymentDetailsComponent(props) {
  const [type, setType] = useState(props.type);
  const [reciever, setReciever] = useState(props.reciever);
  const [number, setNumber] = useState(props.number);
  const [comment, setComment] = useState(props.comment);

  const sendData = () => {
    fetch("/api/payment/details", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        isIndividual: props.isIndividual,
        type,
        reciever,
        number,
        comment,
      }),
    });
  };

  return (
    <form className={styles["payment-details-form"]}>
      <label>
        Вид
        <TextInput
          value={type}
          onChange={(event) => setType(event.target.value)}
        />
      </label>
      <label>
        Получатель
        <TextInput
          value={reciever}
          onChange={(event) => setReciever(event.target.value)}
        />
      </label>
      <label>
        Номер (карты или счета)
        <TextInput
          value={number}
          onChange={(event) => setNumber(event.target.value)}
        />
      </label>
      <label>
        Комментарий
        <TextInput
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </label>
      <Button onClick={sendData}>
        {props.isIndividual
          ? "Изменить реквизиты для ФЛ"
          : "Изменить реквизиты для ЮР"}
      </Button>
    </form>
  );
}

export default function PaymentDetailsPage(props) {
  const [data, setData] = useState(props.data);

  return (
    <div className={styles["details-page"]}>
      <h1>Платежные реквизиты</h1>
      <div className={styles["payment-details-component"]}>
        <h2>Для ФЛ</h2>
        <PaymentDetailsComponent
          isIndividual={true}
          {...data.individualPaymentDetails}
        />
      </div>
      <div className={styles["payment-details-component"]}>
        <h2>Для ЮР</h2>
        <PaymentDetailsComponent
          isIndividual={false}
          {...data.legalEntityPaymentDetails}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const data = await // ВАЖНО ПОМЕНЯТЬ
  (
    await fetch("http://localhost:3000/api/payment/details", {
      method: "GET",
      credentials: "include",
    })
  ).json();

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  } else if (!session.user.isAdmin) {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session: session.user.id,
        data,
      },
    };
  }
}
