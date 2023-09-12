import { useAuth0 } from "@auth0/auth0-react";


function useHomeRequests () {
 
  const url = 'http://localhost:8080';
  const { getAccessTokenSilently } = useAuth0();

  const getHomes = async (userId) => {
    try {

      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://www.Home2Home-api.com`,
          scope: "read:current_user",
        },
      });

      const response = await fetch(`${url}/homes/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const homeData = await response.json();
      
      return homeData;
    
     
    } catch (error) {
      console.error('Error:', error);

      const errorResponse = {
        error: 'An error occurred while fetching user data',
        message: error.message 
      };

      return errorResponse;
    }
  };

  const addNewHome = async (home, userId) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://www.Home2Home-api.com`,
          scope: "read:current_user",
        },
      });

      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(home)
      };

      const response = await fetch(`${url}/homes/${userId}`, options);
      const resData = await response.json();

      return resData;

      
    } catch (error) {
        console.log(error);
    }
  };

  const removeClient = async (homeId, userId) => {
    try {

      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://www.Home2Home-api.com`,
          scope: "read:current_user",
        },
      });

      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
      };

      const response = await fetch(`${url}/homes/${homeId}/${userId}`, options);
      const resData = await response.json();

      return resData;
      
    } catch (error) {
        console.log(error);
    }
  };

  return {
   getHomes,
   addNewHome, 
   removeClient,
  }
}

export default useHomeRequests;


