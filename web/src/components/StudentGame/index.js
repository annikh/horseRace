import React, { Component } from "react";
import {
  Row,
  Navbar,
  Form,
  FormControl,
  Button,
  Container
} from "react-bootstrap";
import Game from "../../components/Game";

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

  guessPicture(picture) {
    //sjekk mot redux store currentGame -> Solution ->
    // ELLER hent fra en egen gameID: solution tabell, sjekk om den er lik
    // hvis riktig , sett currentGame til "isFinished"
  }

  render() {
    const { game, player } = this.props.location.state;
    return (
      <Container className="studentGame">
        <Navbar className="navbar-game" fixed="top">
          <Navbar.Brand className="mr-auto" variant="primary">
            GAME
          </Navbar.Brand>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-light">Gjett motiv</Button>
          </Form>
        </Navbar>
        {this.state.gameStarted === false ? (
          <Row style={{ justifyContent: "center" }}>
            Venter på at spillet skal starte..
          </Row>
        ) : (
          <Game game={game} player={player} />
        )}
      </Container>
    );
  }
}

export default StudentGame;
