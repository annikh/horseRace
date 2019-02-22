import React, { Component } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../App/App.css';

class Student extends Component {

  constructor() {
    super();
    this.state = {
      value: '',
      pinEntered: false,
      buttonValue: 'Ok!',
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

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Bli med klassen din og spill!</h1>
        </div>
        <Form className="App-button" onSubmit={this.handleSubmit}>
          <Form.Row>
          <Col md="auto">
          <Form.Control placeholder={this.state.placeholder} value={this.state.value} onChange={this.handleChange}/>
          </Col>
          <Col>
            <Button variant="outline-light" type="submit">{this.state.buttonValue}</Button>
          </Col>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

export default Student;
