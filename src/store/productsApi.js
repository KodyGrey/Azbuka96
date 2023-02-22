import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/products" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (id) => id,
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
