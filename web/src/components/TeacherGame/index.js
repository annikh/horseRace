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
import Moment from "react-moment";
import parse from "html-react-parser";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

class TeacherGame extends Component {
  constructor(props) {
    super(props);
    this.playerList = this.playerList.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.gameStatus = this.gameStatus.bind(this);
    this.timeStamp = this.timeStamp.bind(this);

    this.state = {
      game: null,
      game_pin: "",
      show_task: false,
      task: null,
      team: ""
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

  componentWillUnmount() {
    this.props.firebase.game(this.state.game_pin).off();
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

  handleShow(task, team) {
    this.setState({ task: task, show_task: true, team: team });
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

  setBackgroundClass = difficulty => {
    switch (difficulty) {
      case 1:
        return "easy taskList";
      case 2:
        return "medium taskList";
      case 3:
        return "hard taskList";
      default:
        return "taskList";
    }
  };

  playerList() {
    const { game } = this.state;
    const teams = game.teams;
    let fullList = [];
    let teamList = [];
    let noPlayers = true;
    let completedTasks = 0;
    Object.keys(teams).forEach((team, key) => {
      Object.keys(teams[team].tasks).forEach(task => {
        if (teams[team].tasks[task].solved !== undefined) {
          completedTasks += 1;
        }
      });
      Object.keys(teams[team].players).forEach((player, i) => {
        if (game.isActive) {
          teamList.push(
            <Col key={i}>
              <Card className="player">
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
        } else {
          if (teams[team].players[player].isActive) {
            teamList.push(
              <Col key={i}>
                <Card className="player">
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
          }
        }
      });
      if (teamList.length > 0) noPlayers = false;

      fullList.push(
        <>
          <Row
            className="teamHeader"
            style={{ backgroundColor: this.setBackgroundColor(team) }}
          >
            <Col>
              <span>
                <strong>
                  TEAM <span>{team}</span>
                </strong>
              </span>
            </Col>
            <Col>
              <span>
                Poeng:{" "}
                <span>
                  <strong>{teams[team].points}</strong>
                </span>
              </span>
            </Col>
            <Col>
              <span>
                <strong>{completedTasks}/16</strong>
              </span>
            </Col>
          </Row>
          <Row className="rowAccount" key={key}>
            {teamList}
          </Row>
        </>
      );
      teamList = [];
      completedTasks = 0;
    });

    if (noPlayers)
      return (
        <Row>
          <Col>Venter på spillere.. Start spillet når spillerne er klare.</Col>
        </Row>
      );
    return <Container>{fullList}</Container>;
  }

  taskList(team, player) {
    const playerTasks = this.state.game.teams[team].players[player].tasks;
    const tasks = this.state.game.teams[team].tasks;
    return (
      <span>
        {playerTasks !== undefined && Object.keys(playerTasks).length > 0 ? (
          <ListGroup variant="dark" style={{ width: "100%" }}>
            {Object.keys(playerTasks).map((task, i) => (
              <ListGroup.Item
                key={i}
                action
                className={this.setBackgroundClass(tasks[task].difficulty)}
                onClick={() =>
                  this.handleShow({ id: task, task: playerTasks[task] }, team)
                }
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 10px 5px 10px"
                  }}
                >
                  <span>{tasks[task].title}</span>
                  <span>
                    {this.timeStamp(
                      playerTasks[task].startTime,
                      playerTasks[task].endTime
                    )}
                  </span>
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <span>
            <br />
            Fant ingen oppgaver
          </span>
        )}
      </span>
    );
  }

  timeStamp = (startTime, endTime) => {
    return (
      <div style={{ padding: "2px" }}>
        {endTime ? (
          <span>
            <FontAwesomeIcon icon="check" color="black" />
            {new Intl.DateTimeFormat("en-GB", {
              minute: "2-digit",
              second: "2-digit"
            }).format(endTime - startTime)}
          </span>
        ) : (
          <span>
            <FontAwesomeIcon icon="clock" color="black" />{" "}
            <Moment interval={15000} date={startTime} durationFromNow />
          </span>
        )}
      </div>
    );
  };

  gameStatus = game => {
    if (game.isFinished)
      return (
        game.isFinished && (
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
        )
      );
    else if (game.isActive)
      return (
        game.isActive &&
        !game.isFinished && (
          <Row className="rowAccount">
            <span>
              <FontAwesomeIcon icon="clock" color="black" /> Dette spillet
              begynte{" "}
              {new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              }).format(game.date)}
            </span>
          </Row>
        )
      );
    else {
      return (
        <Col className="left">
          <Button className="startGame btn-orange" onClick={this.startGame}>
            Start spillet!
          </Button>
        </Col>
      );
    }
  };

  render() {
    const { game, game_pin, task, show_task } = this.state;
    return (
      game && (
        <Container className="accountBody">
          <Row className="gameTitle">
            <h5>
              <strong>Spill-PIN: </strong> {game_pin}
            </h5>
          </Row>
          <Row className="rowAccount">{this.gameStatus(game)}</Row>
          {this.playerList()}
          {task && (
            <Modal
              className="studentTask"
              show={show_task}
              onHide={this.handleClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {game.teams[this.state.team].tasks[task.id].title}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <strong>Vanskelighetsgrad:</strong>{" "}
                {game.teams[this.state.team].tasks[task.id].difficulty}
                <br />
                <strong>Tid brukt:</strong>{" "}
                {this.timeStamp(task.task.startTime, task.task.endTime)}
                <br />
                <strong>Oppgave:</strong> <br />
                {parse(game.teams[this.state.team].tasks[task.id].text)}
                <br />
                <strong>Løsningskode:</strong> <br />
                <span className="display-linebreak">
                  {task.task.studentCode}
                </span>
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
