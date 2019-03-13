import React from "react";
import { Link } from "react-router-dom";
import { Router, Route, Switch } from "react-router-dom";
import { withCookies } from "react-cookie";
import { Button, Container, Row, Col } from "react-bootstrap";
import * as ROUTES from "../../constants/routes";
import "./App.css";
// COMPONENTS
import Student from "./components/Student";
import Teacher from "./components/Teacher";
import App from "./components/App";
import SignUpPage from "./components/SignUp";
import SignInPage from "./components/SignIn";
import StudentGame from "./components/StudentGame";
import PasswordForgetPage from "./components/PasswordForget";
import Firebase, { FirebaseContext } from "./components/Firebase";

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route
          exact
          path={ROUTES.LANDING}
          render={() => <Home cookies={this.props.cookies} />}
        />
        <Route
          path={ROUTES.SIGN_UP}
          render={() => <SignUpPage cookies={this.props.cookies} />}
        />
        <Route
          path={ROUTES.SIGN_IN}
          render={() => <SignInPage cookies={this.props.cookies} />}
        />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          render={() => <PasswordForgetPage cookies={this.props.cookies} />}
        />
        <Route
          exact
          path={ROUTES.STUDENT}
          render={() => <Student cookies={this.props.cookies} />}
        />
        <Route
          path={ROUTES.TEACHER}
          render={() => <Teacher cookies={this.props.cookies} />}
        />
        <Route
          exact
          path={ROUTES.STUDENT + ROUTES.STUDENT_GAME + "/:user"}
          render={() => <StudentGame cookies={this.props.cookies} />}
        />
      </Switch>
    </div>
  );
};

export default withCookies(App);
