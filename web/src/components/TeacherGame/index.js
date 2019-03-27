import React, { Component } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import "./style.css";

class TeacherGame extends Component {
  constructor(props) {
    super(props);
    this.playerList = this.playerList.bind(this);
    this.startStopGame = this.startStopGame.bind(this);

    this.state = {
      game: null,
      game_pin: "",
      isStarted: false,
      button_value: "Start Spill"
    };
  }

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    this.props.firebase.game(params.game_pin).on("value", snapshot => {
      this.setState({ game: snapshot.val(), game_pin: params.game_pin });
    });
  }

  startStopGame() {
    this.state.isStarted
      ? this.setState({ button_value: "Start Spill" }) &&
        this.props.firebase
          .game(this.state.game_pin)
          .child("isActive")
          .set(false)
      : this.setState({ button_value: "Avslutt Spill" }) &&
        this.props.firebase
          .game(this.state.game_pin)
          .child("isActive")
          .set(true);
  }

  playerList() {
    const { scoreboard } = this.state.game;
    return (
      <Container>
        <Row>
          {Object.keys(scoreboard).map(
            (player, i) =>
              scoreboard[player].isActive === true && (
                <Col>
                  <Link to="/test" key={i} style={{ textDecoration: "none" }}>
                    <Card className="player">
                      <Card.Body>
                        <Card.Title>{player}</Card.Title>
                        <Card.Text>
                          <Row>
                            <strong>Poeng:</strong> {scoreboard[player].points}
                          </Row>
                          <Row>Oppgaver: </Row>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              )
          )}
        </Row>
      </Container>
    );
  }

  render() {
    const { game_pin, button_value } = this.state;

    return (
      this.state.game && (
        <Container className="accountBody">
          <Row>
            <strong>Spill-PIN: </strong> {game_pin}
          </Row>
          {this.playerList()}
          <Row>
            <Button className="btn-orange" onClick={this.startStopGame}>
              {button_value}
            </Button>
          </Row>
        </Container>
      )
    );
  }
}

TeacherGame.contextType = AuthUserContext;
const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(TeacherGame));
