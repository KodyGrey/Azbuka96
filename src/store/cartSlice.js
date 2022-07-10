import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amount: 0,
};
if (typeof window !== "undefined") {
  for (let i = 0; i < localStorage.length; i++) {
    initialState[localStorage.key(i)] = localStorage.getItem(
      localStorage.key(i)
    );
  }
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct(state, action) {
      const product = action.payload;
      localStorage.setItem(product.id, product);

      state.push(product);
      state.amount += product.quantity;
    },
    removeProduct(state, action) {
      const id = action.payload;
      state.amount -= state.id.quantity;

      localStorage.removeItem(id);
      delete state.id;
    },
    changeItem(state, action) {
      const item = action.payload;
      state.amount += item.quantity - state[item.key].quantity;

      state[item.key] = item;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
