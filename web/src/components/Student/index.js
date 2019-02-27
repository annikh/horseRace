import React, { Component } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import './style.css';

class Student extends Component {

  constructor() {
    super();
    this.state = {
      value: '',
      pinEntered: false,
      buttonValue: 'Enter',
      placeholder: 'Skriv inn PIN'
    }
    this.handleEnterClassroomPin = this.handleEnterClassroomPin.bind(this);
    this.handleEnterStudentName = this.handleEnterStudentName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleEnterClassroomPin() {
    const pin = this.state.value;
    this.setState({
      pinEntered: true,
      buttonValue: 'Bli med!',
      placeholder:'Skriv inn navnet ditt',
      value: ''
    })
  }

  handleEnterStudentName() {
    const name = this.state.value;
    alert('Gratulerer ' + name + ', du er inne!');
    //Redirect to classroom
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.state.pinEntered ? this.handleEnterStudentName() : this.handleEnterClassroomPin();
    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const isInvalid = this.state.value === '';

    return (
        <Form className="Student" onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <Form.Label><h2>Bli med klassen din og spill!</h2></Form.Label>
            </Col>
          </Row>
          <Row>
            <Col md="auto">
              <Form.Control placeholder={this.state.placeholder} value={this.state.value} onChange={this.handleChange}/>
            </Col>
            <Col>
              <Button className="btn-classPin" disabled={isInvalid} variant="outline-light" type="submit">{this.state.buttonValue}</Button>
            </Col>
          </Row>
        </Form>
    )
  }
}

export default Student;
