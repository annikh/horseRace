import React from "react";
import Navigation from "../Navigation";
import { withAuthentication } from "../Session";
import { Route } from "react-router-dom";
import Account from "../Account";
import TeacherHome from "../TeacherHome";
import TeacherGame from "../TeacherGame";
import * as ROUTES from "../../constants/routes";

const teacherURL = "/teacher";

const Teacher = () => (
  <div>
    <Navigation />
    <Route exact path={ROUTES.TEACHER} component={TeacherHome} />
    <Route path={teacherURL + ROUTES.ACCOUNT} component={Account} />
    <Route exact path={ROUTES.TEACHER + "/:game_pin"} component={TeacherGame} />
  </div>
);

export default withAuthentication(Teacher);
