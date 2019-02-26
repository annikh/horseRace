import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { Nav } from 'react-bootstrap';
import './style.css';
import { AuthUserContext } from '../Session';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationNonAuth = () => (
  <Nav className="navbar">
    <Nav.Item>
      <Link to={ROUTES.LANDING}>Til forsiden</Link>
    </Nav.Item>
    <Nav.Item>
      <Link to={ROUTES.SIGN_IN}>Logg inn</Link>
    </Nav.Item>
    <Nav.Item>
      <SignUpLink />
    </Nav.Item>
    <Nav.Item>
      <PasswordForgetLink />
    </Nav.Item>
  </Nav>
);

const NavigationAuth = () => (
  <Nav className="navbar">
    <Nav.Item>
      <Link to={ROUTES.ACCOUNT}>Profil</Link>
    </Nav.Item>
    <Nav.Item>
      <Link to={ROUTES.CREATE_CLASSROOM}>Opprett et klasserom</Link>
    </Nav.Item>
    <Nav.Item>
      <SignOutButton />
    </Nav.Item>
  </Nav>
);

export default Navigation;