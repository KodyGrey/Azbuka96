import React from "react";
import FieldsetModal from "../components/Modal/FieldsetModal";

export default {
  title: "Fieldset Modal",
  component: FieldsetModal,
};

const Template = (args) => <FieldsetModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  key: "grade",
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
