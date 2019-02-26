import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Nav } from 'react-bootstrap';
import { AuthUserContext } from '../Session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : null
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <Nav className="navbar">
    <Nav.Item>
      <Link to={ROUTES.ACCOUNT} className="link"><FontAwesomeIcon icon="user" color="black"/>*brukernavn*</Link>
    </Nav.Item>
    <Nav.Item>
      <SignOutButton />
    </Nav.Item>
  </Nav>
);

export default Navigation;