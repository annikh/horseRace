import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import * as COLORS from "../../constants/colors";
import "./style.css";

class Cards extends Component {
  emptyCard = {
    id: -1,
    body: {
      difficulty: 0,
      test: "",
      text: "",
      title: "",
      error_hint: "",
      default_code: ""
    }
  };

  constructor(props) {
    super(props);
    this.handleCardClose = this.handleCardClose.bind(this);
    this.handleCardOpen = this.handleCardOpen.bind(this);
    this.deactivateTaskInDB = this.deactivateTaskInDB.bind(this);
    this.reactivateTaskInDB = this.reactivateTaskInDB.bind(this);

    this.state = {
      cards: [],
      showCard: false,
      selectedCard: this.emptyCard,
      figure: "kanelbolle",
      solvedTasks: {},
      gameBoard: {},
      gameTeam: this.props.cookies.get("game_team"),
      gamePin: this.props.cookies.get("game_pin")
    };
  }

  componentDidMount() {
    let gameBoard = null;
    let cards = null;

    this.props.firebase.gameTasks(this.state.gamePin).on("value", snapshot => {
      cards = snapshot.val();
      this.setState({ cards: cards });

      this.props.firebase
        .solvedGameTasks(this.state.gamePin, this.state.gameTeam)
        .on("value", snapshot => {
          let solvedTasks = {};
          const solvedTasksFromDB = snapshot.val();
          if (!this.objectIsEmpty(solvedTasksFromDB)) {
            Object.keys(solvedTasksFromDB).forEach(taskId => {
              const url = solvedTasksFromDB[taskId].url;
              solvedTasks[taskId] = url;
            });
          }

          if (this.objectIsEmpty(this.state.gameBoard)) {
            gameBoard = this.generateInitialBoardState(cards, solvedTasks);
            this.setState({ gameBoard: gameBoard });
            this.setState({ solvedTasks: solvedTasks });
          }
        });
    });
  }

  componentDidUpdate(prevProps) {
    const lastSolvedTaskId = this.props.lastSolvedTask.id;
    const previousLastSolvedTaskId = prevProps.lastSolvedTask.id;
    const url = this.props.lastSolvedTask.url;

    if (
      lastSolvedTaskId !== previousLastSolvedTaskId &&
      !this.taskIsSolved(lastSolvedTaskId, this.state.solvedTasks)
    ) {
      this.replaceCardWithImage(lastSolvedTaskId, url, this.state.gameBoard);
      let solvedTasks = this.state.solvedTasks;
      solvedTasks[lastSolvedTaskId] = url;
      this.setState({ solvedTasks: solvedTasks });
      this.handleCardClose();
    }
  }

  componentWillUnmount() {
    this.props.firebase.gameTasks(this.state.gamePin).off();
    this.props.firebase
      .solvedGameTasks(this.state.gamePin, this.state.gameTeam)
      .off();
  }

  generateInitialBoardState(cards, solvedTasks) {
    let board = {};
    Object.keys(cards).forEach(id => {
      board[id] = this.taskIsSolved(id, solvedTasks) ? (
        <img src={solvedTasks[id]} className="img" alt="" />
      ) : (
        <Button
          key={id}
          className="card"
          style={{
            backgroundColor: this.setCardColorByDiffictuly(cards[id].difficulty)
          }}
          onClick={() => this.handleCardOpen(id, cards[id])}
        >
          {cards[id].title}
        </Button>
      );
    });
    return board;
  }

  replaceCardWithImage(taskId, imgUrl, gameBoard) {
    let newGameBoardState = gameBoard;
    newGameBoardState[taskId] = (
      <img src={imgUrl} className="img" key={taskId} alt="" />
    );
    this.setState({ gameBoard: newGameBoardState });
  }

  objectIsEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  taskIsSolved(taskId, solvedTasks) {
    return taskId in solvedTasks;
  }

  handleCardClose() {
    this.reactivateTaskInDB(this.state.selectedCard.id);
    this.setState({ showCard: false });
    this.props.onCardSelect(this.state.selectedCard);
  }

  handleCardOpen(key, card) {
    this.setState({
      selectedCard: { id: key, body: card },
      showCard: true
    });
    this.props.onCardSelect({ id: key, body: card });
    this.deactivateTaskInDB(key);
  }

  deactivateTaskInDB(taskId) {
    this.props.firebase
      .gameTask(this.state.gamePin, taskId)
      .child("active")
      .set(false);
  }

  reactivateTaskInDB(taskId) {
    this.props.firebase
      .gameTask(this.state.gamePin, taskId)
      .child("active")
      .set(true);
  }

  setCardColorByDiffictuly(difficulty) {
    switch (difficulty) {
      case 1:
        return COLORS.EASY_DIFFICULTY;
      case 2:
        return COLORS.MEDIUM_DIFFICULTY;
      case 3:
        return COLORS.HARD_DIFFICULTY;
      default:
        return COLORS.DEFAULT;
    }
  }

  OpenedCard = () => (
    <Card
      className="openedCard"
      style={{
        backgroundColor: this.setCardColorByDiffictuly(
          this.state.selectedCard.body.difficulty
        )
      }}
    >
      <Card.Body>
        <Card.Title>{this.state.selectedCard.body.title}</Card.Title>
        <Card.Text>{this.state.selectedCard.body.text}</Card.Text>
        <Button variant="info" onClick={this.handleCardClose} block>
          Lukk
        </Button>
      </Card.Body>
    </Card>
  );

  GameBoard = () =>
    Object.keys(this.state.gameBoard).map((key, index) =>
      (index + 1) % 4 === 0 ? (
        <ButtonGroup key={key}>
          {this.state.gameBoard[key - 3]}
          {this.state.gameBoard[key - 2]}
          {this.state.gameBoard[key - 1]}
          {this.state.gameBoard[key]}
        </ButtonGroup>
      ) : null
    );

  render() {
    return (
      <div>
        {this.state.showCard ? <this.OpenedCard /> : <this.GameBoard />}
      </div>
    );
  }
}
export default withFirebase(Cards);
