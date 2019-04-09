import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import {
  Button,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import * as COLORS from "../../constants/colors";
import "./style.css";

class Cards extends Component {

  emptyCard = {id: -1, body: {difficulty: 0, test: "", text: "", title: "", error_hint: ""}}

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
      solvedTasksIds: [],
      imageUrls: {},
      gameBoard: {}
    };
  }

  generateInitialBoardState(cards) {
    console.log("solved tasks", this.state.solvedTasksIds)
    let board = {}
    cards.forEach((card, i) => {
      board[i] = 
      (this.taskIsSolved(i-1) ? (
        <img src={this.state.imageUrls[i]} className="img" alt={`picture tile ${i}`} />
      ) : (
        <Button
            key={i}
            className="card"
            style={{
              backgroundColor: this.setCardColorByDiffictuly(card.difficulty)
            }}
            onClick={() => this.handleCardOpen(i, card)}
          >
            {card.title}
        </Button>
      ))
    });
    return board;
  }

  gameBoardIsEmpty() {
    return Object.keys(this.state.gameBoard).length === 0;
  }

  componentDidMount() {
    const game_pin = this.props.cookies.get("game_pin");
    const team = this.props.cookies.get("game_team");

    this.props.firebase.solvedGameTasks(game_pin, team).on("value", snapshot => {
      const solvedTasks = snapshot;
      let solvedTasksIds = [];
      solvedTasks.forEach((task) => {
        solvedTasksIds.push(parseInt(task.key, 10))
      })
      this.setState({solvedTasksIds: solvedTasksIds})

      this.props.firebase.gameTasks(game_pin).on("value", snapshot => {
        const cards = snapshot.val()
        this.setState({cards: cards});
        if (this.gameBoardIsEmpty()) this.setState({gameBoard: this.generateInitialBoardState(cards)})
      })
    })
  }

  componentDidUpdate(prevProps) {
    const lastSolvedTaskId = this.props.lastSolvedTaskId
    const previousLastSolvedTaskId = prevProps.lastSolvedTaskId
    if (lastSolvedTaskId !== previousLastSolvedTaskId && !this.taskIsSolved(lastSolvedTaskId)) {
      this.getImageUrl(lastSolvedTaskId+1).then(url => {
        this.replaceCardWithImage(lastSolvedTaskId, url)
        this.setState({solvedTasksIds: [...this.state.solvedTasksIds, lastSolvedTaskId]})
        this.handleCardClose()
      });
    }
  }

  replaceCardWithImage(taskId, imgUrl) {
    let newGameBoardState = this.state.gameBoard;
    newGameBoardState[taskId] = <img src={imgUrl} className="img" key={taskId} alt={`picture tile ${taskId}`} />;
    console.log(newGameBoardState)
    this.setState({gameBoard: newGameBoardState})
  }

  taskIsSolved(taskId) {
    return taskId in this.state.solvedTasksIds;
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

  handleCardClose() {
    this.reactivateTaskInDB(this.state.selectedCard.id);
    this.setState({ showCard: false, selectedCard: this.emptyCard });
    this.props.onCardSelect(this.emptyCard);
  }

  handleCardOpen(key, card) {
    this.setState({
      selectedCard: {id: key, body: card},
      showCard: true
    });
    this.props.onCardSelect({id: key, body: card});
    this.deactivateTaskInDB(key);
  }

  deactivateTaskInDB(taskId) {
    this.props.firebase.gameTask(this.props.cookies.get("game_pin"), taskId).child('active').set(
      false
    );
  }

  reactivateTaskInDB(taskId) {
    this.props.firebase.gameTask(this.props.cookies.get("game_pin"), taskId).child('active').set(
      true
    );
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
      }}>
      <Card.Body>
        <Card.Title>{this.state.selectedCard.body.title}</Card.Title>
        <Card.Text>{this.state.selectedCard.body.text}</Card.Text>
        <Button variant="info" onClick={this.handleCardClose} block>
          Lukk
        </Button>
      </Card.Body>
    </Card>
  )

  GameBoard = () => (
    Object.keys(this.state.gameBoard).map((key, index) => (
      ((index+1) % 4 === 0) ? (
        <ButtonGroup>
          {this.state.gameBoard[key-3]}
          {this.state.gameBoard[key-2]}
          {this.state.gameBoard[key-1]}
          {this.state.gameBoard[key]}
        </ButtonGroup>
      ) : 
      null
    ))
  )

  render() {
    return (
      <div>
        {this.state.showCard ? <this.OpenedCard /> : <this.GameBoard />}
      </div>
    );
  }
}
export default withFirebase(Cards);
