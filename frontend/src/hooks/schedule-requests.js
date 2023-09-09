import { useAuth0 } from "@auth0/auth0-react";

async function useScheduleRequests () {
  const url = 'http://localhost:8080';
  const { getAccessTokenSilently } = useAuth0();

  const accessToken = await getAccessTokenSilently({
    authorizationParams: {
      audience: `https://www.Home2Home-api.com`,
    },
  });

  const saveSchedule = async (schedule) => {
    try {
        const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
          body: JSON.stringify(schedule)
        };
  
        const response = await fetch(`${url}/schedule`, options);
        const data = await response.json();

    } catch (error) {
        console.log(error);
    }
  };

  const getSchedule = async () => {
    try {
      const response = await fetch(`${url}/schedule`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const scheduleData = await response.json();

      if(scheduleData === null) {
        return null;
      };

      return scheduleData;
      

    } catch (error) {
        console.log(error);
    }
  };

  
  const deleteSchedule = async () => {
    try {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
      };

      const response = await fetch(`${url}/schedule`, options); 

    } catch (error) {
        console.log(error);
    }
  };

  return {
   saveSchedule,
   getSchedule,
   deleteSchedule
  }
}

export default useScheduleRequests;