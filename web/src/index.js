import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { withCookies } from "react-cookie";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import * as ROUTES from "./constants/routes";
import App from "./components/App";
/* Add Font Awesome Icons */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
library.add(faUser);

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <CookiesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CookiesProvider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
