import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import Game from "../../objects/Game";
import { withFirebase } from "../Firebase";
import shortid from "shortid";
import CreateClassroom from "../CreateClassroom";
import CreateGame from "../CreateGame";

class TeacherHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      classroomName: "",
      classrooms: [],
      games: []
    };
  }

  componentDidMount() {
    const user_id = this.context.uid;
    this.setState({ loading: true });
    this.props.firebase.games().on("value", snapshot => {
      let games = [];
      snapshot.forEach(game => {
        if (game.val().user_id === user_id) {
          games.push(game.val());
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
          <Col>
            <Row className="rowAccount">
              <h2 style={{ textAlign: "left" }}>Dine spill:</h2>{" "}
            </Row>
            <Row className="rowAccount">
              {games.length > 0 ? <GameList games={games} /> : <NoGames />}
            </Row>
          </Col>
          <Col>
            <Row className="rowAccount">
              {Object.keys(this.state.classrooms).length > 0 && (
                <CreateGame classrooms={this.state.classrooms} />
              )}
            </Row>
            <Row className="rowAccount">
              <CreateClassroom />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
TeacherHome.contextType = AuthUserContext;

const condition = authUser => !!authUser;

const NoGames = () => (
  <p style={{ textAlign: "left" }}>Du har ingen spill ennå</p>
);

const GameList = ({ games }) => (
  <ListGroup variant="flush" style={{ width: "80%" }}>
    {games.map((game, i) => (
      <ListGroup.Item
        key={i}
        style={{ textAlign: "left" }}
        action
        variant="warning"
        pin={game.pin}
      >
        <Row>
          <Col>
            <strong>Klasse:</strong>
          </Col>
          <Col>{game.classroom_id}</Col>
        </Row>
        <Row>
          <Col>
            <strong>Dato: </strong>
          </Col>
          <Col>
            {new Intl.DateTimeFormat("en-GB", {
              year: "numeric",
              month: "long",
              day: "2-digit"
            }).format(game.date)}
          </Col>
        </Row>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default withFirebase(withAuthorization(condition)(TeacherHome));
