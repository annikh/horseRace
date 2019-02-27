import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Nav } from 'react-bootstrap';
import { AuthUserContext } from '../Session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

const Navigation = ({match}) => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth match={match}/> : null
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({match}) => (
  <Nav className="navbar">
    <Nav.Item>
      <Link to={match.url} className="link"><FontAwesomeIcon icon="user" color="black"/>*brukernavn*</Link>
    </Nav.Item>
    <Nav.Item>
      <Link to={`${match.url}/create-classroom`} className="link">Klasserom</Link>
    </Nav.Item>
    <Nav.Item>
      <SignOutButton />
    </Nav.Item>
  </Nav>
);

export default Navigation;