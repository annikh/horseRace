import React from "react";
import Navigation from "../Navigation";
import { withAuthentication } from "../Session";
import { Route } from "react-router-dom";
import Account from "../Account";
import TeacherGames from "../TeacherGames";
import TeacherGame from "../TeacherGame";
import TeacherClassrooms from "../TeacherClassrooms";
import TeacherStudents from "../TeacherStudents";
import TeacherStudent from "../TeacherStudent";
import * as ROUTES from "../../constants/routes";

const Teacher = () => (
  <div>
    <Navigation />
    <Route exact path={ROUTES.TEACHER_GAMES} component={TeacherGames} />
    <Route exact path={ROUTES.TEACHER_ACCOUNT} component={Account} />
    <Route exact path={ROUTES.TEACHER} component={TeacherClassrooms} />
    <Route
      exact
      path={ROUTES.TEACHER_GAMES + "/:game_pin"}
      component={TeacherGame}
    />
    <Route exact path={ROUTES.TEACHER_STUDENTS} component={TeacherStudents} />
    <Route
      exact
      path={ROUTES.TEACHER_STUDENTS + "/:student"}
      component={TeacherStudent}
    />
  </div>
);

export default withAuthentication(Teacher);
