
function useScheduleRequests () {
  const url = 'http://localhost:3001'

  const saveSchedule = async (schedule) => {
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
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
      const response = await fetch(`${url}/schedule`);
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