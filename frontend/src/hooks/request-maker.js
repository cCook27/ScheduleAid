import { useDispatch } from 'react-redux';
import { fetchDataRequest, fetchHomesSuccess, fetchDataError, saveNewHome, updatePair } from '../reducers/actions';


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

  const getPairDistance = async (pair) => {
    try {
      let origin = pair.origin.address;
      let destination = pair.destination.address;

      const addressToString = (address) => {
        const { street, city, state, zip } = address;
        const addressComponents = [street, city, state, zip];
        return addressComponents.map(component => encodeURIComponent(component)).join(' ');
      }

      const encodedOrigin = addressToString(origin);
      const encodedDestination = addressToString(destination);

      const response = await fetch(`${url}/homes/distanceMatrix?origin=${encodedOrigin}&destination=${encodedDestination}`);

      const pairData = await response.json();

      console.log(pairData);

      dispatch(updatePair(pairData));


    } catch (error) {
      dispatch(fetchDataError(error.message));
    }
  }

  return {
   getHomes,
   addNewHome, 
   getPairDistance
  }
}

export default useRequestMaker;


