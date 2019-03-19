import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Student from "./components/Student";
import Teacher from "./components/Teacher";
import App from "./components/App";
import SignUpPage from "./components/SignUp";
import SignInPage from "./components/SignIn";
import StudentGame from "./components/StudentGame";
import Editor from './components/Editor';
import PasswordForgetPage from "./components/PasswordForget";
import Firebase, { FirebaseContext } from "./components/Firebase";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import * as ROUTES from "./constants/routes";

/* Add Font Awesome Icons */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
library.add(faUser);

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Router>
      <div>
        <Route exact path={ROUTES.LANDING} component={App} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route exact path={ROUTES.STUDENT} component={Student} />
        <Route path={ROUTES.TEACHER} component={Teacher} />
        <Route path={'/editor'} component={Editor} />
        <Route
          exact
          path={ROUTES.STUDENT + ROUTES.STUDENT_GAME + "/:user"}
          component={StudentGame}
        />
      </div>
    </Router>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
