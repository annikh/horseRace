import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Game from "../../objects/Game";
import * as ROUTES from "../../constants/routes";
import shortid from "shortid";
import CreateClassroom from "../CreateClassroom";
import { connect } from "react-redux";
import { fetchGamesByTeacher, fetchClassroomsByTeacher } from "../../actions";

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.createGameForm = this.createGameForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addGame = this.addGame.bind(this);
    this.isValidPin = this.isValidPin.bind(this);
    this.getClassroomNames = this.getClassroomNames.bind(this);

    this.state = {
      doRedirect: false,
      loading: false,
      games: [],
      classrooms: [],
      classroom_id: ""
    };
  }

  componentDidMount() {
    let authUser = this.context;
    this.props.fetchGamesByTeacher(authUser.user_id);
    this.props.fetchClassroomsByTeacher(authUser.user_id);
  }

  addGame() {
    let newGamePin = shortid.generate();
    while (!this.isValidPin(newGamePin)) {
      newGamePin = shortid.generate();
    }
    let authUser = this.context;
    const classroomNames = this.getClassroomNames(this.state.classroom_id);
    let scoreboard = [];
    classroomNames.forEach(function(name) {
      let newPlayer = {
        name: name,
        points: 0,
        tasks: []
      };
      scoreboard.push(newPlayer);
    });

    const game = new Game(
      null,
      newGamePin,
      authUser.uid,
      this.state.classroom_id,
      null,
      scoreboard
    );
  }

  getClassroomNames(classroomName) {
    const classroom = this.state.classrooms.find(
      classroom => classroom.classroom_name === classroomName
    );
    let names = [];
    classroom.names.split(/\n/).map(name => names.push(name));
    return names;
  }

  isValidPin(pin) {
    for (var key in this.state.games) {
      console.log(this.state.games[key].pin);
      if (this.state.games[key].pin === pin) {
        return false;
      }
    }
    return true;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addGame();
    this.setState({ doRedirect: true });
  }

  handleChange(event) {
    this.setState({ classroom_id: event.target.value });
  }

  createGameForm = () => {
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
              {this.state.classrooms.map((classroom, i) => (
                <option key={i} value={classroom.key}>
                  {classroom.classroom_name}
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
    const { games } = this.state;

    return (
      <Container className="accountBody">
        {this.state.doRedirect && (
          <Redirect to={ROUTES.TEACHER + ROUTES.GAME} />
        )}
        <Row>
          <Col>
            <DisplayGames games={games} />
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

const DisplayGames = ({ games }) => (
  <div>
    <h2 style={{ textAlign: "left" }}>Dine spill:</h2>
    {Object.entries(games).length === 0 && games.constructor === Object ? (
      <NoGames />
    ) : (
      <GameList games={games} />
    )}
  </div>
);

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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchGamesByTeacher: () => dispatch(fetchGamesByTeacher(ownProps.user_id)),
    fetchClassroomsByTeacher: () =>
      dispatch(fetchClassroomsByTeacher(ownProps.user_id))
  };
};

const mapStateToProps = state => ({
  games: state.games,
  classrooms: state.games
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthorization(condition)(CreateGame));
