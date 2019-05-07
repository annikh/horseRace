import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../SignOut";
import { Navbar, Nav } from "react-bootstrap";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Navbar className="navbar">
        <Nav className="navbar-items">
          <Nav.Item>
            <Link to={ROUTES.TEACHER_ACCOUNT} className="link">
              <FontAwesomeIcon icon="user" color="black" />
              <span style={{ marginLeft: "5px" }}>{authUser.email}</span>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to={ROUTES.TEACHER_GAMES} className="link">
              Spill
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to={ROUTES.TEACHER} className="link">
              Klasserom
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to={ROUTES.TEACHER_STUDENTS} className="link">
              Elever
            </Link>
          </Nav.Item>
          <Nav.Item>
            <SignOutButton />
          </Nav.Item>
        </Nav>
      </Navbar>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Navigation);
