import React, { Component } from "react";
import axios from "axios";
import { withFirebase } from "../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Modal, Navbar, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Editor from "../Editor";
import Cards from "../Cards";
import Podium from "../Podium";
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
    this.showSolvedModal = this.showSolvedModal.bind(this);
    this.runCode = this.runCode.bind(this);
    this.pictureSolved = this.pictureSolved.bind(this);
    this.boardFinished = this.boardFinished.bind(this);
    this.setWinner = this.setWinner.bind(this);
    this.taskPoint = this.taskPoint.bind(this);
    this.checkIfBoardFinished = this.checkIfBoardFinished.bind(this);
    this.handleExitOnGameOver = this.handleExitOnGameOver.bind(this);
    this.handleTaskChosen = this.handleTaskChosen.bind(this);

    this.state = {
      exitGame: false,
      gameIsActive: false,
      gameIsFinished: false,
      showCard: false,
      team: {},
      winnerTeam: "",
      gamePin: this.props.cookies.get("game_pin"),
      playerName: this.props.cookies.get("game_name"),
      teamId: this.props.cookies.get("game_team"),
      figure: "",
      solution: "",
      currentTask: this.emptyTask,
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
    this.props.firebase
      .gameFinished(this.state.gamePin)
      .on("value", snapshot => {
        this.setState({ gameIsFinished: snapshot.val() });
      });
    this.props.firebase
      .gameTeam(this.state.gamePin, this.state.teamId)
      .on("value", snapshot => {
        this.setState({ team: snapshot.val() });
      });
    this.props.firebase
      .gameWinningTeam(this.state.gamePin)
      .on("value", snapshot => {
        this.setState({ winnerTeam: snapshot.val() });
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
    this.props.firebase.gameWinningTeam(this.state.gamePin).off();
    this.props.firebase.gameFinished(this.state.gamePin).off();
    this.props.firebase.gameTeam(this.state.gamePin, this.state.teamId).off();
  }

  exitGame = () => {
    this.setState({
      exitGame: true,
      gamePin: null,
      playerName: null,
      teamId: -1
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

  handleTaskChosen(task, boardIndex = -1) {
    let currentTask = this.emptyTask;

    if (task != null) {
      currentTask = {
        id: task.id,
        boardIndex: boardIndex,
        body: task.body
      };
      this.props.firebase
        .gamePlayer(
          this.state.gamePin,
          this.state.teamId,
          this.state.playerName
        )
        .child("tasks")
        .child(task.id)
        .once("value", snapshot => {
          if (!snapshot.exists()) this.initiateStudentTaskInDB(task.id);
        });
    }

    this.setState({
      currentTask: currentTask
    });
  }

  boardFinished() {
    this.props.firebase
      .gameTeams(this.state.gamePin)
      .once("value", snapshot => {
        const teams = snapshot.val();
        const teamPoints = this.state.team.points;
        let ratingPoints = 3;
        teams.forEach(team => {
          if (team.boardFinished) {
            ratingPoints -= 1;
          }
        });
        if (ratingPoints > 0) {
          this.props.firebase
            .gameTeamPoints(this.state.gamePin, this.state.teamId)
            .set(teamPoints + ratingPoints);
          this.props.firebase
            .gameTeam(this.state.gamePin, this.state.teamId)
            .child("boardRate")
            .set(4 - ratingPoints);
          this.props.firebase
            .gameTeam(this.state.gamePin, this.state.teamId)
            .child("boardFinished")
            .set(true);
        }
        if (ratingPoints === 1 || ratingPoints === teams.length) {
          this.setWinner();
        }
      });
  }

  checkIfBoardFinished() {
    const { team } = this.state;
    let taskSolved = 0;
    Object.values(team.tasks).forEach(task => {
      if (task.solved !== undefined) {
        taskSolved++;
      }
    });
    if (taskSolved === Object.keys(team.tasks).length) {
      this.boardFinished();
    } else {
      this.taskPoint();
    }
  }

  taskPoint() {
    this.props.firebase
      .gameTeams(this.state.gamePin)
      .once("value", snapshot => {
        const teams = snapshot.val();
        this.props.firebase
          .gameTeamPoints(this.state.gamePin, this.state.teamId)
          .set(this.state.team.points + 1);
      });
    this.showSolvedModal();
  }

  pictureSolved() {
    this.props.firebase
      .gameTeams(this.state.gamePin)
      .once("value", snapshot => {
        const teams = snapshot.val();
        let ratingPoints = 3;
        teams.forEach(team => {
          if (team.pictureSolved) {
            ratingPoints -= 1;
          }
        });
        if (ratingPoints > 0) {
          this.props.firebase
            .gameTeamPoints(this.state.gamePin, this.state.teamId)
            .set(this.state.team.points + ratingPoints);
          this.props.firebase
            .gameTeam(this.state.gamePin, this.state.teamId)
            .child("pictureRate")
            .set(4 - ratingPoints);
          this.props.firebase
            .gameTeam(this.state.gamePin, this.state.teamId)
            .child("pictureSolved")
            .set(true);
        }
      });
  }

  setWinner() {
    this.props.firebase.gameFinished(this.state.gamePin).set(true);
    this.props.firebase
      .gameWinningTeam(this.state.gamePin)
      .set(this.state.teamId);
  }

  handleTaskSolved(studentCode) {
    const boardIndex = this.state.currentTask.boardIndex;
    if (boardIndex > -1) {
      this.getImageUrl(boardIndex).then(url => {
        this.solveStudentTaskInDB(this.state.currentTask.id, studentCode, url);
        this.checkIfBoardFinished();
        this.setState({
          currentTask: this.emptyTask
        });
      });
    }
  }

  initiateStudentTaskInDB(taskId) {
    const taskStartTime = new Date().getTime();
    this.props.firebase
      .gamePlayer(this.state.gamePin, this.state.teamId, this.state.playerName)
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
        .gamePlayer(
          this.state.gamePin,
          this.state.teamId,
          this.state.playerName
        )
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
      .gameTeam(this.state.gamePin, this.state.teamId)
      .update(updates);
  }

  showErrorModal(studentCode) {
    const taskId = this.state.currentTask.id;
    this.props.firebase
      .gamePlayer(this.state.gamePin, this.state.teamId, this.state.playerName)
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
    this.props.cookies.remove("current_card");
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

  FinishedModal = () => (
    <Modal
      show={this.state.team.boardFinished && !this.state.gameIsFinished}
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>Gratulerer!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Dere var nummer <strong>{this.state.team.boardRate}</strong> til å bli
        ferdige med brettet, og får derfor{" "}
        <strong>{4 - this.state.team.boardRate}</strong> bonuspoeng. <br />
        Totalt fikk dere <strong>{this.state.team.points}</strong> poeng. Bra
        jobba!
        <br />
        <br />
        Resultatet kommer når 3 lag er ferdige med brettet.
      </Modal.Body>
    </Modal>
  );

  GamePlayElements = () => (
    <Container className="gameComponent">
      <this.ErrorModal />
      <this.SolvedModal />
      <this.FinishedModal />
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
              onCardSelect={this.handleTaskChosen}
              cookies={this.props.cookies}
            />
          </Row>
          <Row>
            <Col>
              <GuessFigure
                figure={this.state.figure}
                solution={this.state.solution}
                cookies={this.props.cookies}
                pictureSolved={this.pictureSolved}
                team={this.state.team}
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
      <h5 style={{ margin: "0px" }}>Team poeng:{this.state.team.points} </h5>
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

  handleExitOnGameOver() {
    this.props.onExit();
    return <Redirect to={ROUTES.STUDENT} />;
  }

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
          {this.state.gameIsFinished && (
            <Podium
              handleExitOnGameOver={this.handleExitOnGameOver}
              cookies={this.props.cookies}
            />
          )}
        </Container>
      </>
    );
  }
}
export default withFirebase(Game);
