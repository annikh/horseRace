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
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import "./style.css";

class TeacherGame extends Component {
  constructor(props) {
    super(props);
    this.playerList = this.playerList.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = {
      game: null,
      game_pin: "",
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

  startGame() {
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
      case "0":
        return "#8DDA77";
      case "1":
        return "#F0EE8D";
      case "2":
        return "#E37171";
      case "3":
        return "#77ABDA";
      case "4":
        return "#8D6A9F";
      default:
        return "#FFFFFF";
    }
  };

  playerList() {
    const { game } = this.state;
    const teams = game.teams;
    let fullList = [];
    let teamList = [];
    Object.keys(teams).forEach((team, key) => {
      Object.keys(teams[team].players).forEach((player, i) => {
        teamList.push(
          <Col key={i}>
            <Card
              className="player"
              style={{
                backgroundColor: this.setBackgroundColor(team)
              }}
            >
              <Card.Body>
                <Card.Title>{player}</Card.Title>
                {game.isActive || game.isFinished ? (
                  <Card.Text tag="div">
                    <strong>Oppgaver</strong>
                    {this.taskList(team, player)}
                  </Card.Text>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        );
      });

      fullList.push(
        <Row className="rowAccount" key={key}>
          {teamList}
        </Row>
      );
      teamList = [];
    });

    return <Container>{fullList}</Container>;
  }

  taskList(team, player) {
    const playerTasks = this.state.game.teams[team].players[player].tasks;
    console.log(player, " tasks ", playerTasks);
    return (
      <span>
        {playerTasks ? (
          <ListGroup variant="dark" style={{ width: "100%" }}>
            {playerTasks.length > 0 &&
              playerTasks.map((task, i) => (
                <ListGroup.Item
                  key={i}
                  style={{ textAlign: "left" }}
                  action
                  variant="dark"
                  onClick={() => this.handleShow(task)}
                >
                  <Container>
                    <Row>
                      <Col>Oppgavetittel</Col>
                      <Col>Lett</Col>
                      <Col>
                        {new Intl.DateTimeFormat("en-GB", {
                          minute: "2-digit",
                          second: "2-digit"
                        }).format(task.endTime - task.startTime)}
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              ))}
          </ListGroup>
        ) : (
          <span>Fant ingen oppgaver..</span>
        )}
      </span>
    );
  }

  render() {
    const { game, game_pin, task, show_task } = this.state;
    console.log(task);
    return (
      game && (
        <Container className="accountBody">
          <Row className="rowAccount">
            <h5>
              <strong>Spill-PIN: </strong> {game_pin}
            </h5>
          </Row>
          {game.isFinished && (
            <Row className="rowAccount">
              <span>
                Dette spillet ble ferdig{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit"
                }).format(game.date)}
              </span>
            </Row>
          )}
          {this.playerList()}
          {!game.isFinished && (
            <Row className="rowAccount">
              <Button className="btn-orange" onClick={this.startGame}>
                Start spillet!
              </Button>
            </Row>
          )}
          {task && (
            <Modal show={show_task} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Oppgavetittel</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <strong>Vanskelighetsgrad:</strong> Lett
                <br />
                <strong>Tid brukt:</strong>{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  minute: "2-digit",
                  second: "2-digit"
                }).format(task.endTime - task.startTime)}
                <br />
                <br />
                <strong>Løsningskode:</strong> <br />
                <span className="display-linebreak">{task.studentCode}</span>
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
