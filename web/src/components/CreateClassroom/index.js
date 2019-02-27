import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import shortid from 'shortid';

class CreateClassroom extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        classrooms: [],
        value: '',
      };

      this.createClassroomForm = this.createClassroomForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addClassroom = this.addClassroom.bind(this);
    }
    
    componentDidMount() {
      return axios.get('https://us-central1-horse-race-232509.cloudfunctions.net/getClassrooms').then((response) => {

        const classrooms = Object.keys(response.data).map(key => ({
          ...response.data[key],
          id: key,
        }));
        console.log(classrooms);
        this.setState({
          classrooms: classrooms
        })
      })
    }

    addClassroom() {
      const newClassroomPin = shortid.generate();
      while(!this.isValidPin(newClassroomPin)) {
        newClassroomPin = shortid.generate();
      }
      return axios.post('https://us-central1-horse-race-232509.cloudfunctions.net/addClassroom', { pin: newClassroomPin, names: this.state.value }).then((response) => {
        const classrooms = Object.keys(response.data).map(key => ({
          ...response.data[key],
          id: key,
        }));
        console.log(classrooms);
        this.setState({
          classrooms: classrooms
        })
      })
    }

    isValidPin(pin) {
      for (var key in this.state.classrooms) {
        console.log(this.state.classrooms[key].pin)
        if (this.state.classrooms[key].pin === pin) {
          return false;
        }
      }
      return true;
    }

    handleSubmit(event) {
      event.preventDefault();
      this.addClassroom();
      alert("Klasserom opprettet!");
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    createClassroomForm = () => {
      const isInvalid = this.state.value === '';

      return (
        <Form onSubmit={this.handleSubmit}>
            <Form.Label><h2>Opprett et klasserom</h2></Form.Label>
            <Form.Label>Skriv inn fornavn på elevene i klassen din, skilles med linjeskift:</Form.Label>
            <Form.Control as="textarea" rows="3" placeholder={"Navn1\nNavn2\nNavn3"} value={this.state.value} onChange={this.handleChange}/>
            <Button disabled={isInvalid} className="btn-orange" type="submit">Opprett</Button>
        </Form>
      )
    }
    
    render() {
      const { classrooms, loading, value } = this.state;

      return (
        <Container className="accountBody">
          <Row>
            <Col>
              {this.createClassroomForm()}
            </Col>
            <Col>
              <p>Klasserom: </p>
              {loading && <div>Loading ...</div>}
              <ClassroomList classrooms={classrooms} />
            </Col>
          </Row>
        </Container>
      )
    }

}
const condition = authUser => !!authUser;

const ClassroomList = ({ classrooms }) => (
    <ul>
      {classrooms.map(classroom => (
        <li pin={classroom.pin}>
          <span>
            <strong>Pin:</strong> {classroom.pin}
          </span>
        </li>
      ))}
    </ul>
);

export default withAuthorization(condition)(CreateClassroom);