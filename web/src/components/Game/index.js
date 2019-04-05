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

  emptyTask = { id: -1, body: {difficulty: 0, test: "", text: "", title: "", error_hint: ""}}

  constructor(props) {
    super(props);

    this.setCurrentTask = this.setCurrentTask.bind(this);
    this.runCode = this.runCode.bind(this);
    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.showErrorModal = this.showErrorModal.bind(this);
    this.closeSolvedModal = this.closeSolvedModal.bind(this);
    this.showSolvedModal = this.showSolvedModal.bind(this);
    this.taskIsSolved = this.taskIsSolved.bind(this);
    this.handleSolvedTask = this.handleSolvedTask.bind(this);
    this.codeHasError = this.codeHasError.bind(this);

    this.state = {
      currentTask: this.emptyTask,
      lastSolvedTaskId: this.emptyTask.id,
      output: '',
      error_message: '',
      showErrorModal: false,
      showSolvedModal: false,
      errorModalHeaders: ['Prøv igjen!', 'Bedre lykke neste gang!', 'Dette gikk visst ikke helt etter planen.', 'Oops..', 'Ikke helt der ennå..'],
      errorModalHeaderText: '',
    };
  }

  setCurrentTask(task) {
    this.setState({currentTask: task })
  }

  runCode(submittedCode) {
    // axios.get('http://python-eval-server.appspot.com/run', { params: { code: submittedCode, task: this.state.currentTask.body } })
    axios.get('http://127.0.0.1:5000/run', { params: { code: submittedCode, task: this.state.currentTask.body } })
    .then( response => {
      this.setState({output: response.data.output, error_message: response.data.error_message})
      if (this.codeHasError()) this.showErrorModal()
      if (this.taskIsSolved(response)) this.handleSolvedTask(submittedCode)
    })
    .catch(function(error) {
      console.log(error);
    });
  }
  
  codeHasError() {
    return this.state.error_message !== '';
  }

  taskIsSolved(response) {
    return this.state.currentTask.id !== this.emptyTask.id && response.data.solved;
  }

  handleSolvedTask(solution) {
    const solvedTaskId = this.state.currentTask.id;
    const game_pin = this.props.cookies.get("game_pin")
    const game_name = this.props.cookies.get("game_name")

    this.setState({lastSolvedTaskId: solvedTaskId})

    this.props.firebase.gamePlayer(game_pin, game_name).child("solvedTasks").child(solvedTaskId).set(
      {solution: solution}
    )
    this.showSolvedModal()
  }

  showErrorModal() {
      this.setState({showErrorModal: true, errorModalHeaderText: this.state.errorModalHeaders[Math.floor(Math.random()*this.state.errorModalHeaders.length)]})
  }

  closeErrorModal() {
      this.setState({showErrorModal: false})
  }

  showSolvedModal() {
    this.setState({showSolvedModal: true})
  }
  
  closeSolvedModal() {
      this.setState({showSolvedModal: false})
  }

  SolvedModal = () => (
    <Modal show={this.state.showSolvedModal} onHide={this.closeSolvedModal}>
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
    <Modal show={this.state.showErrorModal} onHide={this.closeErrorModal}>
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
          <Editor onRunCode={this.runCode} />
          <br/>
          <Console output={this.state.output} />
        </Col>
        <Col>
          <Cards lastSolvedTaskId={this.state.lastSolvedTaskId} onCardSelect={this.setCurrentTask} cookies={this.props.cookies} />
        </Col>
      </Row>
      </Container>
    );
  }
}
export default withFirebase(Game);
