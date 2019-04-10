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
      showWinModal: false,
      studentGuess: ''
    }
  }

  handleGuessInput(event) {
    const guess = event.target.value;
    this.setState({studentGuess: guess});
  }

  handleGuessSubmit(event) {
    event.preventDefault();
    if (this.state.studentGuess === this.state.figure) this.showWinModal();
  }

  showGuessModal() {
    this.setState({showGuessModal: true})
  }
  
  closeGuessModal() {
    this.setState({showGuessModal: false})
  }

  showWinModal() {
    this.setState({showWinModal: true})
  }

  GuessModal = () => (
    <Modal show={this.state.showGuessModal} onHide={this.closeGuessModal}>
      <Modal.Header closeButton>
        <Modal.Title>
            Hva tror du det er på bildet?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control as="input" onChange={this.handleGuessInput} />
          <Button onClick={this.handleGuessSubmit}>Gjett</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )

  WinModal = () => (
    <Modal show={this.state.showWinModal} >
      <Modal.Header >
        <Modal.Title>
          Gratulerer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Dere vant!
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
        <this.WinModal />
        <this.GuessButton />
      </div>
    )
  }
}

export default GuessFigure;