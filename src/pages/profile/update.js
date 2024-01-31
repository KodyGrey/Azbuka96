import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";

import styles from "../../styles/profile/update.module.css";

import { useState } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import Head from "next/head";

function Update(props) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  function onUpdateFormSubmit(event) {
    fetch(`/api/users/${props.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        city,
        phoneNumber,
      }),
      credentials: "same-origin",
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });

    event.preventDefault();
    router.push("/profile");
  }

  function onNameChanged(event) {
    setName(event.target.value);
  }

  function onCityChanged(event) {
    setCity(event.target.value);
  }

  function onPhoneNumberChanged(event) {
    let phone = event.target.value;
    if (phone.length < phoneNumber.length) {
      if (phoneNumber[phoneNumber.length - 1].match(/[^\d]/))
        phone = phone.slice(0, phone.length - 1);
      if (phoneNumber.match(/^\+7\($/)) phone = "";
      setPhoneNumber(phone);
      return;
    }

    phone = phone.replace(/^8(\d)/, "+7($1");
    phone = phone.replace(/^\+7(\d)/, "+7($1");
    phone = phone.replace(/^\+7\((\d{3})$/, "+7($1)");
    phone = phone.replace(/^\+7\((\d{3})\)(\d{3})$/, "+7($1)$2-");
    phone = phone.replace(/^\+7\((\d{3})\)(\d{3})-(\d{2})$/, "+7($1)$2-$3-");

    setPhoneNumber(phone.slice(0, 16));
  }

  return (
    <>
      <Head>
        <title>Азбука96 - Обновление данных профиля</title>
      </Head>
      <div className={styles["update-block"]}>
        <h2>Введите пользовательские данные</h2>
        <form className={styles["update-form"]} onSubmit={onUpdateFormSubmit}>
          <TextInput
            id="name"
            className={styles["text-input"]}
            placeholder="ФИО"
            value={name}
            onChange={onNameChanged}
            required
          />
          <TextInput
            id="city"
            className={styles["text-input"]}
            placeholder="Город"
            value={city}
            onChange={onCityChanged}
            required
          />
          <TextInput
            id="phoneNumber"
            type="tel"
            pattern="+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}"
            className={styles["text-input"]}
            placeholder="+7(912)345-67-89"
            value={phoneNumber}
            onChange={onPhoneNumberChanged}
            required
          />

          <Button type="submit" className={styles["submit-button"]}>
            Отправить
          </Button>
        </form>
      </div>
    </>
  );
}

export default Update;

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { id: session.user.id },
  };
}
