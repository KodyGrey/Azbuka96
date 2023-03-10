import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";

import styles from "../../styles/profile/update.module.css";

import { useState } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";

function Update(props) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  function onUpdateFormSubmit(event) {
    fetch(`http://localhost:3000/api/users/${props.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        city,
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

  return (
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
        <Button type="submit" className={styles["submit-button"]}>
          Отправить
        </Button>
      </form>
    </div>
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
