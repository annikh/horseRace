import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Nav } from 'react-bootstrap';
import './style.css';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <Nav className="navbar">
    <Nav.Item>
      <Nav.Link>Profil</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <SignOutButton />
    </Nav.Item>
  </Nav>
);

export default Navigation;