function useScheduleRequests () {
  const url = 'http://localhost:8080';

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

  const getUserSchedule = async (userId, accessToken) => {
    try {
      const response = await fetch(`${url}/schedule/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const scheduleData = await response.json();

      if(scheduleData === null) {
        return null;
      };

      console.log(scheduleData);

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
      const data = await response.json();

    } catch (error) {
        console.log(error);
    }
  };

  const deletePatientSchedule = async (userId, schedule, accessToken) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify(schedule)
      };

      const response = await fetch(`${url}/schedule/patient/${userId}`, options); 
      const data = await response.json();

    } catch (error) {
        console.log(error);
    }
  };

  return {
   saveUserSchedule,
   getUserSchedule,
   deleteSchedule,
   deletePatientSchedule
  }
}

export default useScheduleRequests;