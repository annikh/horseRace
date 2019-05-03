import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Button, Form, Row, Col } from "react-bootstrap";
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
    this.createTeams = this.createTeams.bind(this);
    this.updateTeams = this.updateTeams.bind(this);
    this.handleNewTeam = this.handleNewTeam.bind(this);
    this.handleNumberOfTeams = this.handleNumberOfTeams.bind(this);
    this.handleFigureChoice = this.handleFigureChoice.bind(this);
    this.handleTaskGroup = this.handleTaskGroup.bind(this);

    this.state = {
      loading: false,
      classroomName: "",
      tasks: null,
      teams: {},
      chosenClass: false,
      numberOfTeams: 0,
      figureChoices: {},
      figure: null,
      formValidated: false,
      taskGroup: ""
    };
  }

  componentDidMount() {
    this.props.firebase.tasks().once("value", snapshot => {
      this.setState({ tasks: snapshot.val() });
    });

    this.props.firebase.figureChoices().once("value", snapshot => {
      this.setState({ figureChoices: snapshot.val() });
    });
  }

  addGame() {
    let newGamePin = shortid
      .generate()
      .toLowerCase()
      .replace(/[-_]/g, "");
    const teams = this.updateTeams();
    while (!this.isValidPin(newGamePin)) {
      newGamePin = shortid.generate();
    }
    let authUser = this.context;
    const game = new Game(
      false,
      authUser.uid,
      this.state.classroomName,
      new Date().getTime(),
      teams,
      this.state.figure,
      false
    );
    this.props.firebase.addGame(newGamePin).set(game);
    this.setState({
      classroomName: "",
      chosenClass: false,
      figure: null,
      numberOfTeams: 0,
      taskGroup: ""
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
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.addGame();
    }
    this.setState({ formValidated: true });
  }

  handleNumberOfTeams(event) {
    this.setState({
      numberOfTeams: event.target.value
    });
    if (this.state.chosenClass)
      this.handleChange({ target: { value: this.state.classroomName } });
  }

  handleTaskGroup(event) {
    this.setState({
      taskGroup: event.target.value
    });
  }

  handleChange(event) {
    const classroomName = event.target.value;
    const names = this.props.classrooms[classroomName]["names"];
    const teams = this.createTeams(names);
    this.setState({
      classroomName: classroomName,
      teams: teams,
      chosenClass: true
    });
  }

  updateTeams() {
    let newTeams = {};
    const { tasks, taskGroup, teams } = this.state;
    Object.keys(teams).forEach(name => {
      let team = teams[name].team;
      if (!newTeams[team])
        newTeams[team] = {
          players: {},
          tasks: tasks[taskGroup],
          points: 0,
          pictureSolved: false,
          boardFinished: false
        };
      let newPlayer = {
        isActive: false,
        tasks: null,
        team: team,
        startTime: null,
        endTime: null
      };
      newTeams[team].players[name] = newPlayer;
    });
    return newTeams;
  }

  createTeams(names) {
    let teams = {};
    names.forEach(name => {
      teams[name] = {
        isActive: false,
        tasks: null,
        team: 0,
        startTime: null,
        endTime: null
      };
    });
    return teams;
  }

  handleNewTeam(event, name) {
    event.preventDefault();
    let currentTeam = this.state.teams[name].team;
    if (currentTeam === this.state.numberOfTeams - 1) {
      currentTeam = 0;
    } else {
      currentTeam++;
    }
    this.setState(prevState => ({
      ...prevState,
      teams: {
        ...prevState.teams,
        [name]: {
          ...prevState.teams[name],
          team: currentTeam
        }
      }
    }));
  }

  handleFigureChoice(event) {
    this.setState({ figure: event.target.value });
  }

  render() {
    const formValidated = this.state.formValidated;
    const classroomNames = Object.keys(this.props.classrooms);
    const figureChoices = Object.keys(this.state.figureChoices);
    return (
      <Form
        noValidate
        validated={formValidated}
        onSubmit={e => this.handleSubmit(e)}
      >
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
            <Form.Control
              required
              as="select"
              onChange={this.handleChange}
              value={this.state.classroomName ? this.state.classroomName : ""}
            >
              <option disabled={this.state.chosenClass} value="">
                Velg...
              </option>
              {classroomNames.length > 0 &&
                classroomNames.map((name, i) => (
                  <option key={i} value={name}>
                    {name}
                  </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Vennligst velg et klasserom fra listen.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Velg antall lag:</Form.Label>
          </Col>
          <Col>
            <Form.Control
              required
              as="select"
              onChange={this.handleNumberOfTeams}
              value={
                this.state.numberOfTeams === 0 ? "" : this.state.numberOfTeams
              }
            >
              <option disabled={this.state.numberOfTeams > 1} key={1} value="">
                Velg..
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
            <Form.Control.Feedback type="invalid">
              Vennligst velg antall lag.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Velg løsningsfigur:</Form.Label>
          </Col>
          <Col>
            <Form.Control
              required
              as="select"
              onChange={this.handleFigureChoice}
              value={this.state.figure === null ? "" : this.state.figure}
            >
              <option disabled={this.state.figure !== null} value="">
                Velg...
              </option>
              {figureChoices.length > 0 &&
                figureChoices.map((id, i) => (
                  <option key={i} value={id}>
                    {this.state.figureChoices[id]}
                  </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Vennligst velg en løsningsfigur fra listen.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Velg opgaver:</Form.Label>
          </Col>
          <Col>
            <Form.Control
              required
              as="select"
              onChange={this.handleTaskGroup}
              value={this.state.taskGroup === "" ? "" : this.state.taskGroup}
            >
              <option disabled={this.state.taskGroup !== ""} value="">
                Velg...
              </option>
              {this.state.tasks !== null &&
                Object.keys(this.state.tasks).length > 0 &&
                Object.keys(this.state.tasks).map((taskGroup, i) => (
                  <option key={i} value={taskGroup}>
                    {taskGroup}
                  </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Vennligst velg oppgaver.
            </Form.Control.Feedback>
          </Col>
        </Row>
        {this.state.classroomName !== "" &&
          this.state.teams !== {} &&
          this.state.chosenClass &&
          this.state.numberOfTeams > 1 &&
          this.state.taskGroup !== "" && (
            <PlayerList
              teams={this.state.teams}
              handleNewTeam={this.handleNewTeam}
            />
          )}
        <Row>
          <Col>
            <Button type="submit" className="btn-orange" block>
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
