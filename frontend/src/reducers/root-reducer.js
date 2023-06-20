import { fetchHomesSuccess, fetchDataRequest, fetchDataError, saveNewHome } from './actions'

const initialState = {
  homes: [],
  loading: false,
  error: null,
  newHome: true,
  pair: [],
  pairsToTest: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_HOMES_SUCCESS':
      return {
        ...state,
        homes: action.payload,
        loading: false,
        newHome: false,
      };
    case fetchDataError:
      return {
        ...state,
        error: action.payload
      };
    case 'SAVE_NEW_HOME': 
      return {
        ...state,
        newHome: true,
      }
    case 'UPDATE_PAIR':
      return {
        ...state,
        pair: action.payload,
      }
    case 'FETCH_DATA_REQUEST':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

export default rootReducer;