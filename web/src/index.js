import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import Firebase, { FirebaseContext } from "./components/Firebase";

/* Add Cookies */
import { CookiesProvider } from "react-cookie";
/* Add Font Awesome Icons */
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faPlay,
  faClock,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
library.add(faUser, faPlay, faClock, faCheck);

ReactDOM.render(
  <CookiesProvider>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </CookiesProvider>,
  document.getElementById("root")
);
