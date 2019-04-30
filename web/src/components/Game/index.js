import React, { Component } from "react";
import axios from "axios";
import { withFirebase } from "../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Modal, Navbar, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Editor from "../Editor";
import Cards from "../Cards";
import Console from "../Console";
import GuessFigure from "../GuessFigure";
import "./style.css";
import * as ROUTES from "../../constants/routes";

class Game extends Component {
  emptyTask = {
    id: "",
    boardIndex: -1,
    body: {
      difficulty: 0,
      test: "",
      text: "",
      title: "",
      error_hints: ["", "", ""],
      default_code: "",
      output_requirement: "",
      code_requirement: ""
    }
  };

  constructor(props) {
    super(props);

    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.closeSolvedModal = this.closeSolvedModal.bind(this);
    this.runCode = this.runCode.bind(this);
    this.handleTaskStart = this.handleTaskStart.bind(this);

    this.state = {
      exitGame: false,
      gameIsActive: false,
      showCard: false,
      gamePin: this.props.cookies.get("game_pin"),
      playerName: this.props.cookies.get("game_name"),
      team: this.props.cookies.get("game_team"),
      figure: "",
      solution: "",
      currentTask: this.emptyTask,
      lastSolvedTask: { id: this.emptyTask.id, url: "" },
      output: "",
      error_message: "",
      showErrorModal: false,
      showSolvedModal: false,
      errorModalHeaders: [
        "Prøv igjen!",
        "Bedre lykke neste gang!",
        "Dette gikk visst ikke helt etter planen.",
        "Oops..",
        "Ikke helt der ennå.."
      ],
      errorModalHeaderText: ""
    };
  }

  componentDidMount() {
    this.props.firebase.gameState(this.state.gamePin).on("value", snapshot => {
      this.setState({ gameIsActive: snapshot.val() });
    });

    let figure = "";

    this.props.firebase
      .gameFigure(this.state.gamePin)
      .once("value", snapshot => {
        figure = snapshot.val();
        this.setState({ figure: figure });

        this.props.firebase
          .getFigureSolution(figure)
          .once("value", snapshot => {
            this.setState({ solution: snapshot.val() });
          });
      });
  }

  componentWillUnmount() {
    this.props.firebase.gameState(this.state.gamePin).off();
  }

  exitGame = () => {
    this.setState({
      exitGame: true,
      gamePin: null,
      playerName: null,
      team: 0
    });

    this.props.onExit();
  };

