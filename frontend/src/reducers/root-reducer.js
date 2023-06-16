import { loadHomes, loading } from '../actions.actions'

const initialState = {
  homes: [],
  loading: false,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case loadHomes:
      return {
        ...state,
        homes: action.payload,
        loading: false
      };
    case loading:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

export default rootReducer;