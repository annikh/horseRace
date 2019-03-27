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
import TestDatabase from "../../components/TestDatabase";
import Game from "../../components/Game";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route
            exact
            path={ROUTES.LANDING}
            render={() => <Home cookies={this.props.cookies} />}
          />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route
            path={ROUTES.STUDENT}
            render={() => <Student cookies={this.props.cookies} />}
          />
          <Route path={ROUTES.TEACHER} component={Teacher} />
          <Route
            exact
            path={"/test"}
            render={() => <TestDatabase cookies={this.props.cookies} />}
          />
          <Route
            exact 
            path={"/editor"}
            render={() => <Game cookies={this.props.cookies} />}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);
