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
      game_pin: null,
      buttonValue: "Enter"
    };
  }

  handleEnterClassroomPin() {
    const game_pin = this.state.value;
    this.setState({ game_pin: game_pin });
    this.props.cookies.set("game_pin", game_pin);

    this.props.firebase.gamePlayerList(game_pin).once("value", snapshot => {
      const teams = snapshot.val();
      let players = {};
      teams.forEach(team => {
        let names = Object.keys(team.players);
        let values = Object.values(team.players);
        names.map((name, i) => (players[name] = values[i]));
      });
      this.setState({ nameList: players });
    });
  }

  handleEnterStudentName() {
    const name = this.state.value;
    const team = this.getTeamFromPlayerName(name);
    const { cookies } = this.props;
    cookies.set("game_name", name);
    cookies.set("game_team", team);
    this.props.firebase
      .gamePlayer(this.state.game_pin, team, name)
      .child("isActive")
      .set(true);
  }

  getTeamFromPlayerName(name) {
    return this.state.nameList !== null ? this.state.nameList[name].team : "";
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.state.game_pin === null
      ? this.handleEnterClassroomPin()
      : this.handleEnterStudentName();
    event.preventDefault();
  }

  handleExitGame() {
    this.setState({
      game_pin: null,
      nameList: null
    });
  }

  pinInput = () => {
    return (
      <Col md="auto">
        <Form.Control
          placeholder="Skriv inn PIN"
          onChange={this.handleChange}
        />
      </Col>
    );
  };

  namesDropDown = () => {
    const nameList = this.state.nameList;
    return (
      <Col md="auto">
        <Form.Control as="select" onChange={this.handleChange}>
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
      </Form>
    ) : (
      <Game
        cookies={cookies}
        onExit={this.handleExitGame}
        onGameOver={this.handleExitGame}
      />
    );
  }
}

export default withFirebase(Student);
