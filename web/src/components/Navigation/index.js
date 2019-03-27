import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../SignOut";
import { Nav } from "react-bootstrap";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Nav className="navbar">
        <Nav.Item>
          <Link to={ROUTES.TEACHER + ROUTES.ACCOUNT} className="link">
            <FontAwesomeIcon icon="user" color="black" />
            {authUser.email}
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={ROUTES.TEACHER} className="link">
            Spill
          </Link>
        </Nav.Item>
        <Nav.Item>
          <SignOutButton />
        </Nav.Item>
      </Nav>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Navigation);