  runCode(submittedCode) {
    axios
      .get("http://35.228.206.249/run", {
        params: { code: submittedCode, task: this.state.currentTask.body }
      })
      .then(response => {
        this.setState({
          output: response.data.output,
          error_message: response.data.error_message
        });

        if (this.codeHasError()) this.showErrorModal(submittedCode);
        this.taskIsSolved(response.data.solved)
          ? this.handleTaskSolved(submittedCode)
          : this.updateStudentTaskInDB(submittedCode);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  codeHasError() {
    return this.state.error_message !== "";
  }

  taskIsSolved(solved) {
    return this.state.currentTask.id !== this.emptyTask.id && solved;
  }

  async getImageUrl(key) {
    try {
      const url = await this.props.firebase
        .getImagePart(this.state.figure, key)
        .getDownloadURL();
      return url;
    } catch (error) {
      console.log(error);
    }
  }

  handleTaskStart(task, boardIndex = -1) {
    let currentTaskBody;
    boardIndex === -1
      ? (currentTaskBody = this.emptyTask.body)
      : (currentTaskBody = task.body);
    this.setState({
      currentTask: {
        id: task.id,
        boardIndex: boardIndex,
        body: currentTaskBody
      },
      showCard: boardIndex >= 0
    });
    if (boardIndex >= 0) {
      this.props.firebase
        .gamePlayer(this.state.gamePin, this.state.team, this.state.playerName)
        .child("tasks")
        .child(task.id)
        .once("value", snapshot => {
          if (!snapshot.exists()) this.initiateStudentTaskInDB(task.id);
        });
    }
  }

  handleTaskSolved(studentCode) {
    const boardIndex = this.state.currentTask.boardIndex;
    if (boardIndex > -1) {
      this.getImageUrl(boardIndex).then(url => {
        this.solveStudentTaskInDB(this.state.currentTask.id, studentCode, url);
        this.setState({
          lastSolvedTask: { id: this.state.currentTask.id, url: url },
          showCard: false,
          currentTask: this.emptyTask
        });
        this.showSolvedModal();
      });
    }
  }

  initiateStudentTaskInDB(taskId) {
    const taskStartTime = new Date().getTime();
    this.props.firebase
      .gamePlayer(this.state.gamePin, this.state.team, this.state.playerName)
      .child("tasks")
      .child(taskId)
      .set({
        startTime: taskStartTime,
        endTime: null,
        studentCode: null
      });
  }

  updateStudentTaskInDB(studentCode) {
    const boardIndex = parseInt(this.state.currentTask.boardIndex);
    const taskId = this.state.currentTask.id;
    if (boardIndex >= 0) {
      this.props.firebase
        .gamePlayer(this.state.gamePin, this.state.team, this.state.playerName)
        .child("tasks")
        .child(taskId)
        .child("studentCode")
        .set(studentCode);
    }
  }

  solveStudentTaskInDB(taskId, studentCode, imageUrl) {
    const taskEndTime = new Date().getTime();
    let updates = {};
    updates[
      "/players/" + this.state.playerName + "/tasks/" + taskId + "/endTime/"
    ] = taskEndTime;
    updates[
      "/players/" + this.state.playerName + "/tasks/" + taskId + "/studentCode/"
    ] = studentCode;
    updates["/tasks/" + taskId + "/solved/"] = imageUrl;

    this.props.firebase
      .gameTeam(this.state.gamePin, this.state.team)
      .update(updates);
  }

  showErrorModal(studentCode) {
    const taskId = this.state.currentTask.id;
    this.props.firebase
      .gamePlayer(this.state.gamePin, this.state.team, this.state.playerName)
      .child("tasks")
      .child(taskId)
      .child("studentCode")
      .set(studentCode);
    this.setState({
      showErrorModal: true,
      errorModalHeaderText: this.state.errorModalHeaders[
        Math.floor(Math.random() * this.state.errorModalHeaders.length)
      ]
    });
  }

  closeErrorModal() {
    this.setState({ showErrorModal: false });
  }

  showSolvedModal() {
    this.setState({ showSolvedModal: true });
  }

  closeSolvedModal() {
    this.setState({ showSolvedModal: false });
  }

  SolvedModal = () => (
    <Modal show={this.state.showSolvedModal} onHide={this.closeSolvedModal}>
      <Modal.Header closeButton>
        <Modal.Title>Bra jobbet!</Modal.Title>
      </Modal.Header>
      <Modal.Body>Du fikk til oppgaven :D</Modal.Body>
    </Modal>
  );

  ErrorModal = () => (
    <Modal show={this.state.showErrorModal} onHide={this.closeErrorModal}>
      <Modal.Header closeButton>
        <Modal.Title>{this.state.errorModalHeaderText}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="display-linebreak">
        {this.state.error_message}
      </Modal.Body>
    </Modal>
  );

  GamePlayElements = () => (
    <Container className="gameComponent">
      <this.ErrorModal />
      <this.SolvedModal />
      <Row style={{ margin: "auto" }}>
        <Col>
          <Editor
            onRunCode={this.runCode}
            defaultCode={this.state.currentTask.body.default_code}
          />
          <Console output={this.state.output} />
        </Col>
        <Col>
          <Row>
            <Cards
              lastSolvedTask={this.state.lastSolvedTask}
              onCardSelect={this.handleTaskStart}
              cookies={this.props.cookies}
              showCard={this.state.showCard}
            />
          </Row>
          <Row>
            <Col>
              <GuessFigure
                figure={this.state.figure}
                solution={this.state.solution}
                cookies={this.props.cookies}
                onGameOver={this.props.onGameOver}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );

  GameNavigation = () => (
    <Navbar className="studentGameNav justify-content-between">
      <h5 style={{ margin: "0px" }}>Hei, {this.state.playerName} </h5>
      {this.state.exitGame ? (
        <Redirect
          to={{
            pathname: ROUTES.STUDENT
          }}
        />
      ) : (
        <Button className="exitGame" onClick={this.exitGame}>
          <FontAwesomeIcon icon="sign-out-alt" color="white" />
          Avslutt spill
        </Button>
      )}
    </Navbar>
  );

  render() {
    return (
      <>
        <this.GameNavigation />
        <Container className="studentGame">
          {this.state.gamePin && !this.state.gameIsActive ? (
            <Row style={{ justifyContent: "center" }}>
              Venter på at spillet skal starte..
            </Row>
          ) : (
            <this.GamePlayElements />
          )}
        </Container>
      </>
    );
  }
}
export default withFirebase(Game);
