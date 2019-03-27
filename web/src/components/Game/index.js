import React, { Component } from "react";
import { Container, Row, Button } from "react-bootstrap";

class Game extends Component {
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

export default Game;
