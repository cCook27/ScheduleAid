function useDistanceRequests () {
  const url = 'http://localhost:8080';

  const getTimeDistances = async (events, accessToken) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(events)
      };

      const response = await fetch(`${url}/homes/distanceMatrix`, options);
      const scheduleViability = await response.json();

      return scheduleViability

    } catch (error) {
      console.log(error)
    }
  };

  const getRoutes = async (userId, accessToken) => {
    try {
      const response = await fetch(`${url}/routing/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const routes = await response.json();
      
      return routes;
    
     
    } catch (error) {
      console.error('Error:', error);

      const errorResponse = {
        error: 'An error occurred while fetching user data',
        message: error.message 
      };

      return errorResponse;
    }
  };

  return {
   getTimeDistances,
   getRoutes
  }
}

export default useDistanceRequests;