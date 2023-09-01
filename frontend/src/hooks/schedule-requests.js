import { useAuth0 } from "@auth0/auth0-react";

function useScheduleRequests () {
  const url = 'http://localhost:8080';
  const { getAccessTokenSilently } = useAuth0();
  const domain = "dev-uhybzq8zwt4f7tgf.us.auth0.com";


  const saveSchedule = async (schedule) => {
    try {

      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });
     
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

      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });

      console.log(accessToken)
      
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
  }

  return {
   saveSchedule,
   getSchedule
  }
}

export default useScheduleRequests;