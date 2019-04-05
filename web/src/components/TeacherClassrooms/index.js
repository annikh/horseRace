import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import CreateClassroom from "../CreateClassroom";
import * as ROUTES from "../../constants/routes";

class TeacherClassrooms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classroomName: "",
      classrooms: []
    };
  }

  componentDidMount() {
    const user_id = this.context.uid;

    this.props.firebase.classroomsByTeacher(user_id).on("value", snapshot => {
      this.setState({ loading: false, classrooms: snapshot.val() });
    });
  }

  render() {
    const { classrooms } = this.state;
    return (
      <Container className="accountBody">
        <Row className="rowAccount">
          <Col className="insideBox">
            <Row className="rowAccount">
              <h2 style={{ textAlign: "left" }}>Dine klasserom:</h2>
            </Row>
            <Row className="rowAccount">
              {Object.keys(classrooms).length > 0 ? (
                <ClassroomList classrooms={classrooms} />
              ) : (
                <NoClassrooms />
              )}
            </Row>
          </Col>
          <Col className="insideBox">
            <Row className="rowAccount">
              <CreateClassroom />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
TeacherClassrooms.contextType = AuthUserContext;

const condition = authUser => !!authUser;

const NoClassrooms = () => (
  <p style={{ textAlign: "left" }}>Du har ingen klasserom ennå</p>
);

const ClassroomList = ({ classrooms }) => (
  <ListGroup variant="flush" style={{ width: "80%" }}>
    {Object.keys(classrooms).map((name, i) => (
      <ListGroup.Item style={{ textAlign: "left" }} action variant="warning">
        <Row>
          <Col>{name}</Col>
        </Row>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default withFirebase(withAuthorization(condition)(TeacherClassrooms));
