import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Row, Col, ListGroup, Modal, Button } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import CreateClassroom from "../CreateClassroom";

class TeacherClassrooms extends Component {
  constructor(props) {
    super(props);
    this.showClassroom = this.showClassroom.bind(this);
    this.closeClassroom = this.closeClassroom.bind(this);
    this.classroomList = this.classroomList.bind(this);
    this.deleteClassroom = this.deleteClassroom.bind(this);
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
      if (snapshot.val() != null)
        this.setState({ loading: false, classrooms: snapshot.val() });
    });
  }

  componentWillUnmount() {
    const user_id = this.context.uid;
    this.props.firebase.classroomsByTeacher(user_id).off();
  }

  showClassroom(event) {
    this.setState({
      showClassroom: true,
      selectedClassroom: event.target.value
    });
  }

  closeClassroom() {
    this.setState({
      showClassroom: false,
      selectedClassroom: ""
    });
  }

  deleteClassroom() {
    this.props.firebase.deleteClassroomByTeacher(
      this.context.uid,
      this.state.selectedClassroom
    );
    this.setState({ selectedClassroom: "", showClassroom: false });
  }

  nameList = classroom => {
    return (
      <ListGroup variant="flush" style={{ width: "80%" }}>
        {classroom.names.map((name, i) => (
          <ListGroup.Item key={i} style={{ textAlign: "left" }} variant="light">
            {name}
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
            action
            variant="warning"
            onClick={this.showClassroom}
            value={name}
          >
            {name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  render() {
    const { classrooms, showClassroom, selectedClassroom } = this.state;
    const classroomsExists = Object.keys(classrooms).length > 0;
    return (
      <Container className="accountBody">
        <Row className="rowAccount">
          <Col className="insideBox">
            <Row className="rowAccount">
              <h2 style={{ textAlign: "left" }}>Dine klasserom:</h2>
            </Row>
            <Row className="rowAccount">
              {classroomsExists ? (
                this.classroomList(classrooms)
              ) : (
                <NoClassrooms />
              )}
            </Row>
          </Col>
          {classroomsExists && selectedClassroom.length > 0 && (
            <Modal show={showClassroom} onHide={this.closeClassroom}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedClassroom}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.nameList(classrooms[selectedClassroom])}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.closeClassroom}>
                  Close
                </Button>
                <Button variant="danger" onClick={this.deleteClassroom}>
                  Slett klasserom
                </Button>
              </Modal.Footer>
            </Modal>
          )}
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
