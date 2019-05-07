import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import parse from "html-react-parser";
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Row,
  Col
} from "react-bootstrap";
import * as COLORS from "../../constants/colors";
import "./style.css";

class Cards extends Component {
  constructor(props) {
    super(props);
    this.handleCardClose = this.handleCardClose.bind(this);
    this.handleCardOpen = this.handleCardOpen.bind(this);
    this.deactivateTaskInDB = this.deactivateTaskInDB.bind(this);
    this.reactivateTaskInDB = this.reactivateTaskInDB.bind(this);
    this.getBoard = this.getBoard.bind(this);
    this.getCardClass = this.getCardClass.bind(this);

    this.state = {
      cards: [],
      selectedCard: null,
      solvedTasks: {},
      gameTeam: this.props.cookies.get("game_team"),
      gamePin: this.props.cookies.get("game_pin"),
      playerName: this.props.cookies.get("game_name")
    };
  }

  componentDidMount() {
    this.props.firebase
      .gameTasks(this.state.gamePin, this.state.gameTeam)
      .on("value", snapshot => {
        const cards = snapshot.val();
        let solvedTasks = {};
        Object.keys(cards).forEach((cardKey, index) => {
          if (cards[cardKey].solved) {
            solvedTasks[cardKey] = cards[cardKey];
          }
          let card = { id: cardKey, boardIndex: index, body: cards[cardKey] };
          if (this.props.cookies.get("current_card") === cardKey) {
            this.handleCardOpen(card);
          }
        });
        this.setState({
          cards: cards,
          solvedTasks: solvedTasks
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase
      .gameTasks(this.state.gamePin, this.state.gameTeam)
      .off();
  }

  getCardClass(active, difficulty) {
    let classActive = active ? " card" : " card disabled";
    switch (difficulty) {
      case 1:
        return classActive + " easy";
      case 2:
        return classActive + " medium";
      case 3:
        return "hard " + classActive;
      default:
        return classActive;
    }
  }

  getBoard() {
    const { cards, solvedTasks } = this.state;
    let board = [];
    let row = [];
    Object.keys(cards).forEach((cardKey, index) => {
      cardKey in solvedTasks
        ? row.push(
            <img
              key={index}
              src={solvedTasks[cardKey].solved}
              className="img"
              alt=""
            />
          )
        : row.push(
            <Button
              key={index}
              className={this.getCardClass(
                cards[cardKey].active,
                cards[cardKey].difficulty
              )}
              onClick={() =>
                this.handleCardOpen({
                  id: cardKey,
                  boardIndex: index,
                  body: cards[cardKey]
                })
              }
            />
          );
      if ((index + 1) % 4 === 0) {
        board.push(
          <ButtonGroup key={index} className="boardRow">
            {row}
          </ButtonGroup>
        );
        row = [];
      }
    });
    return <>{board}</>;
  }

  handleCardClose() {
    this.props.cookies.remove("current_card");
    this.props.onCardSelect(null);
    this.reactivateTaskInDB(this.state.selectedCard.id);
    this.setState({ selectedCard: null });
  }

  handleCardOpen(card) {
    this.props.cookies.set("current_card", card.id);
    this.props.onCardSelect(card);
    this.deactivateTaskInDB(card.id);
    this.setState({
      selectedCard: card
    });
  }

  deactivateTaskInDB(taskId) {
    this.props.firebase
      .gameTask(this.state.gamePin, this.state.gameTeam, taskId)
      .child("active")
      .set(false);
  }

  reactivateTaskInDB(taskId) {
    this.props.firebase
      .gameTask(this.state.gamePin, this.state.gameTeam, taskId)
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
        <Card.Text>{parse(this.state.selectedCard.body.text)}</Card.Text>
        <Button variant="info" onClick={this.handleCardClose} block>
          Lukk
        </Button>
      </Card.Body>
    </Card>
  );

  render() {
    const { cards } = this.state;
    const cookieCardId = this.props.cookies.get("current_card");
    return (
      <>
        {Object.keys(cards).length > 0 &&
          (this.state.selectedCard !== null &&
          cookieCardId === this.state.selectedCard.id ? (
            <this.OpenedCard />
          ) : (
            this.getBoard()
          ))}
      </>
    );
  }
}
export default withFirebase(Cards);
