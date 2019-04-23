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
  defaultErrorMessage = "Trykk på et av kortene for å velge en oppgave"

  constructor(props) {
    super(props);

    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.closeSolvedModal = this.closeSolvedModal.bind(this);
    this.runCode = this.runCode.bind(this);
    this.handleTaskStart = this.handleTaskStart.bind(this);

    this.state = {
      currentTask: this.emptyTask,
      lastSolvedTask: {id: this.emptyTask.id, url: ''},
      output: '',
      error_message: '',
      showErrorModal: false,
      showSolvedModal: false,
      errorModalHeaders: ['Prøv igjen!', 'Bedre lykke neste gang!', 'Dette gikk visst ikke helt etter planen.', 'Oops..', 'Ikke helt der ennå..'],
      errorModalHeaderText: '',
      playerName: this.props.cookies.get("game_name"),
      team: this.props.cookies.get("game_team"),
      gamePin: this.props.cookies.get("game_pin")
    };
  }

  runCode(submittedCode) {
    // axios.get('http://python-eval-server.appspot.com/run', { params: { code: submittedCode, task: this.state.currentTask.body } })
    axios.get('http://127.0.0.1:5000/run', { params: { code: submittedCode, task: this.state.currentTask.body } })
    .then( response => {
      const error_message = this.aTaskIsSelected ? this.defaultErrorMessage : response.data.error_message;
      this.setState({
        output: response.data.output, 
        error_message: error_message
      })
      
      if (this.codeHasError()) this.showErrorModal()
      this.taskIsSolved(response.data.solved) ? this.handleTaskSolved(submittedCode) : this.updateStudentTaskInDB(submittedCode);
    })
    .catch(function(error) {
      console.log(error);
    });
  }
  
  codeHasError() {
    return this.state.error_message !== "";
  }

  aTaskIsSelected() {
    return this.state.currentTask.id !== this.emptyTask.id;
  }
  
  taskIsSolved(solved) {
    return parseInt(this.state.currentTask.id) !== this.emptyTask.id && solved;
  }
  
  async getImageUrl(key) {
    let figurePart = key < 10 ? "0" + key : key;
    try {
      const url = await this.props.firebase.getImagePart(this.state.figure, figurePart).getDownloadURL();
      return url;
    }
    catch (error) {
      console.log(error)
    }
  }
  
  handleTaskStart(task) {
    this.setState({currentTask: task });
    if (task.id >= 0) this.initiateStudentTaskInDB(task.id);
  }
  
  handleTaskSolved(studentCode) {
    const solvedTaskId = parseInt(this.state.currentTask.id);

    this.getImageUrl(solvedTaskId+1).then(url => {
      this.setState({
        lastSolvedTask: {id: solvedTaskId, url: url}
      })
      this.solveStudentTaskInDB(solvedTaskId, studentCode, url);
      this.showSolvedModal();
    })
  }

  initiateStudentTaskInDB(taskId) {
    const taskStartTime = new Date().getTime();
    this.props.firebase.gamePlayer(this.state.gamePin, this.state.team, this.state.playerName).child("tasks").child(taskId).set(
      {
        startTime: taskStartTime,
        endTime: null,
        studentCode: null
      }
    );
  }
  
  updateStudentTaskInDB(studentCode) {
    const taskId = parseInt(this.state.currentTask.id);
    if (taskId >= 0) {
      this.props.firebase.gamePlayer(this.state.gamePin, this.state.team, this.state.playerName).child("tasks").child(taskId).child("studentCode").set(
        studentCode
      );
    }
  }

  solveStudentTaskInDB(taskId, studentCode, imageUrl) {
    const taskEndTime = new Date().getTime();

    let updates = {};
    updates['/players/' + this.state.playerName + '/tasks/' + taskId +  '/endTime/'] = taskEndTime;
    updates['/players/' + this.state.playerName + '/tasks/' + taskId +'/studentCode/'] = studentCode;
    updates['/solvedTasks/' + taskId + '/url/'] = imageUrl;

    this.props.firebase.gameTeam(this.state.gamePin, this.state.team).update(updates);
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
          <Cards lastSolvedTask={this.state.lastSolvedTask} onCardSelect={this.handleTaskStart} cookies={this.props.cookies} />
        </Col>
      </Row>
      </Container>
    );
  }
}
export default withFirebase(Game);
