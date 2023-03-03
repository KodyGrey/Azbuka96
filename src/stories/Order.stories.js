import React from "react";

import OrderBar from "../components/Order/OrderBar";

export default {
  title: "OrderBar",
  component: OrderBar,
};

const Template = (args) => <OrderBar {...args} />;

export const UserVersion = Template.bind({});
UserVersion.args = {
  Number: 123456,
  Money: 9600,
  Date: "12.03.2022",
  Text: "В пункте выдачи",
  TextStyle: {
    color: "#4C9F70",
  },
};
