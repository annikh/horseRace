import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';


class CreateClassroom extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        users: [],
        value: '',
      };

      this.createClassroomForm = this.createClassroomForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
      this.setState({ loading: true });

      this.props.firebase.users().on('value', snapshot => {
        const usersObject = snapshot.val();

        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
          }));

          this.setState({
          users: usersList,
          loading: false,
          });
        });
    }
    
    componentWillUnmount() {
      this.props.firebase.users().off();
    }

    handleSubmit(event) {
      //Send data til db, redirect til klasseromsoversikt
      alert("Klasserom opprettet!");
      event.preventDefault();
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    createClassroomForm = () => {
      const isInvalid = this.state.value === '';

      return (
        <Form onSubmit={this.handleSubmit}>
            <Form.Label><h2>Opprett et klasserom</h2></Form.Label>
            <Form.Label>Skriv inn fornavn på elevene i klassen din, skilles med linjeskift:</Form.Label>
            <Form.Control as="textarea" rows="3" placeholder={"Navn1\nNavn2\nNavn3"} value={this.state.value} onChange={this.handleChange}/>
            <Button disabled={isInvalid} className="btn-orange" type="submit">Opprett</Button>
        </Form>
      )
    }
    
    render() {
      const { users, loading } = this.state;

      return (
        <Container className="accountBody">
          <Row>
            <Col>
              {this.createClassroomForm()}
            </Col>
            <Col>
              <p>Brukere: </p>
              {loading && <div>Loading ...</div>}
              <UserList users={users} />
            </Col>
          </Row>
        </Container>
      )
    }

}
const condition = authUser => !!authUser;

const UserList = ({ users }) => (
    <ul>
      {users.map(user => (
        <li key={user.uid}>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
        </li>
      ))}
    </ul>
  );

  

export default withAuthorization(condition)(CreateClassroom);