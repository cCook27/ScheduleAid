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
  
      const userData = await response.json();
  
      return userData;

    } catch (error) {
      console.log(error);
    }
 
  };

  return {
    getUser
  }
}

export default useUserRequests;


