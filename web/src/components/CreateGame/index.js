import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import firebase from '../Firebase';
import { Container, Button, Form, Row, Col, ListGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import shortid from 'shortid';

class CreateGame extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        games: [],
        classrooms: [],
        classroom_id: ""
      };

      this.createGameForm = this.createGameForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addGame = this.addGame.bind(this);
      this.getGame = this.getGame.bind(this);
      this.getClassrooms = this.getGame.bind(this);
    }

    getGames() {
        return axios.get('https://us-central1-horse-race-232509.cloudfunctions.net/getGames');
    }

    getClassrooms() {
        return axios.get('https://us-central1-horse-race-232509.cloudfunctions.net/getClassrooms');
    }
    
    componentDidMount() {
        axios.all([this.getGames(), this.getClassrooms()])
        .then(axios.spread(function (gamesRes, classroomsRes) {
            const games = Object.keys(gamesRes.data).map(key => ({
            ...gamesRes.data[key],
            id: key,
            }));
            const classrooms = Object.keys(classroomsRes.data).map(key => ({
            ...classroomsRes.data[key],
            id: key,
            }));
        console.log(games, classrooms);
        this.setState({
          games: games,
          classrooms: classrooms
        })
      }));
    }

    addGame() {
      let newGamePin = shortid.generate();
      while(!this.isValidPin(newGamePin)) {
        newGamePin = shortid.generate();
      }
      return axios.post('https://us-central1-horse-race-232509.cloudfunctions.net/addGame', { pin: newGamePin, classroom_id: this.state.game.classroom_id, user_id: firebase.auth().currentUser.uid }).then((response) => {
        const games = Object.keys(response.data).map(key => ({
          ...response.data[key],
          id: key,
        }));
        console.log(games);
        this.setState({
          games: games
        })
      })
    }

    isValidPin(pin) {
      for (var key in this.state.games) {
        console.log(this.state.games[key].pin)
        if (this.state.games[key].pin === pin) {
          return false;
        }
      }
      return true;
    }

    handleSubmit(event) {
      event.preventDefault();
      this.addGame();
      alert("Spill opprettet!");
    }

    handleChange(event) {
      this.setState({classroom_id: event.target.value});
    }

    createGameForm = () => {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                <Col>
                    <Form.Label><h2>Opprett et spill</h2></Form.Label>
                </Col>
                </Row>
                <Row>
                <Col>
                    <Form.Label>Velg hvilket klasserom som skal delta i spillet:</Form.Label>
                </Col>
                <Col>
                    <DropdownButton id="dropdown-basic-button">
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    </DropdownButton>;
                </Col>
                </Row>
                <Row>
                <Col>
                    <Form.Control as="textarea" rows="3" placeholder={"Navn1\nNavn2\nNavn3"} value={this.state.value} onChange={this.handleChange}/>
                </Col>
                </Row>
                <Row>
                <Col>
                    <Button className="btn-orange" type="submit" block>Opprett</Button>
                </Col>
                </Row>
            </Form>
        )
    }
    
    render() {
      const { games, classrooms, loading, value } = this.state;

      return (
        <Container className="accountBody">
          <Row>
            <Col>
              <h2>Dine spill</h2>
              {loading && <div>Loading ...</div>}
              <GameList games={games} />
            </Col>
            <Col>
              {this.createGameForm()}
            </Col>
          </Row>
        </Container>
      )
    }

}
const condition = authUser => !!authUser;

const ClassroomList = ({ classrooms }) => (
    <ListGroup  variant="flush">
      {classrooms.map(classroom => (
        <ListGroup.Item style={{textAlign: "left"}} action variant="warning" pin={classroom.pin}>
          <strong>Pin:</strong> {classroom.pin} 
        </ListGroup.Item>
      ))}
    </ListGroup>
);

const GameList = ({ games }) => (
    <ListGroup  variant="flush">
      {games.map(game => (
        <ListGroup.Item style={{textAlign: "left"}} action variant="warning" pin={game.pin}>
          <strong>Pin:</strong> {game.pin} 
        </ListGroup.Item>
      ))}
    </ListGroup>
);

export default withAuthorization(condition)(CreateGame);