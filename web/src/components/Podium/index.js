import React, { Component } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import trophy from "../../constants/trophy.png";
import "./style.css";

class Podium extends Component {
  constructor(props) {
    super(props);
    this.getWinnerTeams = this.getWinnerTeams.bind(this);

    this.state = {
      teams: [],
      gamePin: this.props.cookies.get("game_pin")
    };
  }

  componentDidMount() {
    this.props.firebase
      .gameTeams(this.state.gamePin)
      .once("value", snapshot => {
        this.getWinnerTeams(snapshot.val());
      });
  }

  getWinnerTeams(teams) {
    teams.sort((a, b) => (a.points < b.points ? 1 : -1));
    this.setState({
      teams: teams
    });
  }

  getNames(team) {
    return (
      <div className="podiums">
        {Object.keys(this.state.teams[team].players).map((name, i) => (
          <div key={i}>{name}</div>
        ))}
      </div>
    );
  }

  render() {
    const show = this.state.teams.length > 0;
    return (
      show && (
        <Modal
          className="trophyModal"
          show={show}
          size="lg"
          onHide={this.props.handleExitOnGameOver}
        >
          <Modal.Header closeButton>
            <Modal.Title>~~ Gratulerer ~~</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <img className="trophy" alt="" src={trophy} />
                </Col>
              </Row>
              <Row className="podium">
                <Col className="podiums">
                  {this.getNames(1)}
                  <div className="podium1" />
                </Col>
                <Col className="podiums">
                  {this.getNames(0)}
                  <div className="podium0" />
                </Col>
                <Col className="podiums">
                  {this.state.teams.length > 2 && this.getNames(2)}
                  <div className="podium2" />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      )
    );
  }
}

export default withFirebase(Podium);
