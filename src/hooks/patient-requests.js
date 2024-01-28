function usePatientRequests () {
  const url = 'http://localhost:8080';

  const getPatients = async (userId, accessToken) => {
    try {
      const response = await fetch(`${url}/patients/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const patientData = await response.json();
     
      return patientData;
     
    } catch (error) {
      console.error('Error:', error);


      const errorResponse = {
        error: 'An error occurred while fetching user data',
        message: error.message
      };


      return errorResponse;
    }
  };

  const viewPatient = async (userId, patientId, accessToken) => {
    try {
      const response = await fetch(`${url}/patient/${userId}/${patientId}`, {
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

  const updatePatient = async (userId, patientInfo, accessToken) => {
    try {
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(patientInfo)
      };

      const response = await fetch(`${url}/updatePatient/${userId}`, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const patientUpdated = await response.json();

      return patientUpdated;

    } catch (error) {
      console.error('Error:', error);
      const errorResponse = {
        error: 'An error occurred while creating user data',
        message: error.message 
      };

      return errorResponse;
    }
  };

  const addNewPatient = async (home, userId, accessToken) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(home)
      };

      const response = await fetch(`${url}/patients/${userId}`, options);
      const resData = await response.json();

      return resData;

    } catch (error) {
        console.log(error);
    }
  };

  const removePatient = async (homeId, userId, accessToken) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
      };
      
      const response = await fetch(`${url}/patients/${homeId}/${userId}`, options);
      const resData = await response.json();

      return resData;
     
    } catch (error) {
        console.log(error);
    }
  };


  return {
   getPatients,
   viewPatient,
   updatePatient,
   addNewPatient,
   removePatient,
  }
}


export default usePatientRequests;
