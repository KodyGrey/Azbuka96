import React from "react";

import ProductCard from "../components/Products/ProductCard";

import productImage from "../public/product-image.jpg";

export default {
  title: "Product Card",
  component: ProductCard,
};

const Template = (args) => <ProductCard {...args} />;

export const InStock = Template.bind({});
InStock.args = {
  type: "inStock",
  price: 2022,
  discountedPrice: 1422,
  title: "Русский родной язык. 3 класс. Учебник. ФГОС",
  author: "Александрова Ольга Маратовна",
  amount: 0,
  image:
    "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproduct-image.f90bfa51.jpg&w=1920&q=75",
};

export const OutOfStock = Template.bind({});
OutOfStock.args = {
  ...InStock.args,
  type: "outOfStock",
};

export const InCart = Template.bind({});
InCart.args = {
  ...InStock.args,
  amount: 12,
  type: "inCart",
};
