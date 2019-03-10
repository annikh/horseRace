import React, { Component } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
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
      game: {},
      value: "",
      pinEntered: false,
      buttonValue: "Enter",
      placeholder: "Skriv inn PIN"
    };
  }

  handleEnterClassroomPin() {
    axios
      .GET(
        "https://us-central1-horse-race-232509.cloudfunctions.net/getGameById",
        this.state.value
      )
      .then(response => {
        const game = Object.key(response.data);
        this.setState({
          game: game,
          pinEntered: true,
          buttonValue: "Bli med!",
          value: ""
        });
      });
    console.log(this.state.game);
  }

  handleEnterStudentName() {
    const name = this.state.value;
    alert("Gratulerer " + name + ", du er inne!");
    //Redirect to classroom
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.state.pinEntered
      ? this.handleEnterStudentName()
      : this.handleEnterClassroomPin();
    event.preventDefault();
  }

  pinInput = () => {
    return (
      <Col md="auto">
        <Form.Control
          placeholder="Skriv inn navnet ditt"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </Col>
    );
  };

  namesDropDown = () => {
    return (
      <Form.Control as="select" onChange={this.handleChange}>
        <option>Velg...</option>
        {this.state.game.scoreboard.map((player, i) => (
          <option key={i} value={player.name}>
            {player.name}
          </option>
        ))}
      </Form.Control>
    );
  };

  render() {
    const isInvalid = this.state.value === "";

    return (
      <Form className="Student" onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <Form.Label>
              <h2>Bli med klassen din og spill!</h2>
            </Form.Label>
          </Col>
        </Row>
        <Row>
          {this.state.pinEntered === false
            ? this.pinInput()
            : this.namesDropDown()}
          <Col>
            <Button
              className="btn-classPin"
              disabled={isInvalid}
              variant="outline-light"
              type="submit"
            >
              {this.state.buttonValue}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Student;
