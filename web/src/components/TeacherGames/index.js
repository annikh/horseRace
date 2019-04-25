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
      this.setState({ loading: false, classrooms: snapshot.val() });
    });
  }

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
              {Object.keys(games).length > 0 ? (
                <GameList games={games} />
              ) : (
                <NoGames />
              )}
            </Row>
          </Col>
          <Col className="insideBox">
            <Row className="rowAccount">
              {Object.keys(this.state.classrooms).length > 0 && (
                <CreateGame classrooms={classrooms} />
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

const GameList = ({ games }) => (
  <ListGroup style={{ width: "80%" }}>
    {Object.keys(games).map((pin, i) => (
      <Link
        key={i}
        to={ROUTES.TEACHER_GAMES + "/" + pin}
        style={{ textDecoration: "none" }}
      >
        <ListGroup.Item style={{ textAlign: "left" }} action variant="warning">
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
