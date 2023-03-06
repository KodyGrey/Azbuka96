import React from "react";

import TextInput from "../components/UI/TextInput";

export default {
  title: "Text Input",
  component: TextInput,
};

const Template = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: "Имя пользователя",
  style: {
    width: "400px",
    height: "40px",
  },
};
