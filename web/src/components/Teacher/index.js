import React from 'react';
import Navigation from '../Navigation';
import { withAuthentication } from '../Session';
import { Route } from 'react-router-dom';
import Account from '../Account';
import CreateGame from '../CreateGame';
import Game from '../Game';
import * as ROUTES from '../../constants/routes';

const Teacher = ({match}) => (
  <div>
    <Navigation match={match}/>
    <Route exact path={match.url} component={CreateGame} />
    <Route path={`${match.url}${ROUTES.ACCOUNT}`} component={Account}/>
    <Route path={`${match.url}${ROUTES.GAME}`} component={Game}/>
  </div>
)

export default withAuthentication(Teacher);