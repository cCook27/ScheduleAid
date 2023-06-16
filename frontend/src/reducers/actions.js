
export const fetchHomesSuccess = (data) => {
  return {
    type: 'FETCH_HOMES_SUCCESS',
    payload: data
  }
};

export const fetchDataError = (error) => {
  return {
    type: 'FETCH_DATA_ERROR',
    payload: error
  }
};

export const saveNewHome = () => {
  return {
    type: 'SAVE_NEW_HOME'
  }
};


export const fetchDataRequest = () => {
  return {
    type: 'FETCH_DATA_REQUEST'
  }
};

