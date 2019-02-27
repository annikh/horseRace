import React from 'react';
import { Col, Row, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
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
          <p>Du har ingen spill ennå. Opprett et klasserom for å lage et.</p>
          <Link to={ROUTES.TEACHER + ROUTES.CREATE_CLASSROOM} style={{ textDecoration: 'none' }}><Button className="btn-orange">Opprett et klasserom</Button></Link>
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