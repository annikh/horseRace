import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Button, Row, Col } from "react-bootstrap";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import "./style.css";

const SignUpPage = () => <SignUpForm />;

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
<<<<<<< HEAD

      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.TEACHER_ACCOUNT);
=======
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.TEACHER_CLASSROOMS);
>>>>>>> master
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
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <Form className="signUpPage" onSubmit={this.onSubmit}>
        <div className="signUpFrame">
          <Row className="row">
            <Col>
              <Form.Label className="title">Registrer bruker</Form.Label>
            </Col>
          </Row>
          <Row className="row">
            <Col>
              <Form.Control
                name="username"
                value={username}
                onChange={this.onChange}
                type="text"
                placeholder="Full Name"
              />
            </Col>
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
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
            </Col>
            <Col>
              <Form.Control
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm Password"
              />
            </Col>
          </Row>
          <Row className="row">
            <Col>
              <Button
                className="btn-submit"
                disabled={isInvalid}
                type="submit"
                block
              >
                Sign Up
              </Button>
            </Col>
          </Row>
          {error && <p>{error.message}</p>}
        </div>
      </Form>
    );
  }
}

const SignUpLink = () => (
  <p>
    <Link to={ROUTES.SIGN_UP}>
      <Button className="btn-green" block>
        OPPRETT NY BRUKER
      </Button>
    </Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default withFirebase(SignUpPage);

export { SignUpForm, SignUpLink };
