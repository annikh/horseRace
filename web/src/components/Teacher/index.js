import React from "react";
import Navigation from "../Navigation";
import { withAuthentication } from "../Session";
import { Route } from "react-router-dom";
import Account from "../Account";
import TeacherGames from "../TeacherGames";
import TeacherGame from "../TeacherGame";
import TeacherClassrooms from "../TeacherClassrooms";
import * as ROUTES from "../../constants/routes";

const Teacher = () => (
  <div>
    <Navigation />
    <Route exact path={ROUTES.TEACHER_GAMES} component={TeacherGames} />
    <Route path={ROUTES.TEACHER_ACCOUNT} component={Account} />
    <Route
      exact
      path={ROUTES.TEACHER_CLASSROOMS}
      component={TeacherClassrooms}
    />
    <Route exact path={ROUTES.TEACHER + "/:game_pin"} component={TeacherGame} />
  </div>
);

export default withAuthentication(Teacher);
