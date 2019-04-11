import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Row, Col, ListGroup, Modal, Button } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import CreateClassroom from "../CreateClassroom";

class TeacherClassrooms extends Component {
  constructor(props) {
    super(props);
    this.showClassroom = this.showClassroom.bind(this);
    this.classroomList = this.classroomList.bind(this);
    this.deleteClassroom = this.deleteClassroom.bind(this);
    this.classroom = this.classroom.bind(this);
    this.nameList = this.nameList.bind(this);

    this.state = {
      classroomName: "",
      classrooms: [],
      showClassroom: false,
      selectedClassroom: ""
    };
  }

  componentDidMount() {
    const user_id = this.context.uid;

    this.props.firebase.classroomsByTeacher(user_id).on("value", snapshot => {
      this.setState({ loading: false, classrooms: snapshot.val() });
    });
  }

  showClassroom(event) {
    console.log(event);
    event.preventDefault();
    const classroom = event.target.value;
    const show = !this.state.showClassroom;
    this.setState({
      showClassroom: show,
      selectedClassroom: classroom
    });
  }

  deleteClassroom() {}

  classroom = classroom => {
    console.log(classroom);
    return (
      <Modal onHide={this.showClassroom}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.selectedClassroom}}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.nameList(classroom.names)}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={this.deleteClassroom}>
            Slett klasserom
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  nameList = names => {
    console.log(names);
    return (
      <ListGroup variant="flush" style={{ width: "80%" }}>
        {names.map((name, i) => (
          <ListGroup.Item
            key={i}
            style={{ textAlign: "left" }}
            action
            variant="warning"
          >
            <Row>
              <Col>{name}</Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  classroomList = classrooms => {
    return (
      <ListGroup variant="flush" style={{ width: "80%" }}>
        {Object.keys(classrooms).map((name, i) => (
          <ListGroup.Item
            key={i}
            style={{ textAlign: "left" }}
            action
            variant="warning"
            onClick={this.showClassroom}
            value={name}
          >
            <Row>
              <Col>{name}</Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

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
                this.classroomList(classrooms)
              ) : (
                <NoClassrooms />
              )}
            </Row>
          </Col>
          {this.state.showClassroom
            ? this.classroom(this.state.selectedClassroom)
            : null}
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

export default withFirebase(withAuthorization(condition)(TeacherClassrooms));
