import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Row, Col } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import CreateClassroom from "../CreateClassroom";

class TeacherStudent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const user_id = this.context.uid;
  }

  render() {
    return (
      <Container className="accountBody">
        <Row className="rowAccount">
          <Col className="insideBox">Student View</Col>
        </Row>
      </Container>
    );
  }
}
TeacherStudent.contextType = AuthUserContext;

const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(TeacherStudent));
