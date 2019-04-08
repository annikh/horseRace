import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { PasswordForgetLink } from "../PasswordForget";
import { SignUpLink } from "../SignUp";

import { Form, Button, Row, Col } from "react-bootstrap";
import "./style.css";

const SignInPage = () => (
  <div>
    <SignInForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.TEACHER_ACCOUNT);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <Form className="signUpPage" onSubmit={this.onSubmit}>
        <div className="signUpFrame">
          <Row className="row">
            <Col>
              <Form.Label className="title">Logg inn</Form.Label>
            </Col>
          </Row>
          <Row className="row">
            <Col>
              <Form.Control
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
              />
            </Col>
          </Row>
          <Row className="row">
            <Col>
              <Form.Control
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <PasswordForgetLink />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                className="btn-orange"
                disabled={isInvalid}
                type="submit"
                block
              >
                LOGG INN
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <SignUpLink />
            </Col>
          </Row>
          {error && <p>{error.message}</p>}
        </div>
      </Form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
