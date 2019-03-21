import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { Button, Form, Row, Col } from "react-bootstrap";
import Classroom from "../../objects/Classroom";
import { addClassroom } from "../../actions";
import { connect } from "react-redux";

class CreateClassroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      classname_value: "",
      names_value: ""
    };

    this.createClassroomForm = this.createClassroomForm.bind(this);
    this.handleClassNameChange = this.handleClassNameChange.bind(this);
    this.handleNamesChange = this.handleNamesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addClassroom = this.addClassroom.bind(this);
  }

  addClassroom(user_id) {
    let names = [];
    this.state.names_value.split(/\n/).map(name => names.push(name));
    const classroom = new Classroom(
      null,
      this.state.classname_value,
      null,
      names,
      user_id
    );
    this.props.addClassroom(classroom);
  }
  handleSubmit = uid => event => {
    event.preventDefault();
    this.addClassroom(uid);
    alert("Klasserom opprettet!");
  };

  handleClassNameChange(event) {
    this.setState({ classname_value: event.target.value });
  }

  handleNamesChange(event) {
    this.setState({ names_value: event.target.value });
  }

  createClassroomForm = uid => {
    const isInvalid = this.state.value === "";

    return (
      <Form onSubmit={this.handleSubmit(uid)}>
        <Row>
          <Col>
            <Form.Label>
              <h2>Opprett et klasserom</h2>
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>
              Skriv inn fornavn på elevene i klassen din, skilles med
              linjeskift:
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Control
              placeholder={"Skriv inn navn på klassen"}
              value={this.state.classname_value}
              onChange={this.handleClassNameChange}
            />
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder={"Navn1\nNavn2\nNavn3"}
              value={this.state.names_value}
              onChange={this.handleNamesChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              disabled={isInvalid}
              className="btn-orange"
              type="submit"
              block
            >
              Opprett
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => this.createClassroomForm(authUser.uid)}
      </AuthUserContext.Consumer>
    );
  }
}
const condition = authUser => !!authUser;

const mapDispatchToProps = dispatch => {
  return {
    addClassroom: classroom => dispatch(addClassroom(classroom))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withAuthorization(condition)(CreateClassroom));
