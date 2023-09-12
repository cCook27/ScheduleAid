import { useAuth0 } from "@auth0/auth0-react";

function useScheduleRequests () {
  const url = 'http://localhost:8080';
  const { getAccessTokenSilently } = useAuth0();

  const saveUserSchedule = async (userId, schedule, accessToken) => {
    try {
        const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
          body: JSON.stringify(schedule)
        };
  
        const response = await fetch(`${url}/schedule/${userId}`, options);
        const data = await response.json();

    } catch (error) {
        console.log(error);
    }
  };

  const getUserSchedule = async (userId, token) => {
    try {
      const response = await fetch(`${url}/schedule/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
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

  
  const deleteSchedule = async (userId, accessToken) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
      };

      const response = await fetch(`${url}/schedule/${userId}`, options); 

    } catch (error) {
        console.log(error);
    }
  };

  return {
   saveUserSchedule,
   getUserSchedule,
   deleteSchedule
  }
}

export default useScheduleRequests;