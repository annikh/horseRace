import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Editor from "../Editor";
import Cards from "../Cards";
import "./style.css";

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      showCard: false,
      selectedCard: {
        title: "",
        text: ""
      }
    };
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
          <Cards cookies={this.props.cookies} />
        </Col>
      </Row>
      </Container>
    );
  }
}
export default withFirebase(Game);
