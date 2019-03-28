import React, { Component } from "react";
import axios from 'axios';
import { withFirebase } from "../Firebase";
import {
  Container,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import Editor from "../Editor";
import Cards from "../Cards";
import Console from "../Console";
import "./style.css";

class Game extends Component {

  emptyTask = {difficulty: 0, test: "", text: "", title: "", error_hint: ""}

  constructor(props) {
    super(props);

    this.setCurrentTask = this.setCurrentTask.bind(this);
    this.runCode = this.runCode.bind(this);
    this.handleErrorModalClose = this.handleErrorModalClose.bind(this);
    this.handleErrorModalShow = this.handleErrorModalShow.bind(this);
    this.handleSolvedModalClose = this.handleSolvedModalClose.bind(this);
    this.handleSolvedModalShow = this.handleSolvedModalShow.bind(this);

    this.state = {
      currentTask: this.emptyTask,
      output: '',
      error_message: '',
      showErrorModal: false,
      showSolvedModal: false,
      errorModalHeaders: ['Prøv igjen!', 'Bedre lykke neste gang!', 'Dette gikk visst ikke helt etter planen.', 'Oops..', 'Ikke helt der ennå..'],
      errorModalHeaderText: ''
    };
  }

  setCurrentTask(card) {
    this.setState({currentTask: card})
  }

  runCode(submittedCode) {
    console.log("code: ", this.state.aceEditorValue);
    // axios.get('http://python-eval-server.appspot.com/run', { params: { code: this.state.aceEditorValue } })
    axios.get('http://127.0.0.1:5000/run', { params: { code: submittedCode, task: this.state.currentTask } })
    .then( response => {
      console.log("response: ", response)
      this.setState({output: response.data.output, error_message: response.data.error_message})
      if (this.state.error_message !== '') this.handleErrorModalShow()
      if (response.data.solved) this.handleSolvedModalShow()
    })
    .catch(function(error) {
      console.log(error);
    });
  } 

  solveTask(solutionCode) {
    //Sjekk mot redux store currentGame -> Tasks -> lik ID -> solutionCode
    //hvis lik =>    legg til oppgave til bruker
    //               disable oppgaven for spillet = bytt ut oppgaven med del av bilde
  }

  handleErrorModalClose() {
      this.setState({showErrorModal: false})
  }

  handleErrorModalShow() {
      this.setState({showErrorModal: true, errorModalHeaderText: this.state.errorModalHeaders[Math.floor(Math.random()*this.state.errorModalHeaders.length)]})
  }

  handleSolvedModalClose() {
      this.setState({showSolvedModal: false})
  }

  handleSolvedModalShow() {
      this.setState({showSolvedModal: true})
  }

  SolvedModal = () => (
    <Modal show={this.state.showSolvedModal} onHide={this.handleSolvedModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>
            Bra jobbet!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Du fikk til oppgaven :D
      </Modal.Body>
    </Modal>
  )

  ErrorModal = () => (
    <Modal show={this.state.showErrorModal} onHide={this.handleErrorModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>
            {this.state.errorModalHeaderText}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.state.error_message}
      </Modal.Body>
    </Modal>
  )

  render() {
    return (
      <Container className="gameComponent">
      <this.ErrorModal/>
      <this.SolvedModal/>
      <Row>
        <Col>
          <Editor onRunCode={this.runCode}/>
          <br/>
          <Console output={this.state.output} />
        </Col>
        <Col>
          <Cards onCardSelect={this.setCurrentTask} cookies={this.props.cookies} />
        </Col>
      </Row>
      </Container>
    );
  }
}
export default withFirebase(Game);
