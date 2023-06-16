import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchDataRequest, fetchHomesSuccess, fetchDataError } from '../reducers/actions';


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

  return {
   getHomes, 
  }
}

export default useRequestMaker;


