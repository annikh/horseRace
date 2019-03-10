import React, { Component } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { withAuthorization } from "../Session";

class Game extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container className="accountBody">
        <Row>Her skal det være et spill</Row>
        <Row>
          <Button className="btn-orange">Start Spill!</Button>
        </Row>
      </Container>
    );
  }
}
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Game);
