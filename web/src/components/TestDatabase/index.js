import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { withFirebase } from "../Firebase";
import { Button, ListGroup, Row, Col, Container } from "react-bootstrap";

class TestDatabase extends Component {
  constructor(props) {
    super(props);
    this.hentSpill = this.hentSpill.bind(this);
    this.playerToActive = this.playerToActive.bind(this);
    this.playerToInActive = this.playerToInActive.bind(this);

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

  playerToActive() {
    const game = this.props.firebase.game("-La_FeiGJhCT0b-kjK5N");
    game
      .child("scoreboard")
      .child("Ole")
      .child("isActive")
      .set(true);
  }

  playerToInActive() {
    const game = this.props.firebase.game("-La_FeiGJhCT0b-kjK5N");
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
        </Row>
        <Row>{this.state.game && this.names()}</Row>
      </Container>
    );
  }
}

export default withFirebase(withCookies(TestDatabase));
