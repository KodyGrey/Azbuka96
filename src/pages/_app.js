import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";

import Header from "../components/Header/Header";
import MenuBar from "../components/MenuBar/MenuBar";
import Footer from "../components/Footer/Footer";

import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [productsList, setProductsList] = useState([]);
  useEffect(() => {
    async function getProductsList() {
      const data = await (await fetch("/api/products")).json();
      setProductsList(data);
    }
    getProductsList();
  }, []);

  return (
    <Provider store={store}>
      <Header></Header>

      <main className="main-body">
        <Component {...pageProps} productsList={productsList} />
      </main>

      <MenuBar />
      <Footer />
    </Provider>
  );
}

export default MyApp;
