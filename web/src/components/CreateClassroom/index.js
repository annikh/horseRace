import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { Container, Button, Form, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import shortid from 'shortid';

class CreateClassroom extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        classrooms: this.props.classrooms,
        value: '',
      };

      this.createClassroomForm = this.createClassroomForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addClassroom = this.addClassroom.bind(this);
    }
    
    // componentDidMount() {
    //   return axios.get('https://us-central1-horse-race-232509.cloudfunctions.net/getClassrooms').then((response) => {

    //     const classrooms = Object.keys(response.data).map(key => ({
    //       ...response.data[key],
    //       id: key,
    //     }));
    //     console.log(classrooms);
    //     this.setState({
    //       classrooms: classrooms
    //     })
    //   })
    // }

    addClassroom(user_id) {
      const newClassroomPin = shortid.generate();
      while(!this.isValidPin(newClassroomPin)) {
        newClassroomPin = shortid.generate();
      }
      return axios.post('https://us-central1-horse-race-232509.cloudfunctions.net/addClassroom', { pin: newClassroomPin, names: this.state.value, user_id: user_id }).then((response) => {
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

    handleSubmit = uid => event => {
      event.preventDefault();
      this.addClassroom(uid);
      alert("Klasserom opprettet!");
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    createClassroomForm = (uid) => {
      const isInvalid = this.state.value === '';

      return (
        <Form onSubmit={this.handleSubmit(uid)}>
          <Row>
            <Col>
              <Form.Label><h2 >Opprett et klasserom</h2></Form.Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Skriv inn fornavn på elevene i klassen din, skilles med linjeskift:</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control as="textarea" rows="3" placeholder={"Navn1\nNavn2\nNavn3"} value={this.state.value} onChange={this.handleChange}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button disabled={isInvalid} className="btn-orange" type="submit" block>Opprett</Button>
            </Col>
          </Row>
        </Form>
      )
    }
    
    render() {
      return (
        <AuthUserContext.Consumer>
        {authUser => (
          this.createClassroomForm(authUser.uid)
        )}
        </AuthUserContext.Consumer>
      )
    }
}
const condition = authUser => !!authUser;

// const ClassroomList = ({ classrooms }) => (
//     <ListGroup  variant="flush">
//       {classrooms.map((classroom, i) => (
//         <ListGroup.Item key={i} style={{textAlign: "left"}} action variant="warning" pin={classroom.pin}>
//           <strong>Pin:</strong> {classroom.pin} 
//         </ListGroup.Item>
//       ))}
//     </ListGroup>
// );

export default withAuthorization(condition)(CreateClassroom);