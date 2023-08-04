import { useDispatch } from 'react-redux';
import { fetchDataError } from '../reducers/actions';


function useDistanceRequests () {
  const dispatch = useDispatch();
  const url = 'http://localhost:3001'



  const getTimeDistances = async (homes) => {
    try {
      

    } catch (error) {
      dispatch(fetchDataError(error.message));
    }
  };

  return {
   getTimeDistances
  }
}

export default useDistanceRequests;