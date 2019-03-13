import React, { Component } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import axios from "axios";
import * as ROUTES from "../../constants/routes";
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
      gameEntered: false
    };
  }

  handleEnterClassroomPin() {
    axios
      .get(
        "https://us-central1-horse-race-232509.cloudfunctions.net/getGameById",
        { params: { pin: this.state.value } }
      )
      .then(response => {
        this.setState({
          game: response.data,
          pinEntered: true,
          buttonValue: "Bli med!"
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handleEnterStudentName() {
    this.setState({
      gameEntered: true
    });
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
          placeholder="Skriv inn PIN"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </Col>
    );
  };

  namesDropDown = () => {
    return (
      <Col md="auto">
        <Form.Control as="select" onChange={this.handleChange}>
          <option>Hva heter du?</option>
          {this.state.game.scoreboard.map((player, i) => (
            <option key={i} value={player.name}>
              {player.name}
            </option>
          ))}
        </Form.Control>
      </Col>
    );
  };

  render() {
    return this.state.game !== null && this.state.gameEntered === false ? (
      <Form className="student" onSubmit={this.handleSubmit}>
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
              variant="outline-light"
              type="submit"
            >
              {this.state.buttonValue}
            </Button>
          </Col>
        </Row>
      </Form>
    ) : (
      <Redirect
        to={{
          pathname:
            ROUTES.STUDENT + ROUTES.STUDENT_GAME + "/" + this.state.value,
          state: { game: this.state.game, player: this.state.value }
        }}
      />
    );
  }
}

export default withCookies(Student);
