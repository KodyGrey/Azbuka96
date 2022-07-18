import React from "react";

import SearchModal from "../components/Modal/SearchModal";

export default {
  title: "SearchModal",
  component: SearchModal,
};

const Template = (args) => <SearchModal {...args} />;

export const Default = Template.bind({});
Default.args = {};
