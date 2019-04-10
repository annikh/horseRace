import React, { Component } from "react";
import {
  Button,
  Modal, 
  Form
} from "react-bootstrap";

class GuessFigure extends Component {
  constructor(props) {
    super(props);

    this.closeGuessModal = this.closeGuessModal.bind(this);
    this.showGuessModal = this.showGuessModal.bind(this);
    this.handleGuessSubmit = this.handleGuessSubmit.bind(this);
    this.handleGuessInput = this.handleGuessInput.bind(this);

    this.state = {
      figure: "kanelbolle",
      showGuessModal: false,
      studentGuess: ''
    }
  }

  handleGuessInput(event) {
    const guess = event.target.value;
    this.setState({studentGuess: guess});
  }

  handleGuessSubmit(event) {
    event.preventDefault();
    console.log(this.state.studentGuess === this.state.figure);
  }

  showGuessModal() {
    this.setState({showGuessModal: true})
  }
  
  closeGuessModal() {
    this.setState({showGuessModal: false})
  }

  GuessModal = () => (
    <Modal show={this.state.showGuessModal} onHide={this.closeGuessModal}>
      <Modal.Header closeButton>
        <Modal.Title>
            {this.state.GuessModalHeaderText}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label>
            Hva tror du det er på bildet?
          </Form.Label>
          <Form.Control as="input" onChange={this.handleGuessInput} />
          <Button onClick={this.handleGuessSubmit}>Gjett</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )

  GuessButton = () => (
    <Button variant="primary" onClick={this.showGuessModal}>Gjett hva som er på bildet</Button>
  )

  render() {
    return (
      <div>
        <this.GuessModal />
        <this.GuessButton />
      </div>
    )
  }
}

export default GuessFigure;