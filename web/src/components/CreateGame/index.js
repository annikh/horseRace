import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { Container, Button, Form, Row, Col, ListGroup} from 'react-bootstrap';
import axios from 'axios';
import shortid from 'shortid';

class CreateGame extends Component {
    constructor(props) {
      super(props);
      this.createGameForm = this.createGameForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addGame = this.addGame.bind(this);
      this.getGames = this.getGames.bind(this);
      this.getClassrooms = this.getClassrooms.bind(this);
      this.isValidPin = this.isValidPin.bind(this);

      this.state = {
        loading: false,
        games: [],
        classrooms: [],
        classroom_id: ""
      };
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
        console.log(games, classrooms)
        this.setState({
          games: games,
          classrooms: classrooms
        })
      }))
    }

    addGame() {
      let newGamePin = shortid.generate();
      while(!this.isValidPin(newGamePin)) {
        newGamePin = shortid.generate();
      }
      return axios.post('https://us-central1-horse-race-232509.cloudfunctions.net/addGame', { pin: newGamePin, classroom_id: this.state.classroom_id, user_id: this.state.user_id }).then((response) => {
        const games = Object.keys(response.data).map(key => ({
          ...response.data[key],
          id: key,
        }));
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
                  <Form.Control as="select" onChange={this.handleChange}>
                    {this.state.classrooms.map(classroom => (
                          <option value={classroom.key}>{classroom}</option>
                    ))}
                  </Form.Control>
                </Col>
                </Row>
                <Row>
                <Col>
                    <Button className="btn-orange" type="submit" block>Opprett spill!</Button>
                </Col>
                </Row>
            </Form>
        )
    }
    
    render() {
      const { games } = this.state;
      
      return (
        <AuthUserContext.Consumer>
          {authUser => (
            <Container className="accountBody">
              <Row>
                <Col>
                  <GameList games={games}/>
                </Col>
                <Col>
                  {this.createGameForm()}
                </Col>
              </Row>
            </Container>
          )}
        </AuthUserContext.Consumer>
      )
    }

}
const condition = authUser => !!authUser;

const GameList = ({ games }) => (
    <ListGroup variant="flush" style={{"width":"80%"}}>
      {games.map(game => (
        <ListGroup.Item style={{textAlign: "left"}} action variant="warning" pin={game.pin}>
          <Row>
            <strong>Pin:</strong> <span>{game.pin} </span>
          </Row>
          <Row>
            <strong>Dato:  </strong> {new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: '2-digit'}).format(game.date)}
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
);

export default withAuthorization(condition)(CreateGame);