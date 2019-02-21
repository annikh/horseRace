import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Student from './components/Student/Student';
import Teacher from './components/Teacher/Teacher';
import App from './components/App/App';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={App} />  {/* Remove exact if Title component should be displayed for all routes */}
            <Route exact path="/teacher" component={Teacher} />
            <Route exact path="/student" component={Student} />
        </div>
    </Router>,
    document.getElementById('root')
);