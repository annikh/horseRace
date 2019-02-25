import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Navigation from '../Navigation';

class Teacher extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      },
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <div>
        <Navigation authUser={this.state.authUser}/>
        <div className="App"><h1>Velkommen lærer!</h1></div>
      </div>
    );
  }
}

export default withFirebase(Teacher);