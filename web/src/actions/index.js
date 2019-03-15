import {
  ADD_GAME,
  FETCH_GAMES_BY_TEACHER,
  FETCH_CLASSROOMS_BY_TEACHER
} from "./types";
import axios from "axios";

const apiURL = "https://us-central1-horse-race-232509.cloudfunctions.net/";

export const addGame = ({ game }) => {
  return dispatch => {
    return axios
      .post(`${apiURL}/addGame`, game)
      .then(response => {
        dispatch(addGameSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};

export const addGameSuccess = game => {
  return {
    type: ADD_GAME,
    game
  };
};

export const fetchGamesByTeacher = userID => {
  return dispatch => {
    return axios
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
};

export const fetchGamesByTeacherSuccess = games => {
  return {
    type: FETCH_GAMES_BY_TEACHER,
    games
  };
};

export const fetchClassroomsByTeacher = userID => {
  return dispatch => {
    return axios
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
};

export const fetchClassroomsByTeacherSuccess = classrooms => {
  return {
    type: FETCH_CLASSROOMS_BY_TEACHER,
    classrooms
  };
};
