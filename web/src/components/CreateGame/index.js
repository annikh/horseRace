import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import Game from "../../objects/Game";
import { withFirebase } from "../Firebase";
import shortid from "shortid";
import CreateClassroom from "../CreateClassroom";

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.createGameForm = this.createGameForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addGame = this.addGame.bind(this);
    this.isValidPin = this.isValidPin.bind(this);
    this.fillScoreboard = this.fillScoreboard.bind(this);

    this.state = {
      loading: false,
      classroomName: "",
      classrooms: [],
      games: []
    };
  }

  componentDidMount() {
    const user_id = this.context.uid;
    this.setState({ loading: true });
    let games = [];
    this.props.firebase.games().on("value", snapshot => {
      snapshot.forEach(game => {
        if (game.val().user_id === user_id) {
          games.push(game.val());
        }
      });
    });
    this.setState({ games: games });
    this.props.firebase.classroomsByTeacher(user_id).on("value", snapshot => {
      this.setState({ loading: false, classrooms: snapshot.val() });
    });
  }

  addGame() {
    let newGamePin = shortid.generate();
    while (!this.isValidPin(newGamePin)) {
      newGamePin = shortid.generate();
    }
    let authUser = this.context;
    const names = this.state.classrooms[this.state.classroomName]["names"];
    const scoreboard = this.fillScoreboard(names);
    const game = new Game(
      false,
      authUser.uid,
      this.state.classroomName,
      null,
      scoreboard
    );
    this.props.firebase.addGame(newGamePin).set(game);
  }

  fillScoreboard(names) {
    let scoreboard = {};
    names.forEach(name => {
      scoreboard[name] = {
        isActive: false,
        points: 0,
        tasks: []
      };
    });
    return scoreboard;
  }

  isValidPin(pin) {
    for (var key in this.state.games) {
      if (this.state.games[key].pin === pin) {
        return false;
      }
    }
    return true;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addGame();
    alert("Spill opprettet");
  }

  handleChange(event) {
    this.setState({ classroomName: event.target.value });
  }

  createGameForm = () => {
    const classroomNames = Object.keys(this.state.classrooms);
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <Form.Label>
              <h2>Opprett et spill</h2>
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Velg hvilket klasserom som skal delta i spillet:
            </Form.Label>
          </Col>
          <Col>
            <Form.Control as="select" onChange={this.handleChange}>
              <option>Velg...</option>
              {classroomNames.length > 0 &&
                classroomNames.map((name, i) => (
                  <option key={i} value={name}>
                    {name}
                  </option>
                ))}
            </Form.Control>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="btn-orange" type="submit" block>
              Opprett spill
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const games = this.state.games;
    console.log("games", games);
    console.log("class", this.state.classrooms);
    return (
      <Container className="accountBody">
        <Row>
          <Col>
            <h2 style={{ textAlign: "left" }}>Dine spill:</h2>
            {games.length > 0 ? <GameList games={games} /> : <NoGames />}
          </Col>
          <Col>
            {this.createGameForm()}
            <Row>
              <CreateClassroom />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
CreateGame.contextType = AuthUserContext;

const condition = authUser => !!authUser;

const NoGames = () => (
  <p style={{ textAlign: "left" }}>Du har ingen spill ennå</p>
);

const GameList = ({ games }) => (
  <ListGroup variant="flush" style={{ width: "80%" }}>
    {games.map((game, i) => (
      <ListGroup.Item
        key={i}
        style={{ textAlign: "left" }}
        action
        variant="warning"
        pin={game.pin}
      >
        <Row>
          <Col>
            <strong>Klasse:</strong>
          </Col>
          <Col>{game.classroom_id}</Col>
        </Row>
        <Row>
          <Col>
            <strong>Dato: </strong>
          </Col>
          <Col>
            {new Intl.DateTimeFormat("en-GB", {
              year: "numeric",
              month: "long",
              day: "2-digit"
            }).format(game.date)}
          </Col>
        </Row>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default withFirebase(withAuthorization(condition)(CreateGame));
