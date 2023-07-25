import { useDispatch } from 'react-redux';
import { fetchDataRequest, fetchHomesSuccess, fetchDataError, saveNewHome, updateCurrentSchedule } from '../reducers/actions';


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

  const getTimeDistances = async (homes) => {
    try {
      let timeDistances = [];

      for (let i = 0; i < homes.length -1; i++) {
        const origin = homes[i].address;
        const destination = homes[i+1].address;

        const addressToString = (address) => {
          const { street, city, state, zip } = address;
          const addressComponents = [street, city, state, zip];
          return addressComponents.map(component => encodeURIComponent(component)).join(' ');
        };

        const encodedOrigin = addressToString(origin);
        const encodedDestination = addressToString(destination);

        const response = await fetch(`${url}/homes/distanceMatrix?origin=${encodedOrigin}&destination=${encodedDestination}`);

        const distData = await response.json();

        timeDistances.push(distData);
      };


      dispatch(updateCurrentSchedule(timeDistances));

    } catch (error) {
      dispatch(fetchDataError(error.message));
    }
  };

  return {
   getHomes,
   addNewHome, 
   getTimeDistances
  }
}

export default useRequestMaker;


// let origin = pair.origin.address;
//       let destination = pair.destination.address;

      // const addressToString = (address) => {
      //   const { street, city, state, zip } = address;
      //   const addressComponents = [street, city, state, zip];
      //   return addressComponents.map(component => encodeURIComponent(component)).join(' ');
      // }

      // const encodedOrigin = addressToString(origin);
      // const encodedDestination = addressToString(destination);

//       const response = await fetch(`${url}/homes/distanceMatrix?origin=${encodedOrigin}&destination=${encodedDestination}`);

//       const pairData = await response.json();

//       dispatch(updatePair(pairData));