import React, { Component } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import StudentGame from "../StudentGame";
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

    this.state = {
      value: "",
      scoreboard: null,
      game_pin: null,
      buttonValue: "Enter"
    };
  }

  handleEnterClassroomPin() {
    const game_pin = this.state.value;
    this.setState({ game_pin: game_pin });
    const { cookies } = this.props;
    cookies.set("game_pin", game_pin);
    this.props.firebase.gameScoreboard(game_pin).on("value", snapshot => {
      this.setState({ scoreboard: snapshot.val() });
    });
  }

  handleEnterStudentName() {
    const name = this.state.value;
    const { cookies } = this.props;
    cookies.set("game_name", name);
    this.props.firebase
      .gameScoreboard(this.state.game_pin)
      .child(name)
      .child("isActive")
      .set(true);
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
    const scoreboard = this.state.scoreboard;
    console.log("scoreboard: ", scoreboard)
    return (
      <Col md="auto">
        <Form.Control as="select" onChange={this.handleChange}>
          <option>Hva heter du?</option>
          {Object.keys(scoreboard).map(
            (player, i) =>
              !scoreboard[player]["isActive"] && (
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
          {this.state.scoreboard ? this.namesDropDown() : this.pinInput()}
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
      <StudentGame cookies={cookies} />
    );
  }
}

export default withFirebase(Student);
