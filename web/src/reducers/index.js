import {
  ADD_GAME,
  ADD_CLASSROOM,
  FETCH_GAME_BY_ID,
  FETCH_CLASSROOMS_BY_TEACHER,
  FETCH_GAMES_BY_TEACHER
} from "../actions/types";

const initialState = {
  games: [],
  classrooms: [],
  currentGame: {}
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_GAME:
      return { ...state, games: [...state.games, action.game] };
    case ADD_CLASSROOM:
      return { ...state, classrooms: [...state.classrooms, action.classroom] };
    case FETCH_GAME_BY_ID:
      console.log("actiongame", action.game);
      return { ...state, currentGame: action.game };
    case FETCH_GAMES_BY_TEACHER:
      return { ...state, games: action.games };
    case FETCH_CLASSROOMS_BY_TEACHER:
      return { ...state, classrooms: action.classrooms };
    default:
      return state;
  }
}

export default rootReducer;
