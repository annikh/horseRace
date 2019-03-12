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
      buttonValue: "Enter"
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
          placeholder="Skriv inn PIN"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </Col>
    );
  };

  namesDropDown = () => {
    console.log(this.state.game);
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
