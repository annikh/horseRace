import React, { Component } from "react";
import { Row, Nav } from "react-bootstrap";

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
    const { game, player } = this.props.location.state;
    return (
      <div className="studentGame">
        <Nav className="justify-content-center">
          <Nav.Item>
            <h3>Hei, {player}</h3>
          </Nav.Item>
        </Nav>
        {this.state.gameStarted === false ? (
          <Row style={{ justifyContent: "center" }}>
            Venter på at spillet skal starte..
          </Row>
        ) : (
          <div> Her skal spillet komme</div>
        )}
      </div>
    );
  }
}

export default StudentGame;
