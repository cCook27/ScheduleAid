
export const loadHomes = (data) => {
  return {
    type: 'LOAD_HOMES',
    payload: data
  }
};


export const loading = () => {
  return {
    type: 'LOADING'
  }
};