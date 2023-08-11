

const initialState = {
  homes: [],
  loading: false,
  error: null,
  newHome: true,
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
    case 'FETCH_DATA_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SAVE_NEW_HOME': 
      return {
        ...state,
        newHome: true,
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