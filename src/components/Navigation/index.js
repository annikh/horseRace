import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Nav } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from '../Session';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

const Navigation = ({match}) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <Nav className="navbar">
          <Nav.Item>
            <Link to={match.url} className="link"><FontAwesomeIcon icon="user" color="black"/> {authUser.email}</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to={`${match.url}/create-classroom`} className="link">Klasserom</Link>
          </Nav.Item>
          <Nav.Item>
            <SignOutButton />
          </Nav.Item>
        </Nav>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Navigation);