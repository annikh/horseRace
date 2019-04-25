import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";

class GuessFigure extends Component {
  constructor(props) {
    super(props);

    this.closeGuessModal = this.closeGuessModal.bind(this);
    this.showGuessModal = this.showGuessModal.bind(this);
    this.closeWrongGuessModal = this.closeWrongGuessModal.bind(this);
    this.handleGuessSubmit = this.handleGuessSubmit.bind(this);
    this.handleGuessInput = this.handleGuessInput.bind(this);
    this.handleExitOnGameOver = this.handleExitOnGameOver.bind(this);

    this.state = {
      gamePin: this.props.cookies.get("game_pin"),
      gameTeam: this.props.cookies.get("game_team"),
      showGuessModal: false,
      showWrongGuessModal: false,
      studentGuess: "",
      solution: "",
      gameIsFinished: false,
      winnerTeam: ""
    };
  }

  componentDidMount() {
    this.props.firebase
      .gameFinished(this.state.gamePin)
      .on("value", snapshot => {
        this.setState({ gameIsFinished: snapshot.val() });
      });

    this.props.firebase
      .gameWinningTeam(this.state.gamePin)
      .on("value", snapshot => {
        this.setState({ winnerTeam: snapshot.val() });
      });
  }

  componentWillUnmount() {
    this.props.firebase.gameFinished(this.state.gamePin).off();
    this.props.firebase.gameWinningTeam(this.state.gamePin).off();
  }

  handleGuessInput(event) {
    this.setState({ studentGuess: event.target.value });
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
    this.props.firebase.gameFinished(this.state.gamePin).set(true);
    this.props.firebase
      .gameWinningTeam(this.state.gamePin)
      .set(this.state.gameTeam);

    this.setState({
      winnerTeam: this.state.gameTeam,
      gameIsFinished: true
    });
  }

  showGuessModal() {
    this.setState({ showGuessModal: true });
  }

  closeGuessModal() {
    this.setState({ showGuessModal: false });
  }

  handleExitOnGameOver() {
    this.props.onGameOver();
    this.props.cookies.remove("game_pin");
    this.props.cookies.remove("game_team");
    this.props.cookies.remove("game_name");
    return <Redirect to={ROUTES.STUDENT} />;
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
    <Modal show={true} onHide={this.handleExitOnGameOver}>
      <Modal.Header closeButton>
        <Modal.Title>Gratulerer</Modal.Title>
      </Modal.Header>
      <Modal.Body>Dere vant!</Modal.Body>
    </Modal>
  );

  LoseModal = () => (
    <Modal show={true} onHide={this.handleExitOnGameOver}>
      <Modal.Header closeButton>
        <Modal.Title>Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Et annet lag har gjettet riktig. Løsningen var: {this.state.solution}
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

  GuessButton = () => (
    <Button variant="primary" onClick={this.showGuessModal}>
      Gjett hva som er på bildet
    </Button>
  );

  render() {
    return (
      <div>
        <this.GuessButton />
        {!this.state.gameIsFinished ? (
          <div>
            <this.GuessModal />
            <this.WrongGuessModal />
          </div>
        ) : this.state.winnerTeam === this.state.gameTeam ? (
          <this.WinModal />
        ) : (
          <this.LoseModal />
        )}
      </div>
    );
  }
}

export default withFirebase(GuessFigure);
