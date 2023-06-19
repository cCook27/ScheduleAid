import { useDispatch } from 'react-redux';
import { fetchDataRequest, fetchHomesSuccess, fetchDataError, saveNewHome } from '../reducers/actions';


function useRequestMaker () {
  const dispatch = useDispatch();
  const url = 'http://localhost:3001'

  const getHomes = async () => {
    try {
      dispatch(fetchDataRequest())
      const response = await fetch(`${url}/homes`);
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

      const response = await fetch(`${url}/homes`, options);
      const resData = await response.json();

      if(resData) {
        dispatch(saveNewHome());
      }

      
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


