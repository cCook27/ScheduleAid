import { useMutation } from "react-query";

function useHomeRequests () {
 
  const url = 'http://localhost:3001'

  const getHomes = async () => {
    try {
      const response = await fetch(`${url}/homes`);
      const homeData = await response.json();
      
      return homeData;

    } catch (error) {
        console.log(error);
    }
  };

  const addNewHome = async (home) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(home)
      };

      const response = await fetch(`${url}/homes`, options);
      const resData = await response.json();

      return resData;

      
    } catch (error) {
        console.log(error);
    }
  };

  const removeClient = async (id) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',},
      };

      const response = await fetch(`${url}/homes/${id}`, options);
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


