import React from 'react';
import './style.css';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';

const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div className="accountBody">
        {/* <h1>Account: {authUser.email}</h1> */}
        <h1>Account</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />

        <br/>
        <h1>Dine klasserom:</h1>
      </div>
  )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);