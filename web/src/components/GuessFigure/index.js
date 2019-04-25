import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { withFirebase } from "../Firebase";

class GuessFigure extends Component {
  constructor(props) {
    super(props);

    this.closeGuessModal = this.closeGuessModal.bind(this);
    this.showGuessModal = this.showGuessModal.bind(this);
    this.closeWrongGuessModal = this.closeWrongGuessModal.bind(this);
    this.handleGuessSubmit = this.handleGuessSubmit.bind(this);
    this.handleGuessInput = this.handleGuessInput.bind(this);

    this.state = {
      showGuessModal: false,
      showWinModal: false,
      showWrongGuessModal: false,
      studentGuess: "",
      solution: ""
    };
  }

  handleGuessInput(event) {
    const guess = event.target.value;
    this.setState({ studentGuess: guess });
  }

  handleGuessSubmit(event) {
    event.preventDefault();
    if (this.state.solution === "") {
      // validate against db value on first guess
      this.props.firebase
        .getFigureSolution(this.props.figure)
        .once("value", snapshot => {
          snapshot.val() === this.state.studentGuess
            ? this.handleWin()
            : this.showWrongGuessModal();
          this.setState({ solution: snapshot.val() });
        });
    } else {
      // validate against db value on consequent guesses
      this.state.solution === this.state.studentGuess
        ? this.handleWin()
        : this.showWrongGuessModal();
    }
  }

  handleWin() {
    this.showWinModal();
    this.props.firebase.gameFinished(this.props.gamePin).set(true);
  }

  showGuessModal() {
    this.setState({ showGuessModal: true });
  }

  closeGuessModal() {
    this.setState({ showGuessModal: false });
  }

  showWinModal() {
    this.setState({ showWinModal: true });
  }

  showWrongGuessModal() {
    this.setState({
      showWrongGuessModal: true,
      showGuessModal: false
    });
  }

  closeWrongGuessModal() {
    this.setState({
      showWrongGuessModal: false
    });
  }

  GuessModal = () => (
    <Modal show={this.state.showGuessModal} onHide={this.closeGuessModal}>
      <Modal.Header closeButton>
        <Modal.Title>Hva tror du det er på bildet?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control as="input" onChange={this.handleGuessInput} />
          <Button onClick={this.handleGuessSubmit}>Gjett</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  WinModal = () => (
    <Modal show={this.state.showWinModal}>
      <Modal.Header>
        <Modal.Title>Gratulerer</Modal.Title>
      </Modal.Header>
      <Modal.Body>Dere vant!</Modal.Body>
    </Modal>
  );

  WrongGuessModal = () => (
    <Modal
      show={this.state.showWrongGuessModal}
      onHide={this.closeWrongGuessModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Det var dessverre feil..</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Prøv deg på noen flere oppgaver for å se mer av bildet :)
      </Modal.Body>
    </Modal>
  );

  GuessButton = () => (
    <Button variant="primary" onClick={this.showGuessModal}>
      Gjett hva som er på bildet
    </Button>
  );

  render() {
    return (
      <div>
        <this.GuessModal />
        <this.WinModal />
        <this.WrongGuessModal />
        <this.GuessButton />
      </div>
    );
  }
}

export default withFirebase(GuessFigure);
