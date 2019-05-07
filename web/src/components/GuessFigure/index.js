import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { withFirebase } from "../Firebase";

class GuessFigure extends Component {
  constructor(props) {
    super(props);

    this.closeGuessModal = this.closeGuessModal.bind(this);
    this.showGuessModal = this.showGuessModal.bind(this);
    this.closeWrongGuessModal = this.closeWrongGuessModal.bind(this);
    this.closeCorrectGuessModal = this.closeCorrectGuessModal.bind(this);
    this.handleGuessSubmit = this.handleGuessSubmit.bind(this);
    this.handleGuessInput = this.handleGuessInput.bind(this);

    this.state = {
      gamePin: this.props.cookies.get("game_pin"),
      gameTeam: this.props.cookies.get("game_team"),
      showGuessModal: false,
      showWrongGuessModal: false,
      studentGuess: "",
      showGuessButton: true
    };
  }

  componentDidMount() {
    this.props.firebase
      .gameTeam(this.state.gamePin, this.state.gameTeam)
      .child("pictureSolved")
      .on("value", snapshot => {
        this.setState({ showGuessButton: !snapshot.val() });
      });
  }

  componentWillUnmount() {
    this.props.firebase
      .gameTeam(this.state.gamePin, this.state.gameTeam)
      .child("pictureSolved")
      .off();
  }

  handleGuessInput(event) {
    this.setState({ studentGuess: event.target.value });
  }

  handleGuessSubmit(event) {
    event.preventDefault();
    this.props.solution === this.state.studentGuess.toLowerCase()
      ? this.handleCorrectGuess()
      : this.showWrongGuessModal();
  }

  handleCorrectGuess() {
    this.props.pictureSolved();
    this.setState({
      showGuessModal: false,
      showCorrectGuessModal: true
    });
  }

  showGuessModal() {
    this.setState({ showGuessModal: true });
  }

  closeGuessModal() {
    this.setState({ showGuessModal: false });
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

  showCorrectGuessModal() {
    this.setState({
      showCorrectGuessModal: true
    });
  }

  closeCorrectGuessModal() {
    this.setState({
      showCorrectGuessModal: false
    });
  }

  GuessModal = () => (
    <Modal show={this.state.showGuessModal} onHide={this.closeGuessModal}>
      <Modal.Header closeButton>
        <Modal.Title>Hva tror du det er på bildet?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={this.handleGuessSubmit}>
          <Form.Group>
            <Form.Control as="input" onChange={this.handleGuessInput} />
          </Form.Group>
          <Button variant="info" type="submit">
            Gjett
          </Button>
        </Form>
      </Modal.Body>
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

  CorrectGuessModal = () => (
    <Modal
      show={this.state.showCorrectGuessModal}
      onHide={this.closeCorrectGuessModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Det var riktig!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.props.team.pictureRate > 0 ? (
          <span>
            Dere var nummer {this.props.team.pictureRate} til å gjette bildet,
            og får derfor {4 - this.props.team.pictureRate} poeng!
          </span>
        ) : (
          <span>
            Noen andre har tatt poengene for å gjette bildet først..
            <br />
            Men dere kan fortsatt vinne bonuspoeng ved å løse hele brettet
            først! Stå på!
          </span>
        )}
      </Modal.Body>
    </Modal>
  );

  GuessButton = () => (
    <Button className="btn-guess" onClick={this.showGuessModal}>
      Gjett hva som er på bildet
    </Button>
  );

  render() {
    return (
      <>
        {this.state.showGuessButton && <this.GuessButton />}
        <>
          <this.GuessModal />
          <this.WrongGuessModal />
          <this.CorrectGuessModal />
        </>
      </>
    );
  }
}

export default withFirebase(GuessFigure);
