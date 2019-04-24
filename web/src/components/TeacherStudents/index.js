import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
  Button,
  Card
} from "react-bootstrap";
import { withFirebase } from "../Firebase";
import CreateClassroom from "../CreateClassroom";
import * as ROUTES from "../../constants/routes";

class TeacherStudents extends Component {
  constructor(props) {
    super(props);
    this.getStudents = this.getStudents.bind(this);

    this.state = {
      classrooms: [],
      students: {}
    };
  }

  componentDidMount() {
    const user_id = this.context.uid;
    this.props.firebase.classroomsByTeacher(user_id).on("value", snapshot => {
      this.setState({ classrooms: snapshot.val() });
    });
  }

  getStudents() {
    var students = [];
    var i = 0;
    const classrooms = this.state.classrooms;
    Object.keys(classrooms).map(classroom => {
      classrooms[classroom].names.map(name => {
        students.push(
          <Link
            key={i}
            to={ROUTES.TEACHER_STUDENTS + "/" + name}
            style={{ textDecoration: "none" }}
          >
            <Card
              key={i++}
              style={{
                backgroundColor: "#ffeeba"
              }}
            >
              <Card.Title>{name}</Card.Title>
            </Card>
          </Link>
        );
      });
    });
    return students;
  }

  render() {
    const { classrooms } = this.state;
    const classroomsExists = Object.keys(classrooms).length > 0;
    return (
      <Container className="accountBody">
        <Row>
          <Col>
            <Row>
              <h2>Dine elever:</h2>
            </Row>
            <Row>{classroomsExists && this.getStudents()}</Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
TeacherStudents.contextType = AuthUserContext;

const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(TeacherStudents));
