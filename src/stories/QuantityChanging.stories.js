import React from "react";

import QuantityChanging from "../components/UI/QuantityChanging";

export default {
  title: "Quantity changing",
  component: QuantityChanging,
};

const Template = (args) => <QuantityChanging {...args} />;

export const Default = Template.bind({});
Default.args = {
  amount: 12,
};
