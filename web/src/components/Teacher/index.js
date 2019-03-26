import React from "react";
import Navigation from "../Navigation";
import { withAuthentication } from "../Session";
import { Route } from "react-router-dom";
import Account from "../Account";
import CreateGame from "../CreateGame";
import * as ROUTES from "../../constants/routes";

const teacherURL = "/teacher";

const Teacher = () => (
  <div>
    <Navigation />
    <Route
      exact
      path={teacherURL + ROUTES.CREATE_GAME}
      component={CreateGame}
    />
    <Route path={teacherURL + ROUTES.ACCOUNT} component={Account} />
  </div>
);

export default withAuthentication(Teacher);
