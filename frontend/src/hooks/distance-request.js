import { useAuth0 } from "@auth0/auth0-react";

async function useDistanceRequests () {
  const url = 'http://localhost:8080';
  const { getAccessTokenSilently } = useAuth0();

  const accessToken = await getAccessTokenSilently({
    authorizationParams: {
      audience: `https://www.Home2Home-api.com`,
    },
  });

  const getTimeDistances = async (events, token) => {
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

  return {
   getTimeDistances
  }
}

export default useDistanceRequests;