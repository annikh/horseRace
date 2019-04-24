import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import { Container, Row, Col, Card } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import CreateClassroom from "../CreateClassroom";
import "./style.css";

class TeacherStudent extends Component {
  constructor(props) {
    super(props);
    this.getTasks = this.getTasks.bind(this);
    this.getTaskCard = this.getTaskCard.bind(this);

    this.state = {
      student: "",
      games: {},
      selectedTask: {},
      taskOpened: false
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
      this.setState({ games: games, student: params.student });
    });
  }

  getTasks() {
    const { games } = this.state;
    var taskList = [];
    Object.keys(games).map(game => {
      Object.values(games[game].teams).map(team => {
        Object.keys(team.players).map(student => {
          if (student === this.state.student) {
            const tasks = team.players[student].tasks;
            if (tasks !== undefined) {
              tasks.map((task, i) => taskList.push(this.getTaskCard(task, i)));
            }
          }
        });
      });
    });
    return taskList.length > 0 ? (
      taskList
    ) : (
      <div>Finner ingen oppgaver løst av {this.state.student}</div>
    );
  }

  getTaskCard(task, i) {
    console.log(task);
    return (
      <Card key={i} className="taskCard">
        <Card.Header>"Oppgavetittel"</Card.Header>
        <Card.Body className="taskCard-body">
          <Card.Title style={{ fontSize: "14px" }}>
            <span className="blockLeft">
              <strong>Vanskelighetsgrad:</strong>2
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
              {new Intl.DateTimeFormat("default", {
                minute: "numeric",
                second: "numeric"
              }).format(task.endTime - task.startTime)}
            </span>
          </Card.Title>
          <Card.Text>
            <strong className="blockLeft">Løsning:</strong>
            <span className="display-linebreak">{task.studentCode}</span>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  render() {
    const { student, games } = this.state;
    console.log("student", student);
    console.log("games", games);
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
