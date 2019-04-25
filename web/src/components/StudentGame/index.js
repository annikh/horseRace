import React, { Component } from "react";
import { Row, Nav, Button, Container } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import Game from "../Game";
import GuessFigure from "../GuessFigure";

class StudentGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exitGame: false,
      gameIsActive: false,
      gamePin: this.props.cookies.get("game_pin"),
      playerName: this.props.cookies.get("game_name"),
      team: this.props.cookies.get("game_team"),
      figure: ""
    };
  }

  componentDidMount() {
    this.props.firebase.gameState(this.state.gamePin).on("value", snapshot => {
      this.setState({ gameIsActive: snapshot.val() });
    });

    this.props.firebase
      .gameFigure(this.state.gamePin)
      .once("value", snapshot => {
        this.setState({ figure: snapshot.val() });
        console.log(snapshot.val());
      });
  }

  componentWillUnmount() {
    this.props.firebase.gameState(this.state.gamePin).off();
  }

  exitGame = () => {
    this.props.firebase
      .gamePlayer(this.state.gamePin, this.state.team, this.state.playerName)
      .child("isActive")
      .set(false);

    this.props.cookies.remove("game_name");
    this.props.cookies.remove("game_pin");
    this.props.cookies.remove("game_team");

    this.setState({
      exitGame: true,
      gamePin: null,
      playerName: null,
      team: 0
    });

    this.props.onExit();
  };

  render() {
    return (
      <Container className="studentGame">
        <Nav className="studentGameNav">
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
            <h3>Hei, {this.state.playerName} </h3>
          </Nav.Item>
          <Nav.Item>
            <GuessFigure
              figure={this.state.figure}
              gamePin={this.state.gamePin}
              gameTeam={this.state.team}
            />
          </Nav.Item>
        </Nav>
        {this.state.gamePin && !this.state.gameIsActive ? (
          <Row style={{ justifyContent: "center" }}>
            Venter på at spillet skal starte..
          </Row>
        ) : (
          <Game figure={this.state.figure} cookies={this.props.cookies} />
        )}
      </Container>
    );
  }
}

export default withFirebase(StudentGame);
