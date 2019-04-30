import React, { Component } from "react";
import { withFirebase } from "../Firebase";
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
      showCard: false,
      selectedCard: null,
      solvedTasks: {},
      gameTeam: this.props.cookies.get("game_team"),
      gamePin: this.props.cookies.get("game_pin")
    };
  }

  componentDidMount() {
    this.props.firebase
      .gameTasks(this.state.gamePin, this.state.gameTeam)
      .on("value", snapshot => {
        const cards = snapshot.val();
        let solvedTasks = {};
        Object.keys(cards).forEach(card => {
          if (cards[card].solved) {
            solvedTasks[card] = cards[card];
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
    Object.keys(cards).forEach((id, index) => {
      this.taskIsSolved(id, solvedTasks)
        ? row.push(
            <img
              key={index}
              src={solvedTasks[id].solved}
              className="img"
              alt=""
            />
          )
        : row.push(
            <Button
              key={index}
              className={this.getCardClass(
                cards[id].active,
                cards[id].difficulty
              )}
              onClick={() => this.handleCardOpen(id, cards[id], index)}
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
    return (
      <Container
        style={{ margin: "10px !important", padding: "0px !important" }}
      >
        <Row style={{ display: "inline-flex" }}>
          <Col>{board}</Col>
        </Row>
      </Container>
    );
  }

  taskIsSolved(taskId, solvedTasks) {
    return taskId in solvedTasks;
  }

  objectIsEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  handleCardClose() {
    this.reactivateTaskInDB(this.state.selectedCard.id);
    this.setState({ showCard: false });
    this.props.onCardSelect(this.state.selectedCard);
  }

  handleCardOpen(key, card, index) {
    this.props.onCardSelect({ id: key, body: card }, index);
    this.deactivateTaskInDB(key);
    this.setState({
      selectedCard: { id: key, body: card },
      showCard: true
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
        <Card.Text className="display-linebreak">
          {this.state.selectedCard.body.text}
        </Card.Text>
        <Button variant="info" onClick={this.handleCardClose} block>
          Lukk
        </Button>
      </Card.Body>
    </Card>
  );

  render() {
    const { cards } = this.state;
    return (
      <>
        {Object.keys(cards).length > 0 && this.props.showCard ? (
          <Container
            style={{ margin: "10px !important", padding: "0px !important" }}
          >
            <this.OpenedCard />
          </Container>
        ) : (
          this.getBoard()
        )}
      </>
    );
  }
}
export default withFirebase(Cards);
