import React from "react";

import Button from "../components/UI/Button";

export default {
  title: "Buttons",
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  style: {
    width: "120px",
    height: "48px",
  },
  children: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...Primary.args,
  isSecondary: true,
};
