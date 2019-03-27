import React, { Component } from "react";
import { Row, Nav, Button } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Editor from "../../components/Editor";
import { Redirect } from "react-router-dom";

class StudentGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exitGame: false,
      gameStarted: true,
      game: null,
      player: {
        tasks: [],
        points: 0
      }
    };
  }

  componentDidMount() {
    this.props.firebase.game(this.props.game_pin).on("value", snapshot => {
      this.setState({ game: snapshot.val() });
    });
  }

  exitGame = () => {
    const name = this.props.cookies.get("game_name");
    this.props.cookies.remove("game_name");

    this.props.firebase.gamePlayer(this.props.game_pin, name).child('isActive').set(
      false
    );
    this.setState({
      exitGame: true
    });
  };

  render() {
    return (
      <div className="studentGame">
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
            <h3>Hei, </h3>
          </Nav.Item>
        </Nav>
        {this.state.gameStarted === false ? (
          <Row style={{ justifyContent: "center" }}>
            Venter på at spillet skal starte..
          </Row>
        ) : (
          <div> <Editor/></div>
        )}
      </div>
    );
  }
}

export default withFirebase(StudentGame);
