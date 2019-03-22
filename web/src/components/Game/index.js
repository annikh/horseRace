import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Navbar,
  Form,
  FormControl,
  Nav,
  Modal,
  Card
} from "react-bootstrap";
import Editor from "../../components/Editor";
import "./style.css";

class Game extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleCardClicked = this.handleCardClicked.bind(this);

    this.state = {
      cards: [
        {
          difficulty: 1,
          solved: false,
          disabled: false,
          title: "Variabel 1",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 2,
          solved: false,
          disabled: false,
          title: "Variabel 2",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 1,
          solved: false,
          disabled: false,
          title: "Variabel 3",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 1,
          solved: false,
          disabled: false,
          title: "Variabel 4",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 1,
          solved: false,
          disabled: false,
          title: "Variabel 5",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 2,
          solved: false,
          disabled: false,
          title: "Variabel 6",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 3,
          solved: false,
          disabled: false,
          title: "Variabel 7",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 2,
          solved: false,
          disabled: false,
          title: "Variabel 8",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 3,
          solved: false,
          disabled: false,
          title: "Variabel 9",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 2,
          solved: false,
          disabled: false,
          title: "Variabel 10",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 3,
          solved: false,
          disabled: false,
          title: "Variabel 11",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 1,
          solved: false,
          disabled: false,
          title: "Variabel 12",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 2,
          solved: false,
          disabled: false,
          title: "Variabel 13",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 1,
          solved: false,
          disabled: false,
          title: "Variabel 14",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 2,
          solved: false,
          disabled: false,
          title: "Variabel 15",
          text: "I denne oppgaven skal du blablabl."
        },
        {
          difficulty: 1,
          solved: false,
          disabled: false,
          title: "Variabel 16",
          text: "I denne oppgaven skal du blablabl."
        }
      ],
      showCard: false,
      selectedCard: {
        title: "",
        text: ""
      }
    };
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
    return (
      <Container className="gameComponent">
        <Row>
          <Col>
            <Editor />
          </Col>
          {this.state.showCard ? (
            <Col>
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
            </Col>
          ) : (
            <Col>{this.setGrid(this.state.cards)}</Col>
          )}
        </Row>
      </Container>
    );
  }
}
export default Game;
