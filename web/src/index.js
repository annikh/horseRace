import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import Firebase, { FirebaseContext } from "./components/Firebase";
/* Add Redux */
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
/* Add Cookies */
import { CookiesProvider } from "react-cookie";
/* Add Font Awesome Icons */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
library.add(faUser);

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
<<<<<<< HEAD
  <CookiesProvider>
    <Provider store={store}>
      <FirebaseContext.Provider value={new Firebase()}>
        <App />
      </FirebaseContext.Provider>
    </Provider>
  </CookiesProvider>,
=======
  <Provider store={store}>
    <FirebaseContext.Provider value={new Firebase()}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </FirebaseContext.Provider>
  </Provider>,
>>>>>>> master
  document.getElementById("root")
);
