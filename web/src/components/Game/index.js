import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Card
} from "react-bootstrap";
import Editor from "../Editor";
import "./style.css";

class Game extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleCardClicked = this.handleCardClicked.bind(this);

    this.state = {
      cards: [],
      showCard: false,
      selectedCard: {
        title: "",
        text: ""
      }
    };
  }

  componentDidMount() {
    const game_pin = this.props.cookies.get("game_pin");
    this.props.firebase.game(game_pin).on("value", snapshot => {
      this.setState({ cards: snapshot.val().tasks });
    });
  }

  handleClose() {
    this.setState({ showCard: false, selectedCard: {} });
    //Send kall på å sette oppgaven til enabled
  }

  handleCardClicked(card) {
    this.setState({
      selectedCard: card,
      showCard: true
    });
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
          onClick={() => this.handleCardClicked(card)}
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

  solveTask(solutionCode) {
    //Sjekk mot redux store currentGame -> Tasks -> lik ID -> solutionCode
    //hvis lik =>    legg til oppgave til bruker
    //               disable oppgaven for spillet = bytt ut oppgaven med del av bilde
  }

  render() {
    console.log(this.props.game);
    return (
      <Container className="gameComponent">
      <Row>
        <Col style={{justifyContent: "left"}}>
          <Editor />
        </Col>
        <Col>
          {this.state.showCard ? (
              <Card
                className="openedCard"
                style={{
                  backgroundColor: this.setBackgroundColor(
                    this.state.selectedCard.difficulty
                  )
                }}
              >
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
        </Col>
        </Row>
      </Container>
    );
  }
}
export default withFirebase(Game);
