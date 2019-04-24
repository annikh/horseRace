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
import "./style.css";

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

  getStudents(classroom, i) {
    const { classrooms } = this.state;
    var students = [];
    classrooms[classroom].names.map((name, i) => {
      students.push(
        <Card className="studentCard">
          <Link
            key={i}
            to={ROUTES.TEACHER_STUDENTS + "/" + name}
            className="studentCardLink"
          >
            <Card.Title>{name}</Card.Title>
          </Link>
        </Card>
      );
    });
    return (
      <Row key={i} style={{ margin: "10px" }}>
        <Col>
          <Row>
            <h5>{classroom}</h5>
          </Row>
          <Row>{students}</Row>
        </Col>
      </Row>
    );
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
            <Row>
              {classroomsExists &&
                Object.keys(classrooms).map((classroom, i) =>
                  this.getStudents(classroom, i)
                )}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
TeacherStudents.contextType = AuthUserContext;

const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(TeacherStudents));
