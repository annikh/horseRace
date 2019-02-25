import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Nav } from 'react-bootstrap';
import './style.css';
import { AuthUserContext } from '../Session';

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
      <Link to={ROUTES.ACCOUNT}>Profil</Link>
    </Nav.Item>
    <Nav.Item>
      <SignOutButton />
    </Nav.Item>
  </Nav>
);

export default Navigation;