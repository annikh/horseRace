import {
  ADD_GAME,
  ADD_CLASSROOM,
  FETCH_GAMES_BY_TEACHER,
  FETCH_CLASSROOMS_BY_TEACHER
} from "./types";
import axios from "axios";

const apiURL = "https://us-central1-horse-race-232509.cloudfunctions.net/";

export function addGame(game) {
  return dispatch => {
    axios
      .post(`${apiURL}/addGame`, game)
      .then(response => {
        dispatch(addGameSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

const addGameSuccess = game => {
  return {
    type: ADD_GAME,
    game
  };
};

export function addClassroom(classroom) {
  return dispatch => {
    axios
      .post(`${apiURL}/addClassroom`, classroom)
      .then(response => {
        dispatch(addClassroomSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

const addClassroomSuccess = classroom => {
  return {
    type: ADD_CLASSROOM,
    classroom
  };
};

export function fetchGamesByTeacher(userID) {
  return dispatch => {
    axios
      .get(`${apiURL}/getGamesForTeacherFromDatabase`, {
        params: { user_id: userID }
      })
      .then(response => {
        dispatch(fetchGamesByTeacherSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

const fetchGamesByTeacherSuccess = games => {
  return {
    type: FETCH_GAMES_BY_TEACHER,
    games
  };
};

export function fetchClassroomsByTeacher(userID) {
  return function(dispatch) {
    axios
      .get(`${apiURL}/getClassroomsForTeacherFromDatabase`, {
        params: { user_id: userID }
      })
      .then(response => {
        dispatch(fetchClassroomsByTeacherSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

const fetchClassroomsByTeacherSuccess = classrooms => {
  return {
    type: FETCH_CLASSROOMS_BY_TEACHER,
    classrooms
  };
};
