import React, { Component } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { fetchGameById, setPlayerToActive } from "../../actions";
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
      loading: false,
      game: null,
      game_id: "",
      buttonValue: "Enter"
    };
  }

  handleEnterClassroomPin() {
    this.setState({ loading: true, game_id: this.state.value });
    console.log("listen to game changes");
    this.props.firebase.game(this.state.game_id).on("value", snapshot => {
      this.setState({ loading: false, game: snapshot.val() });
    });
  }

  handleEnterStudentName() {
    const name = this.state.value;
    const { cookies } = this.props;
    cookies.set("name", name);
    console.log("Set", name, "to active");
    this.props.firebase
      .game(this.state.game_id)
      .child("scoreboard")
      .child(name)
      .child("isActive")
      .set(true);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.state.game === null
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
    const scoreboard = this.state.game.scoreboard;
    return (
      <Col md="auto">
        <Form.Control as="select" onChange={this.handleChange}>
          <option>Hva heter du?</option>
          {Object.keys(scoreboard).map(
            (player, i) =>
              scoreboard[player]["isActive"] !== true && (
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
    const { game, loading, game_id } = this.state;
    const { cookies } = this.props;
    const cookie = cookies.getAll();
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
          {game ? this.namesDropDown() : this.pinInput()}
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
          pathname: ROUTES.STUDENT + game_id + "/" + cookies.get("name")
        }}
      />
    );
  }
}
/*
const mapStateToProps = (state, ownProps) => {
  return {
    currentGame: state.currentGame,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGameById: game_pin => dispatch(fetchGameById(game_pin)),
    setPlayerToActive: player => dispatch(setPlayerToActive(player))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Student);*/

export default withFirebase(Student);
