import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amount: 0,
};
if (typeof window !== "undefined") {
  for (let i = 0; i < localStorage.length; i++) {
    const el = Number(localStorage.getItem(localStorage.key(i)));
    if (typeof el === "number" && el) {
      initialState[localStorage.key(i)] = el;
      initialState.amount += 1;
    }
  }
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct(state, action) {
      const product = action.payload;
      localStorage.setItem(product.id, product.quantity);

      state[product.id] = product.quantity;
      state.amount += 1;
    },
    removeProduct(state, action) {
      const id = action.payload;
      state.amount -= 1;

      localStorage.removeItem(id);
      delete state[id];
    },
    changeItem(state, action) {
      const product = action.payload;

      state[product.id] = product.quantity;
      localStorage.setItem(product.id, product.quantity);
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
