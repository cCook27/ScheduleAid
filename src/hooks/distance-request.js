function useDistanceRequests () {
  const url = 'http://localhost:8080';

  const getTimeDistances = async (events, accessToken) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(events)
      };

      const response = await fetch(`${url}/patients/distanceMatrix`, options);
      const scheduleViability = await response.json();

      return scheduleViability

    } catch (error) {
      console.log(error)
    }
  };

  const createAutoGroups = async (userId, accessToken, therapistParameters) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(therapistParameters)
      }
      const response = await fetch(`${url}/grouping/auto/${userId}`, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const groupData = await response.json();

      return groupData;
         
    } catch (error) {
      console.error('Error:', error);

      const errorResponse = {
        error: 'An error occurred while creating user data',
        message: error.message 
      };

      return errorResponse;
    }
  };

  const checkGroups = async (userId, accessToken) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
      };

      const response = await fetch(`${url}/checkGroups/${userId}`, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      };

      const groupData = await response.json();

      return groupData;

    } catch (error) {
      console.error('Error:', error);

      const errorResponse = {
        error: 'An error occurred while fetching user data',
        message: error.message 
      };

      return errorResponse;
    }
  };

  const saveGroupSet = async (userId, accessToken, groupSet) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(groupSet)
      };

      const response = await fetch(`${url}/grouping/saveGroupSet/${userId}`, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const groupSetOk = await response.json();

      return groupSetOk;

    } catch (error) {
      console.log(error);
      return errorResponse;
    }
  };

  const retrieveGroupSet = async (userId, accessToken, setId) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({setId: setId})
      };

      const response = await fetch(`${url}/grouping/retrieveGroupSet/${userId}`, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const groupSet = await response.json();

      return groupSet;

    } catch (error) {
      console.log(error);
      return errorResponse;
    }
  };

  return {
    getTimeDistances,
    createAutoGroups,
    checkGroups,
    saveGroupSet,
    retrieveGroupSet,
  }
}

export default useDistanceRequests;