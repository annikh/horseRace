import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import {
  Button,
  ButtonGroup,
  Card
} from "react-bootstrap";
import "./style.css";

class Cards extends Component {

  emptyCard = {difficulty: 0, test: "", text: "", title: "", error_hint: ""}

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleCardClicked = this.handleCardClicked.bind(this);

    this.state = {
      cards: [],
      showCard: false,
      selectedCard: this.emptyCard
    };
  }

  componentDidMount() {
    const game_pin = this.props.cookies.get("game_pin");
    this.props.firebase.game(game_pin).on("value", snapshot => {
      this.setState({ cards: snapshot.val().tasks });
    });
  }

  handleClose() {
    this.setState({ showCard: false, selectedCard: this.emptyCard });
    this.props.onCardSelect({id: -1, body: this.emptyCard});
  }

  handleCardClicked(key, card) {
    this.setState({
      selectedCard: card,
      showCard: true
    });
    this.props.onCardSelect({id: key, body: card});
    //send kall for å sette oppgaven til disabled
  }

  setBackgroundColor(difficulty) {
    switch (difficulty) {
      case 1:
        return "#8DDA77";
      case 2:
        return "#F0EE8D";
      case 3:
        return "#E37171";
      default:
        return "#77ABDA";
    }
  }

  setGrid(cards) {
    let grid = [];
    let row = [];
    cards.forEach((card, i) => {
      row.push(
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
      );
      if ((i + 1) % 4 === 0) {
        let wrappedRow = [<ButtonGroup> {row}</ButtonGroup>];
        grid.push(wrappedRow);
        row = [];
        wrappedRow = [];
      }
    });
    return grid;
  }

  render() {
    return (
      <div>
        {this.state.showCard ? (
          <Card
            className="openedCard"
            style={{
              backgroundColor: this.setBackgroundColor(
                this.state.selectedCard.difficulty
              )
            }}>
            <Card.Body>
              <Card.Title>{this.state.selectedCard.title}</Card.Title>
              <Card.Text>{this.state.selectedCard.text}</Card.Text>
              <Button variant="info" onClick={this.handleClose} block>
                Lukk
              </Button>
            </Card.Body>
          </Card>
        ) : (
          this.setGrid(this.state.cards)
        )}
      </div>
    );
  }
}
export default withFirebase(Cards);
