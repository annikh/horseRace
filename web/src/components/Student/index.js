import React, { Component } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import Game from "../Game";
import "./style.css";

class Student extends Component {
  constructor(props) {
    super(props);
    this.handleEnterClassroomPin = this.handleEnterClassroomPin.bind(this);
    this.handleEnterStudentName = this.handleEnterStudentName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.pinInput = this.pinInput.bind(this);
    this.namesDropDown = this.namesDropDown.bind(this);
    this.handleExitGame = this.handleExitGame.bind(this);

    this.state = {
      value: "",
      nameList: null,
      gamePin: null,
      buttonValue: "Enter",
      invalidPIN: false,
      invalidName: false
    };
  }

  handleEnterClassroomPin() {
    const gamePin = this.state.value.trim();
    this.props.firebase.gamePlayerList(gamePin).on("value", snapshot => {
      const teams = snapshot.val();
      let players = {};
      if (teams !== null) {
        this.props.cookies.set("game_pin", gamePin);
        teams.forEach(team => {
          let names = Object.keys(team.players);
          let values = Object.values(team.players);
          names.map((name, i) => (players[name] = values[i]));
        });
        this.setState({
          nameList: players,
          gamePin: gamePin,
          invalidPIN: false
        });
      } else {
        this.setState({ invalidPIN: true });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.gamePlayerList(this.state.gamePin).off();
  }

  handleEnterStudentName() {
    const name = this.state.value;
    if (name !== this.state.gamePin) {
      const team = this.getTeamFromPlayerName(name);
      const { cookies } = this.props;
      cookies.set("game_name", name);
      cookies.set("game_team", team);
      this.setState({ invalidName: false });
      this.props.firebase
        .gamePlayer(this.state.gamePin, team, name)
        .child("isActive")
        .set(true);
    } else {
      this.setState({ invalidName: true });
    }
  }

  getTeamFromPlayerName(name) {
    return this.state.nameList !== null ? this.state.nameList[name].team : "";
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.state.gamePin === null
      ? this.handleEnterClassroomPin()
      : this.handleEnterStudentName();
    event.preventDefault();
  }

  handleExitGame() {
    const team = this.props.cookies.get("game_team");
    const playerName = this.props.cookies.get("game_name");
    const gamePin = this.props.cookies.get("game_pin");

    this.props.firebase
      .gamePlayer(gamePin, team, playerName)
      .child("isActive")
      .set(false);

    this.props.cookies.remove("game_name");
    this.props.cookies.remove("game_pin");
    this.props.cookies.remove("game_team");

    this.setState({
      gamePin: null,
      nameList: null
    });
  }

  pinInput = () => {
    return (
      <Col md="auto">
        <Form.Control
          placeholder="Skriv inn PIN"
          onChange={this.handleChange}
          type={this.state.validated}
          isInvalid={this.state.invalidPIN}
        />
        <Form.Control.Feedback type="invalid">Feil PIN</Form.Control.Feedback>
      </Col>
    );
  };

  namesDropDown = () => {
    const nameList = this.state.nameList;
    return (
      <Col md="auto">
        <Form.Control
          required
          as="select"
          onChange={this.handleChange}
          isInvalid={this.state.invalidName}
        >
          <option>Hva heter du?</option>
          {Object.keys(nameList).map(
            (player, i) =>
              !nameList[player]["isActive"] && (
                <option key={i} value={player}>
                  {player}
                </option>
              )
          )}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          Velg et navn fra listen
        </Form.Control.Feedback>
      </Col>
    );
  };

  render() {
    const { cookies } = this.props;
    const nameCookie = cookies.get("game_name");
    const gamePinCookie = cookies.get("game_pin");
    return nameCookie === undefined || gamePinCookie === undefined ? (
      <Form className="student" onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <Form.Label>
              <h2>Bli med klassen din og spill!</h2>
            </Form.Label>
          </Col>
        </Row>
        <Row>
          {this.state.nameList ? this.namesDropDown() : this.pinInput()}
          <Col>
            <Button
              className="btn-classPin"
              variant="outline-light"
              type="submit"
            >
              {this.state.buttonValue}
            </Button>
          </Col>
        </Row>
        {this.state.info && (
          <Row>
            <Col style={{ fontSize: "14px", color: "#bf1818" }}>Feil PIN..</Col>
          </Row>
        )}
      </Form>
    ) : (
      <Game cookies={cookies} onExit={this.handleExitGame} />
    );
  }
}

export default withFirebase(Student);
