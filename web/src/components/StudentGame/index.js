import React, { Component } from "react";
import { Row, Nav, Button, Container } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import Game from "../Game";

class StudentGame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exitGame: false,
      gameIsActive: false, 
      gamePin: null,
      player: {
        tasks: [],
        points: 0
      }
    };
  }

  componentDidMount() {
    const game_pin = this.props.cookies.get("game_pin");
    this.setState({ gamePin: game_pin })
    this.props.firebase.gameState(game_pin).on("value", snapshot => {
      this.setState({ gameIsActive: snapshot.val() });
    });
  }

  exitGame = () => {
    const name = this.props.cookies.get("game_name");
    const game_pin = this.props.cookies.get("game_pin");
    this.props.cookies.remove("game_name");
    this.props.cookies.remove("game_pin");

    this.props.firebase.gamePlayer(game_pin, name).child('isActive').set(
      false
    );
    this.setState({
      exitGame: true,
      gamePin: null
    });
  };

  render() {
    return (
      <Container className="studentGame">
        <Nav className="justify-content-center">
          <Nav.Item>
            {this.state.exitGame ? (
              <Redirect
                to={{
                  pathname: ROUTES.STUDENT
                }}
              />
            ) : (
              <Button onClick={this.exitGame}>Avslutt spill</Button>
            )}
          </Nav.Item>
          <Nav.Item>
            <h3>Hei, {this.props.cookies.get("game_name")} </h3>
          </Nav.Item>
        </Nav>
        {this.state.gamePin && !this.state.gameIsActive ? (
          <Row style={{ justifyContent: "center" }}>
            Venter på at spillet skal starte..
          </Row>
        ) : (
          <Game cookies={this.props.cookies} />
        )}
      </Container>
    );
  }
}

export default withFirebase(StudentGame);
