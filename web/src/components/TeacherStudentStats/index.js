import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container, Row, Col } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import CreateClassroom from "../CreateClassroom";

class TeacherStudentStats extends Component {
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
          <Col className="insideBox" />
        </Row>
      </Container>
    );
  }
}
TeacherClassrooms.contextType = AuthUserContext;

const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(TeacherStudentStats));
