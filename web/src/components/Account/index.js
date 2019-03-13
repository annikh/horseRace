import React, { Component } from "react";
import { Col, Row, Container } from "react-bootstrap";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization } from "../Session";
import "./style.css";

class Account extends Component {
  render() {
    return (
      <Container className="accountBody">
        <Col>
          <Row>
            <h2>Innstillinger</h2>
          </Row>
          <Row>
            <PasswordChangeForm />
          </Row>
        </Col>
      </Container>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
