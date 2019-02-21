import React, { Component } from 'react';
import './Teacher.css';
import { Container, Form } from 'react-bootstrap';


class Teacher extends Component {
 

  render() {
    if (this.props.authState === "signedIn") {
      return (
        <Container className="TeacherBody">
            <Form>
              <Form.Label className="Header">Opprett nytt klasserom</Form.Label>
              <Form.Group>
                <Form.Control placeholder="Navn på klasserom"/>
              </Form.Group>
              <Form.Group>
                <Form.Control placeholder="Noe annet"/>
              </Form.Group>
            </Form>
        </Container>
      );
    } else {
      return null;
    }
  }
}

export default Teacher;