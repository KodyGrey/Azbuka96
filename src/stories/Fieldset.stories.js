import React from "react";

import Fieldset from "../components/Fieldset/Fieldset";

export default {
  title: "Fieldset",
  component: Fieldset,
};

const Template = (args) => <Fieldset {...args} />;

export const Checkbox = Template.bind({});
Checkbox.args = {
  legend: "Класс",
  type: "checkbox",
  height: "300px",
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

export const Radio = Template.bind({});
Radio.args = {
  ...Checkbox.args,
  type: "radio",
};
