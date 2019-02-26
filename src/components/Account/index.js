import React from 'react';
import PasswordChangeForm from '../PasswordChange';
import { Col, Row, Container } from 'react-bootstrap';
import './style.css';

const Account = () => (
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
);

export default Account;