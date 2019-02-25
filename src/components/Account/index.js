import React from 'react';
import './style.css';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const Account = () => (
  <div>
    <div className="accountBody">
      <h1>Account</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  </div>
);

export default Account;