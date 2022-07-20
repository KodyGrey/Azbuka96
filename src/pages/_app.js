import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";

import Header from "../components/Header/Header";
import MenuBar from "../components/MenuBar/MenuBar";
import Footer from "../components/Footer/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Header></Header>

      <main className="main-body">
        <Component {...pageProps} />
      </main>

      <MenuBar />
      <Footer />
    </Provider>
  );
}

export default MyApp;
