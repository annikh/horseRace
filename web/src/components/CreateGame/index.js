import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Button, Form, Row, Col, Table, ListGroup } from "react-bootstrap";
import Game from "../../objects/Game";
import PlayerList from "./playerList";
import { withFirebase } from "../Firebase";
import shortid from "shortid";

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addGame = this.addGame.bind(this);
    this.isValidPin = this.isValidPin.bind(this);
    this.fillScoreboard = this.fillScoreboard.bind(this);
    this.handleNewTeam = this.handleNewTeam.bind(this);
    this.handleNumberOfTeams = this.handleNumberOfTeams.bind(this);

    this.state = {
      loading: false,
      classroomName: "",
      tasks: null,
      scoreboard: {},
      chosenClass: false,
      numberOfTeams: 1
    };
  }

  componentDidMount() {
    this.props.firebase.tasks("variables").once("value", snapshot => {
      this.setState({ tasks: snapshot.val() });
    });
  }

  addGame() {
    let newGamePin = shortid.generate();
    while (!this.isValidPin(newGamePin)) {
      newGamePin = shortid.generate();
    }
    let authUser = this.context;
    const game = new Game(
      false,
      authUser.uid,
      this.state.classroomName,
      new Date(),
      this.state.scoreboard,
      this.state.tasks
    );
    this.props.firebase.addGame(newGamePin).set(game);
    this.setState({
      classroomName: "",
      chosenClass: false
    });
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

  handleNumberOfTeams(event) {
    this.setState({
      numberOfTeams: event.target.value
    });
  }

  handleChange(event) {
    const classroomName = event.target.value;
    const names = this.props.classrooms[classroomName]["names"];
    const scoreboard = this.fillScoreboard(names);
    this.setState({
      classroomName: classroomName,
      scoreboard: scoreboard,
      chosenClass: true
    });
  }

  fillScoreboard(names) {
    let scoreboard = {};
    names.forEach(name => {
      scoreboard[name] = {
        isActive: false,
        points: 0,
        tasks: null,
        team: 0,
        startTime: null,
        endTime: null
      };
    });
    return scoreboard;
  }

  handleNewTeam(event, name) {
    event.preventDefault();
    let currentTeam = this.state.scoreboard[name].team;
    if (currentTeam === this.state.numberOfTeams - 1) {
      currentTeam = 0;
    } else {
      currentTeam++;
    }
    this.setState(prevState => ({
      ...prevState,
      scoreboard: {
        ...prevState.scoreboard,
        [name]: {
          ...prevState.scoreboard[name],
          team: currentTeam
        }
      }
    }));
  }

  render() {
    const classroomNames = Object.keys(this.props.classrooms);
    return (
      <Form>
        <Row>
          <Col>
            <Form.Label>
              <h2>Opprett et spill:</h2>
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
              <option disabled={this.state.chosenClass}>Velg...</option>
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
            <Form.Label>Velg antall lag:</Form.Label>
          </Col>
          <Col>
            <Form.Control as="select" onChange={this.handleNumberOfTeams}>
              <option key={1} value={1}>
                1
              </option>
              <option key={2} value={2}>
                2
              </option>
              <option key={3} value={3}>
                3
              </option>
              <option key={4} value={4}>
                4
              </option>
              <option key={5} value={5}>
                5
              </option>
              <option key={6} value={6}>
                6
              </option>
            </Form.Control>
          </Col>
        </Row>
        {this.state.classroomName !== "" &&
          this.state.scoreboard !== {} &&
          this.state.numberOfTeams > 1 && (
            <PlayerList
              scoreboard={this.state.scoreboard}
              handleNewTeam={this.handleNewTeam}
            />
          )}

        <Row>
          <Col>
            <Button className="btn-orange" onClick={this.handleSubmit} block>
              Opprett spill
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

CreateGame.contextType = AuthUserContext;

const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(CreateGame));
