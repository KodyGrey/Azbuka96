import React from "react";
import ProductHorizontalCard from "../components/Products/ProductHorizontalCard";

export default {
  title: "ProductHorizontalCard",
  component: ProductHorizontalCard,
};

const Template = (args) => <ProductHorizontalCard {...args} />;

export const InCart = Template.bind({});
InCart.args = {
  key: 32456,
  id: 32456,
  type: "inCart",
  price: 2022,
  discountedPrice: 1422,
  title: "Русский родной язык. 3 класс. Учебник. ФГОС",
  author: "Александрова Ольга Маратовна",
  amount: 12,
  image:
    "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproduct-image.f90bfa51.jpg&w=1920&q=75",
};

export const InOrder = Template.bind({});
InOrder.args = {
  ...InCart.args,
  type: "inOrder",
};
