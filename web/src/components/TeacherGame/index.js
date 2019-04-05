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
      ? this.setState({ isStarted: false, button_value: "Start Spill" }) &&
        this.props.firebase
          .game(this.state.game_pin)
          .child("isActive")
          .set(false)
      : this.setState({ isStarted: true, button_value: "Avslutt Spill" }) &&
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

  setBackgroundColor = team => {
    switch (team) {
      case 0:
        return "#8DDA77";
      case 1:
        return "#F0EE8D";
      case 2:
        return "#E37171";
      case 3:
        return "#77ABDA";
      case 4:
        return "#8D6A9F";
      default:
        return "#DB7F67";
    }
  };

  playerList() {
    const { scoreboard } = this.state.game;
    let assignedPlayers = 0;
    let team = 1;
    let teamList = [];
    let fullList = [];
    while (assignedPlayers < Object.keys(scoreboard).length) {
      Object.keys(scoreboard).map((player, i) => {
        if (
          scoreboard[player].isActive === true &&
          scoreboard[player].team === team
        ) {
          console.log(scoreboard[player].team);
          teamList.push(
            <Col key={i}>
              <Card
                className="player"
                style={{
                  backgroundColor: this.setBackgroundColor(
                    scoreboard[player].team
                  )
                }}
              >
                <Card.Body>
                  <Card.Title>{player}</Card.Title>
                  {this.state.isStarted ? (
                    <Card.Text>
                      <strong>Oppgaver:</strong>
                      {this.taskList(player)}
                    </Card.Text>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          );
          assignedPlayers += 1;
        }
      });
      team++;
      fullList.push(<Row className="rowAccount">{teamList}</Row>);
      teamList = [];
    }
    return <Container>{fullList}</Container>;
  }

  taskList(player) {
    const playerTasks = this.state.game.scoreboard[player].tasks;
    return (
      <div>
        {playerTasks ? (
          <ListGroup variant="dark" style={{ width: "100%" }}>
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
        ) : (
          <div>Fant ingen oppgaver..</div>
        )}
      </div>
    );
  }

  render() {
    const { game_pin, button_value, task } = this.state;

    return (
      this.state.game && (
        <Container className="accountBody">
          <Row className="rowAccount">
            <h5>
              <strong>Spill-PIN: </strong> {game_pin}
            </h5>
          </Row>

          {this.playerList()}

          <Row className="rowAccount">
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
                <strong>Vanskelighetsgrad:</strong>
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
