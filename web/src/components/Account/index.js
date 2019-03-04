import React, { Component } from 'react';
import { Col, Row, Container, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import './style.css';

class Account extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className="accountBody">
        <Col>
          <Row>
            <h2>Innstillinger</h2>
          </Row>
          <Row>
            <PasswordChangeForm />
          </Row>
        </Col>
      </Container>
    )
  }
} 

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);