import { useDispatch } from 'react-redux';
import { fetchDataError } from '../reducers/actions';


function useDistanceRequests () {
  const dispatch = useDispatch();
  const url = 'http://localhost:3001'



  const getTimeDistances = async (events) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(events)
      };

      const response = await fetch(`${url}/homes/distanceMatrix`, options);
      const scheduleViability = await response.json();

      return scheduleViability

    } catch (error) {
      dispatch(fetchDataError(error.message));
    }
  };

  return {
   getTimeDistances
  }
}

export default useDistanceRequests;