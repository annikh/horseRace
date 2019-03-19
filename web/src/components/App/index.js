import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { withCookies } from "react-cookie";
import * as ROUTES from "../../constants/routes";
import "./App.css";
// COMPONENTS
import Home from "../../components/Home";
import Student from "../../components/Student";
import Teacher from "../../components/Teacher";
import SignUpPage from "../../components/SignUp";
import SignInPage from "../../components/SignIn";
import StudentGame from "../../components/StudentGame";
import PasswordForgetPage from "../../components/PasswordForget";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path={ROUTES.LANDING} component={Home} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route
            exact
            path={ROUTES.STUDENT}
            render={() => <Student cookies={this.props.cookies} />}
          />
          <Route path={ROUTES.TEACHER} component={Teacher} />
          <Route
            exact
            path={ROUTES.STUDENT + ROUTES.STUDENT_GAME + "/:user"}
            render={() => <StudentGame cookies={this.props.cookies} />}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);
