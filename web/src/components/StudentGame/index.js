import React, { Component } from "react";
import { Container, Row, Button } from "react-bootstrap";

class StudentGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      player: {
        tasks: [],
        points: 0
      }
    };
  }

  render() {
    const { game, player } = this.props.location;
    return (
      <Container className="studentGame">
        <Row>Hei, {player}</Row>
        {this.state.gameStarted === false ? (
          <Row>Venter på at spillet skal starte..</Row>
        ) : (
          <Row> Her skal spillet komme</Row>
        )}
      </Container>
    );
  }
}

export default StudentGame;
