import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Student from './components/Student';
import Teacher from './components/Teacher'; 
import App from './components/App';
import SignUpPage from './components/SignUp';
import SignInPage from './components/SignIn';
import PasswordForgetPage from './components/PasswordForget';
import Firebase, {FirebaseContext} from './components/Firebase';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as ROUTES from './constants/routes';

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <Router>
        <div>
            <Route exact path={ROUTES.LANDING} component={App} /> 
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.STUDENT} component={Student} />
            <Route path={ROUTES.TEACHER} component={Teacher} />
        </div>
        </Router>
    </FirebaseContext.Provider>
    ,
    document.getElementById('root')
);