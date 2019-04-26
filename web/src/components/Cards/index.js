import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Button, ButtonGroup, Card, Row, Container } from "react-bootstrap";
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

    this.state = {
      cards: [],
      showCard: false,
      selectedCard: null,
      figure: "kanelbolle",
      solvedTasks: {},
      gameTeam: this.props.cookies.get("game_team"),
      gamePin: this.props.cookies.get("game_pin")
    };
  }

  componentDidMount() {
    this.props.firebase
      .gameTasks(this.state.gamePin)
      .once("value", snapshot => {
        const cards = snapshot.val();
        this.setState({
          cards: cards
        });
      });
    this.props.firebase
      .solvedGameTasks(this.state.gamePin, this.state.gameTeam)
      .on("value", snapshot => {
        const solvedTasks = snapshot.val();
        this.setState({
          solvedTasks: solvedTasks
        });
      });
  }

  /*componentWillUnmount() {
    this.props.firebase.gameTasks(this.state.gamePin).off();
    this.props.firebase
      .solvedGameTasks(this.state.gamePin, this.state.gameTeam)
      .off();
  }*/

  getBoard() {
    const { cards, solvedTasks } = this.state;
    let board = [];
    let row = [];
    Object.keys(cards).forEach((id, index) => {
      this.taskIsSolved(id, solvedTasks)
        ? row.push(
            <img key={index} src={solvedTasks[id].url} className="img" alt="" />
          )
        : row.push(
            <Button
              key={index}
              className="card"
              style={{
                backgroundColor: this.setCardColorByDiffictuly(
                  cards[id].difficulty
                )
              }}
              onClick={() => this.handleCardOpen(id, cards[id])}
            >
              {cards[id].title}
            </Button>
          );
      if ((index + 1) % 4 === 0) {
        board.push(<Row style={{ padding: "0px", margin: "0px" }}>{row}</Row>);
        row = [];
      }
    });
    return (
      <Container
        style={{ margin: "10px !important", padding: "0px !important" }}
      >
        {board}
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

  handleCardOpen(key, card) {
    console.log("handle open");
    this.setState({
      selectedCard: { id: key, body: card },
      showCard: true
    });
    this.props.onCardSelect({ id: key, body: card });
    this.deactivateTaskInDB(key);
  }

  deactivateTaskInDB(taskId, teamId) {
    this.props.firebase
      .gameTask(this.state.gamePin, taskId)
      .child("active")
      .set(false);
  }

  reactivateTaskInDB(taskId, teamId) {
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

  render() {
    const { cards, showCard, solvedTasks } = this.state;
    console.log("solved", solvedTasks);
    console.log("cards", cards);
    console.log("showCard", showCard);
    return (
      <span>
        {Object.keys(solvedTasks).length > 0 &&
        Object.keys(cards).length > 0 &&
        showCard ? (
          <this.OpenedCard />
        ) : (
          this.getBoard()
        )}
      </span>
    );
  }
}
export default withFirebase(Cards);
