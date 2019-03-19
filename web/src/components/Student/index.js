import React, { Component } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as ROUTES from "../../constants/routes";
import { fetchGameById } from "../../actions";
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
      buttonValue: "Enter"
    };
  }

  handleEnterClassroomPin() {
    this.props.fetchGameById(this.state.value);
    this.setState({
      buttonValue: "Bli med!"
    });
  }

  handleEnterStudentName() {
    const { cookies } = this.props;
    cookies.set("name", this.state.value);
    this.forceUpdate();
  }

  handleChange(event) {
    console.log("handleChange");
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.currentGame === null
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
    return (
      <Col md="auto">
        <Form.Control as="select" onChange={this.handleChange}>
          <option>Hva heter du?</option>
          {this.props.currentGame !== null &&
            this.props.currentGame.scoreboard.map((player, i) => (
              <option key={i} value={player.name}>
                {player.name}
              </option>
            ))}
        </Form.Control>
      </Col>
    );
  };

  render() {
    const { cookies } = this.props;
    const cookie = cookies.getAll();
    console.log("cookie", cookie);
    console.log("currentgame:", this.props.currentGame);
    return Object.entries(cookie).length === 0 ? (
      <Form className="student" onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <Form.Label>
              <h2>Bli med klassen din og spill!</h2>
            </Form.Label>
          </Col>
        </Row>
        <Row>
          {this.props.currentGame === null
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
            ROUTES.STUDENT + ROUTES.STUDENT_GAME + "/" + cookies.get("name")
        }}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentGame: state.currentGame,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGameById: game_pin => dispatch(fetchGameById(game_pin))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Student);
