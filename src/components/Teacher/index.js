import React from 'react';
import Navigation from '../Navigation';
import Account from '../Account';
import App from '../App';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import CreateClassroom from '../CreateClassroom';
import { withAuthentication } from '../Session';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const Teacher = () => (
  <div>
    <Router>
      <div>
        <Navigation/>
        <Route path={ROUTES.CREATE_CLASSROOM} component={CreateClassroom} />
        <Route path={ROUTES.ACCOUNT} component={Account} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      </div>
    </Router> 
  </div>
)

export default withAuthentication(Teacher);