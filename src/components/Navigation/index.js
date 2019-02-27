import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Nav } from 'react-bootstrap';
import './style.css';
import { AuthUserContext } from '../Session';

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
      <Link to={match.url}>Profil</Link>
    </Nav.Item>
    <Nav.Item>
      <Link to={`${match.url}/create-classroom`}>Opprett et klasserom</Link>
    </Nav.Item>
    <Nav.Item>
      <SignOutButton />
    </Nav.Item>
  </Nav>
);

export default Navigation;