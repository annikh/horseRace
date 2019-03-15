import { ADD_GAME } from "../actions/types";

const initialState = {
  games: [],
  classrooms: [],
  currentGame: {}
};

function app(state = initialState, action) {
  switch (action.type) {
    case ADD_GAME:
      return { ...state }, { games: [...state.games, action.game] };
    default:
      return state;
  }
}

export default app;
