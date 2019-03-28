import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Modal
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import ReactHtmlParser from "react-html-parser";
import { AuthUserContext, withAuthorization } from "../Session";
import "./style.css";

class TeacherGame extends Component {
  constructor(props) {
    super(props);
    this.playerList = this.playerList.bind(this);
    this.startStopGame = this.startStopGame.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = {
      game: null,
      game_pin: "",
      isStarted: false,
      button_value: "Start Spill",
      show_task: false,
      task: null
    };
  }

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    this.props.firebase.game(params.game_pin).on("value", snapshot => {
      this.setState({ game: snapshot.val(), game_pin: params.game_pin });
    });
  }

  startStopGame() {
    this.state.isStarted
      ? this.setState({ button_value: "Start Spill" }) &&
        this.props.firebase
          .game(this.state.game_pin)
          .child("isActive")
          .set(false)
      : this.setState({ button_value: "Avslutt Spill" }) &&
        this.props.firebase
          .game(this.state.game_pin)
          .child("isActive")
          .set(true);
  }

  handleClose() {
    this.setState({ show_task: false });
  }

  handleShow(task) {
    this.setState({ task: task, show_task: true });
  }

  playerList() {
    const { scoreboard } = this.state.game;
    return (
      <Container>
        <Row>
          {Object.keys(scoreboard).map(
            (player, i) =>
              scoreboard[player].isActive === true && (
                <Col key={i}>
                  <Card className="player">
                    <Card.Body>
                      <Card.Title>{player}</Card.Title>
                      <Card.Text>
                        <strong>Poeng:</strong> {scoreboard[player].points}
                        <br />
                        <strong>Oppgaver:</strong>
                        <br />
                        {scoreboard[player].tasks ? (
                          this.taskList(player)
                        ) : (
                          <div>Fant ingen oppgaver..</div>
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )
          )}
        </Row>
      </Container>
    );
  }

  taskList(player) {
    const playerTasks = this.state.game.scoreboard[player].tasks;
    return (
      <ListGroup variant="flush" style={{ width: "100%" }}>
        {playerTasks.length > 0 &&
          playerTasks.map((task, i) => (
            <ListGroup.Item
              key={i}
              style={{ textAlign: "left" }}
              action
              variant="warning"
              onClick={() => this.handleShow(task)}
            >
              {task.title}
            </ListGroup.Item>
          ))}
      </ListGroup>
    );
  }

  render() {
    const { game_pin, button_value, task } = this.state;

    return (
      this.state.game && (
        <Container className="accountBody">
          <Row>
            <strong>Spill-PIN: </strong> {game_pin}
          </Row>
          {this.playerList()}
          <Row>
            <Button className="btn-orange" onClick={this.startStopGame}>
              {button_value}
            </Button>
          </Row>
          {this.state.task && (
            <Modal show={this.state.show_task} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{task.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <strong>Difficulty:</strong>
                {task.difficulty} <br />
                {ReactHtmlParser(task.text)}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Lukk
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Container>
      )
    );
  }
}

TeacherGame.contextType = AuthUserContext;
const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(TeacherGame));
