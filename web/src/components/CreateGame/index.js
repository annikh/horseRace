import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import Game from "../../objects/Game";
import { withFirebase } from "../Firebase";
import shortid from "shortid";
import CreateTeams from "../CreateTeams";

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addGame = this.addGame.bind(this);
    this.isValidPin = this.isValidPin.bind(this);
    this.fillScoreboard = this.fillScoreboard.bind(this);

    this.state = {
      loading: false,
      classroomName: "",
      tasks: null
    };
  }

  componentDidMount() {
    this.props.firebase.tasks("variables").once("value", snapshot => {
      console.log(snapshot.val());
      this.setState({ tasks: snapshot.val() });
    });
  }

  addGame() {
    let newGamePin = shortid.generate();
    while (!this.isValidPin(newGamePin)) {
      newGamePin = shortid.generate();
    }
    let authUser = this.context;
    const names = this.props.classrooms[this.state.classroomName]["names"];
    const scoreboard = this.fillScoreboard(names);
    const game = new Game(
      false,
      authUser.uid,
      this.state.classroomName,
      null,
      scoreboard,
      this.state.tasks
    );
    this.props.firebase.addGame(newGamePin).set(game);
  }

  fillScoreboard(names) {
    let scoreboard = {};
    names.forEach(name => {
      scoreboard[name] = {
        isActive: false,
        points: 0,
        tasks: null
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

  render() {
    const classroomNames = Object.keys(this.props.classrooms);
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
        {this.state.classroomName !== "" && <CreateTeams />}
        <Row>
          <Col>
            <Button className="btn-orange" type="submit" block>
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
