import React, { Component } from "react";
import { Container, Row, Button } from "react-bootstrap";
import Game from "../Game";

class GameBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      game: null
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.game().on("value", snapshot => {
      const gameObject = snapshot.val();

      if (gameObject) {
        const game_pin = gameObject.val().pin;
        if (game_pin && game_pin === reqGame.pin) {
          matched_game = {
            id: game.key,
            pin: game.val().pin,
            classroom_id: game.val().classroom_id,
            user_id: game.val().user_id,
            date: game.val().date,
            scoreboard: game.val().scoreboard
          };
        }
        this.setState({ loading: false });
      } else {
        this.setState({ game: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.game().off();
  }

  render() {
    const { game, loading } = this.state;

    return (
      <Container className="accountBody">
        {loading && <div>Loading ...</div>}
        <Row>
          {game ? <Game game={game} /> : <div>There are no such game</div>}
        </Row>
      </Container>
    );
  }
}

export default GameBase;
