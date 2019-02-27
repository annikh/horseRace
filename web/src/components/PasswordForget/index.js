import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
  <div>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <Form className="signInPage" onSubmit={this.onSubmit}>
        <div className="signInFrame">
          <Row>
        		<Col>
							<Form.Label className="title">Reset Passord</Form.Label>
						</Col>
					</Row>
          <Row>
            <Col>
              <Form.Control
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="text"
                placeholder="Epost"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button disabled={isInvalid} type="submit">
                Reset passord
              </Button>
            </Col>
          </Row>
          {error && <p>{error.message}</p>}
        </div>
      </Form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link className="link" to={ROUTES.PASSWORD_FORGET}>Glemt passord?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };