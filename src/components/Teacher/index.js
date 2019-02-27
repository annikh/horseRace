import React from 'react';
import Navigation from '../Navigation';
import { withAuthentication } from '../Session';
import { Route } from 'react-router-dom';
import Account from '../Account';
import CreateClassroom from '../CreateClassroom';
import * as ROUTES from '../../constants/routes';

const Teacher = ({match}) => (
  <div>
    <Navigation match={match}/>
    <Route exact path={match.url} component={Account} />
    <Route path={`${match.url}${ROUTES.CREATE_CLASSROOM}`} component={CreateClassroom} />
  </div>
)

export default withAuthentication(Teacher);