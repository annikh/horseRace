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
    this.handleCardClicked = this.handleCardClicked.bind(this);
    this.deactivateTask = this.deactivateTask.bind(this);
    this.reactivateTask = this.reactivateTask.bind(this);

    this.state = {
      cards: [],
      showCard: false,
      selectedCard: this.emptyCard,
      gamePin: null,
      figure: "kanelbolle",
      solvedTasksIds: [],
      gameBoard: {}
    };
  }

  generateInitialBoardState(cards) {
    let board = {}
    cards.forEach((card, i) => {
      board[i] = 
      <Button
          key={i}
          className="card"
          style={{
            backgroundColor: this.setBackgroundColor(card.difficulty)
          }}
          onClick={() => this.handleCardClicked(i, card)}
        >
          {card.title}
      </Button>
    });
    return board;
  }

  componentDidMount() {
    const game_pin = this.props.cookies.get("game_pin");
    this.setState({ gamePin: game_pin });
    
    this.props.firebase.gameTasks(game_pin).on("value", snapshot => {
      const cards = snapshot.val()
      this.setState({cards: cards});
      if (Object.keys(this.state.gameBoard).length === 0) this.setState({gameBoard: this.generateInitialBoardState(cards)})
    })
  }

  componentDidUpdate(prevProps) {
    let lastSolvedTaskId = this.props.lastSolvedTaskId
    let previousLastSolvedTaskId = prevProps.lastSolvedTaskId
    if (lastSolvedTaskId !== previousLastSolvedTaskId && !this.taskIsSolved(lastSolvedTaskId)) {
      this.getImageUrl(lastSolvedTaskId+1).then(url => {
        this.updateBoardState(lastSolvedTaskId, url)
        this.setState({solvedTasksIds: [...this.state.solvedTasksIds, lastSolvedTaskId]})
        this.handleCardClose()
      });
    }
  }

  updateBoardState(taskId, imgUrl) {
    let newGameBoardState = this.state.gameBoard;
    newGameBoardState[taskId] = <img src={imgUrl} className="card" key={taskId}/>;
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
    this.reactivateTask(this.state.selectedCard.id);
    this.setState({ showCard: false, selectedCard: this.emptyCard });
    this.props.onCardSelect(this.emptyCard);
  }

  handleCardClicked(key, card) {
    this.setState({
      selectedCard: {id: key, body: card},
      showCard: true
    });
    this.props.onCardSelect({id: key, body: card});
    this.deactivateTask(key);
  }

  deactivateTask(taskId) {
    this.props.firebase.gameTask(this.state.gamePin, taskId).child('active').set(
      false
    );
  }

  reactivateTask(taskId) {
    this.props.firebase.gameTask(this.state.gamePin, taskId).child('active').set(
      true
    );
  }

  setBackgroundColor(difficulty) {
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

  TaskCard = () => (
    <Card
      className="openedCard"
      style={{
        backgroundColor: this.setBackgroundColor(
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
      ((index+1) % 4 == 0) ? (
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
        {this.state.showCard ? <this.TaskCard/> : <this.GameBoard />}
      </div>
    );
  }
}
export default withFirebase(Cards);
