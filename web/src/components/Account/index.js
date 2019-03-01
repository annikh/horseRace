import React, { Component } from 'react';
import { Col, Row, Container, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import './style.css';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    }
  }

  componentDidMount() {
    return axios.get('https://us-central1-horse-race-232509.cloudfunctions.net/getGames').then((response) => {

      const games = Object.keys(response.data).map(key => ({
        ...response.data[key],
        id: key,
      }));
      console.log("Account Component: ", games);
      this.setState({
        games: games
      })
    })
  }

  render() {
    const { games } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
        <Container className="accountBody">
          <Row>
            <Col>
              <Row>
                <h2>Innstillinger</h2>
              </Row>
              <Row>
                <PasswordChangeForm />
              </Row>
            </Col>
            <Col>
              <Row>
                <h2>Dine spill</h2>
              </Row>
              <Row>
                <GameList games={games}/>
              </Row>
              <Row>
                <Link to={ROUTES.TEACHER + ROUTES.CREATE_GAME} style={{ textDecoration: 'none' }}><Button className="btn-orange">Opprett et spill</Button></Link>
              </Row>
            </Col>
          </Row>
        </Container>
        )}
      </AuthUserContext.Consumer>
    )
  }
} 

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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);