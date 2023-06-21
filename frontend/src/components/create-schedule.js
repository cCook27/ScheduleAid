

function CreateSchedule() {
  const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
    const timeSlots = [];
    let currentTime = new Date(startTime);

    while (currentTime <= endTime) {
      const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeSlots.push(formattedTime);

      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }

    return timeSlots;
  };

  const startTime = new Date();
  startTime.setHours(6, 0, 0); // Start time at 6:00 AM
  const endTime = new Date();
  endTime.setHours(20, 0, 0); // End time at 8:00 PM

  const timeSlots = generateTimeSlots(startTime, endTime, 15);
  return (
    <div>{timeSlots.map((time) => (
      <li>{time}</li>
    ))}</div>
  )
}

export default CreateSchedule;