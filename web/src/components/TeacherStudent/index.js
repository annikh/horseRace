import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Row, Card } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

class TeacherStudent extends Component {
  constructor(props) {
    super(props);
    this.getTasks = this.getTasks.bind(this);
    this.getTaskCard = this.getTaskCard.bind(this);
    this.timeStamp = this.timeStamp.bind(this);

    this.state = {
      student: "",
      games: {},
      team: ""
    };
  }

  componentDidMount() {
    const user_id = this.context.uid;
    const {
      match: { params }
    } = this.props;
    this.props.firebase.games().on("value", snapshot => {
      const allGames = snapshot.val();
      let games = {};
      Object.keys(allGames).forEach(pin => {
        if (
          allGames[pin].user_id === user_id &&
          allGames[pin].isFinished === true
        ) {
          games[pin] = allGames[pin];
        }
      });
      this.setState({
        games: games,
        student: params.student
      });
    });
  }

  getTasks() {
    const { games } = this.state;
    var taskList = [];
    Object.keys(games).forEach(game => {
      let teams = games[game].teams;
      teams.forEach((team, teamId) => {
        let players = team.players;
        Object.keys(players).forEach(student => {
          if (student === this.state.student) {
            let tasks = players[student].tasks;
            if (tasks !== undefined) {
              Object.keys(tasks).forEach((task, i) =>
                taskList.push(
                  this.getTaskCard(
                    { id: task, task: tasks[task] },
                    teamId,
                    games[game],
                    i
                  )
                )
              );
            }
          }
        });
      });
    });
    return Object.keys(taskList).length > 0 ? (
      taskList
    ) : (
      <div>Finner ingen oppgaver løst av {this.state.student}</div>
    );
  }

  getTaskCard(taskObject, team, game, i) {
    const tasks = game.teams[team].tasks;
    const taskId = taskObject.id;
    const task = taskObject.task;
    return (
      <Card key={i} className="taskCard">
        <Card.Header>{tasks[taskId].title}</Card.Header>
        <Card.Body className="taskCard-body">
          <Card.Title style={{ fontSize: "14px" }}>
            <span className="blockLeft">
              <strong>Vanskelighetsgrad:</strong>
              {tasks[taskId].difficulty}
            </span>
            <span className="blockLeft">
              <strong> Dato: </strong>
              {new Intl.DateTimeFormat("default", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              }).format(task.startTime)}{" "}
            </span>
            <span className="blockLeft">
              <strong>Tid:</strong>
              {this.timeStamp(task.startTime, task.endTime)}
            </span>
          </Card.Title>
          <Card.Text>
            <strong className="blockLeft">Oppgave:</strong>
            <span className="display-linebreak">{tasks[taskId].text}</span>
            <br />
            <strong className="blockLeft">Løsning:</strong>
            <span className="display-linebreak">{task.studentCode}</span>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  timeStamp = (startTime, endTime) => {
    return endTime ? (
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
        {new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(startTime)}
      </span>
    );
  };

  render() {
    const { student, games } = this.state;
    return (
      <Container className="accountBody">
        <Row className="rowAccount">
          <h2>Elev: {student}</h2>
        </Row>
        <Row className="rowAccount">
          {Object.keys(games).length > 0 && this.getTasks()}
        </Row>
      </Container>
    );
  }
}
TeacherStudent.contextType = AuthUserContext;

const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(TeacherStudent));
