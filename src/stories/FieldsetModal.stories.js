import React from "react";
import FieldsetModal from "../components/Modal/FieldsetModal";

export default {
  title: "Fieldset Modal",
  component: FieldsetModal,
};

const Template = (args) => <FieldsetModal {...args} />;

export const Default = Template.bind({});
Default.args = {};
