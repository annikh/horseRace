import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { withFirebase } from "../Firebase";
import Game from "../../objects/Game";
import { Button, ListGroup, Row, Col, Container } from "react-bootstrap";

class TestDatabase extends Component {
  constructor(props) {
    super(props);
    this.hentSpill = this.hentSpill.bind(this);
    this.playerToActive = this.playerToActive.bind(this);
    this.playerToInActive = this.playerToInActive.bind(this);
    this.leggTilSpill = this.leggTilSpill.bind(this);

    this.state = {
      loading: false,
      game: null
    };
  }

  hentSpill() {
    this.setState({ loading: true });
    console.log("hallo");
    const game = this.props.firebase.game("-La_FeiGJhCT0b-kjK5N");
    game.on("value", snapshot => {
      console.log(snapshot.val());
      this.setState({ loading: false, game: snapshot.val() });
    });
  }

  leggTilSpill() {
    const pin = "nyPin";
    let scoreboard = {};
    scoreboard["Kari"] = {
      tasks: null,
      points: 0
    };
    scoreboard["Per"] = {
      tasks: null,
      points: 0
    };
    const newGame = new Game("userid", "classid", null, scoreboard);

    this.props.firebase.addGame(pin).set(newGame);
  }

  playerToActive() {
    const game = this.props.firebase.game("nyPin");
    game
      .child("scoreboard")
      .child("Ole")
      .child("isActive")
      .set(true);
  }

  playerToInActive() {
    const game = this.props.firebase.game("nyPin");
    game
      .child("scoreboard")
      .child("Ole")
      .child("isActive")
      .set(false);
  }

  names = () => {
    return (
      <ListGroup>
        {Object.keys(this.state.game.scoreboard).map(
          (player, i) =>
            this.state.game.scoreboard[player]["isActive"] !== true && (
              <ListGroup.Item key={i}>{player}</ListGroup.Item>
            )
        )}
      </ListGroup>
    );
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Button onClick={this.hentSpill}>Hent spill</Button>
          </Col>
          <Col>
            <Button onClick={this.playerToActive}>Sett Ole til Aktiv</Button>
          </Col>
          <Col>
            <Button onClick={this.playerToInActive}>
              Sett Ole til InAktiv
            </Button>
          </Col>
          <Col>
            <Button onClick={this.leggTilSpill}>Legg til nytt spill</Button>
          </Col>
        </Row>
        <Row>{this.state.game && this.names()}</Row>
      </Container>
    );
  }
}

export default withFirebase(withCookies(TestDatabase));
