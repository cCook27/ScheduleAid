import { useAuth0 } from "@auth0/auth0-react";

function useUserRequests () {
  const url = 'http://localhost:8080';
  const { getAccessTokenSilently } = useAuth0();

  const getUser = async (userId) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://www.Home2Home-api.com`,
          scope: "read:current_user",
        },
      });

      const response = await fetch(`${url}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const userData = await response.json();

      return userData;
    } catch (error) {
      console.error('Error:', error);

      const errorResponse = {
        error: 'An error occurred while fetching user data',
        message: error.message 
      };

      return errorResponse;
    }
  };

  const addUser = async (user) => {
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
        body: JSON.stringify(user)
      };

      const response = await fetch(`${url}/user`, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const userAdded = await response.json();

      return userAdded;
    } catch (error) {
      console.error('Error:', error);

      const errorResponse = {
        error: 'An error occurred while creating user data',
        message: error.message 
      };

      return errorResponse;
    }
  };

  return {
    getUser,
    addUser
  };
}

export default useUserRequests;


