import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import CreateGame from "../CreateGame";
import * as ROUTES from "../../constants/routes";
import "./style.css";

class TeacherGames extends Component {
  constructor(props) {
    super(props);
    this.setGameStateColor = this.setGameStateColor.bind(this);
    this.setGameState = this.setGameState.bind(this);

    this.state = {
      loading: false,
      classroomName: "",
      classrooms: [],
      games: {}
    };
  }

  componentDidMount() {
    const user_id = this.context.uid;
    this.setState({ loading: true });
    this.props.firebase.games().on("value", snapshot => {
      const allGames = snapshot.val();
      let games = {};
      Object.keys(allGames).forEach(pin => {
        if (allGames[pin].user_id === user_id) {
          games[pin] = allGames[pin];
          this.setState({ games: games });
        }
      });
    });
    this.props.firebase.classroomsByTeacher(user_id).on("value", snapshot => {
      if (snapshot.val() != null)
        this.setState({ loading: false, classrooms: snapshot.val() });
    });
  }

  componentWillUnmount() {
    const user_id = this.context.uid;
    this.props.firebase.games().off();
    this.props.firebase.classroomsByTeacher(user_id).off();
  }

  setGameStateColor = status => {
    switch (status) {
      case "inProgress":
        return "#B3E5EF"; // blue
      case "isFinished":
        return "#84E09B"; //green
      default:
        return "#FFF1C6"; //isReady = yellow
    }
  };

  setGameState = game => {
    if (game.isFinished) {
      return this.setGameStateColor("isFinished");
    } else if (game.isActive) {
      return this.setGameStateColor("inProgress");
    } else {
      return this.setGameStateColor("isReady");
    }
  };

  render() {
    const { games, classrooms } = this.state;
    return (
      <Container className="accountBody">
        <Row className="rowAccount">
          <Col className="insideBox">
            <Row className="rowAccount">
              <h2>Dine spill:</h2>
            </Row>
            <Row className="rowAccount">
              <Col>
                <svg height="51" width="51">
                  <circle cx="25" cy="25" r="10" fill="#FFF1C6" />
                </svg>{" "}
                Klart spill
              </Col>
              <Col>
                <svg height="51" width="51">
                  <circle cx="25" cy="25" r="10" fill="#B3E5EF" />
                </svg>{" "}
                Spill pågår
              </Col>
              <Col>
                <svg height="51" width="51">
                  <circle cx="25" cy="25" r="10" fill="#84E09B" />
                </svg>
                Ferdig spill
              </Col>
            </Row>
            <Row className="rowAccount">
              {Object.keys(games).length > 0 ? (
                <GameList games={games} setGameState={this.setGameState} />
              ) : (
                <NoGames />
              )}
            </Row>
          </Col>
          <Col className="insideBox">
            <Row className="rowAccount">
              {Object.keys(this.state.classrooms).length > 0 ? (
                <CreateGame classrooms={classrooms} />
              ) : (
                <div>
                  Du må opprette et klasserom før du kan opprette et spill
                </div>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
TeacherGames.contextType = AuthUserContext;

const condition = authUser => !!authUser;

const NoGames = () => (
  <p style={{ textAlign: "left" }}>Du har ingen spill ennå</p>
);

const GameList = ({ games, setGameState }) => (
  <ListGroup style={{ width: "80%" }}>
    {Object.keys(games).map((pin, i) => (
      <Link
        key={i}
        to={ROUTES.TEACHER_GAMES + "/" + pin}
        className="active-link"
      >
        <ListGroup.Item
          action
          style={{ backgroundColor: setGameState(games[pin]) }}
        >
          <Row className="left">
            <Col className="bold">PIN:</Col>
            <Col>{pin}</Col>
          </Row>
          <Row className="left">
            <Col className="bold">Klasserom:</Col>
            <Col>{games[pin].classroom_id}</Col>
          </Row>
          <Row className="left">
            <Col className="bold">Dato opprettet:</Col>
            <Col>
              {new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              }).format(games[pin].date)}
            </Col>
          </Row>
        </ListGroup.Item>
      </Link>
    ))}
  </ListGroup>
);

export default withFirebase(withAuthorization(condition)(TeacherGames));
