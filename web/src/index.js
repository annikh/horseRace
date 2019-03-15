import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import * as ROUTES from "./constants/routes";
import App from "./components/App";
import Firebase, { FirebaseContext } from "./components/Firebase";
/* Add Redux */
import { Provider } from "react-redux";
import { createStore } from "redux";
import app from "./reducers";
/* Add Cookies */
import { CookiesProvider } from "react-cookie";
import { withCookies } from "react-cookie";
/* Add Font Awesome Icons */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
library.add(faUser);

const store = createStore(app);

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Provider store={store}>
      <CookiesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CookiesProvider>
    </Provider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
