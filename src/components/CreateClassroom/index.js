import React, { Component } from 'react';
import { withAuthorization } from '../Session';

class CreateClassroom extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        users: [],
      };
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
    
    render() {
      const { users, loading } = this.state;

      return (
        <div>
          <h1>Opprett et klasserom</h1>
          <p>Brukere: </p>
          {loading && <div>Loading ...</div>}

          <UserList users={users} />
        </div>
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