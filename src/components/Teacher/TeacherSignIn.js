import React from "react";
import { SignIn } from "aws-amplify-react";
import { Form, Button } from 'react-bootstrap';
import './Teacher.css'

export class TeacherSignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ["signIn", "signedOut", "signedUp"];
  }

  showComponent(theme) {
    return (
      <Form className="LogInForm">
      <Form.Label className="Header">Logg Inn</Form.Label>
        <Form.Group>
          <Form.Control
            id="username"
            key="username"
            name="username"
            onChange={this.handleInputChange}
            type="text"
            placeholder="Brukernavn"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            id="password"
            key="password"
            name="password"
            onChange={this.handleInputChange}
            type="password"
            placeholder="******************"
          />
           </Form.Group>
          <Form.Group>
          <a  onClick={() => super.changeState("forgotPassword")}>
            Glemt Passord?
          </a>
        </Form.Group>
        <Form.Group>
          <div className="flex items-center justify-between">
            <Button onClick={() => super.signIn()} block>
              Logg inn
            </Button>
            <p className="text-grey-dark text-xs">
             Ikke registrert?{" "}
              <a onClick={() => super.changeState("signUp")}>Opprett bruker </a>
            </p>
          </div>
        </Form.Group>
      </Form>
    );
  }
}