import { useDispatch } from 'react-redux';
import { fetchDataRequest, fetchHomesSuccess, fetchDataError, saveNewHome } from '../reducers/actions';


function useRequestMaker () {
  const dispatch = useDispatch();

  const getHomes = async () => {
    try {
      dispatch(fetchDataRequest())
      const response = await fetch('http://localhost:3001/homes');
      const homeData = await response.json();
      dispatch(fetchHomesSuccess(homeData));

    } catch (error) {
        dispatch(fetchDataError(error.message));
    }
  };

  const addNewHome = async (home) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(home)
      };

      const response = await fetch('/homes', options);
      const resData = await response.json();

      dispatch(saveNewHome());

    } catch (error) {
        dispatch(fetchDataError(error.message));
    }
  };

  return {
   getHomes,
   addNewHome 
  }
}

export default useRequestMaker;


