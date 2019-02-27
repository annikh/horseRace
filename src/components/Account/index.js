import React from 'react';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';

import { Col, Row, Container } from 'react-bootstrap';
import './style.css';

const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Container className="accountBody">
      <Row>
        <Col>
          <h2>Innstillinger</h2>
        </Col>
        <Col>
          <h2>Spill</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <PasswordChangeForm />
        </Col>
        <Col>
        </Col>
      </Row>
    </Container>
  )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);