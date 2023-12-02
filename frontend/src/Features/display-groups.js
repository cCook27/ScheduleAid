import React, {useState, useEffect} from "react";

import Loading from "../pop-ups/loading";
import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes, patientGroups, doubleSessions, myEvents, start, end, handleEventsUpdate, handleGroupManual }) => {

  const [groups, setGroups] = useState([]);
 
  useEffect(() => {
    if(patientGroups) {
      const viewStart = new Date(start.setHours(0, 0, 0, 0)).getTime();
      const viewEnd = new Date(end.setHours(23, 59, 59, 999)).getTime();
      
      const currentEvents = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });

      const updatedGroups = patientGroups.map((group, index) => {
        const editGroup = group.map((patient) => {
          const frequency = parseInt(patient.frequency);
  
          const isScheduled = currentEvents.filter((event) => event.address === patient.address && event.title === patient.name);
  
          if(isScheduled.length === 0) {
            return patient;
          } else if(isScheduled.length === 2 && frequency === 2) {
            isScheduled.forEach((event) => {
              if(event.groupNumber === null) {
                event.groupNumber = index;
                updateEvents(event);
              }
            });
            return patient;
          };

          isScheduled.forEach((event) => {
            if(event.groupNumber === index) {
              patient.scheduled = 'done';
              return patient;
            } else if(event.groupNumber === null && patient.scheduled !== 'done') {
              const patientInfo = {name: patient.name, id: patient._id, address: patient.address, group: index}
              handleGroupManual(patientInfo);
            }
          });

          return patient;
        });
  
        return editGroup;
      });
  
      setGroups(updatedGroups)
      
     
    };
    
  }, [start, myEvents]);


  const updateEvents = (event) => {
    const updatedEvents = [...myEvents];
    const index = updatedEvents.findIndex((ev) => ev.id === event.id);

    if(index !== -1) {
      updatedEvents[index] = event;

      handleEventsUpdate(updatedEvents);
    }
  };

  return (
    <div className="container">
      <div className="row">
        {!homes ? 
        (
          <div className="col">
            <div>No Patients saved</div>     
          </div>
          ) : 
          
          !patientGroups ? 
          (
            <div><Loading /></div>
          ) : 
          
          (groups.length >= 1 && groups.length <= 7) ? 
          
          (
            groups.map((group, index) => (
              <div className="col-6 group">
                <div className="row">

                  {group.map((patient) => (
                    patient.scheduled === 'done' ? 
                    (
                      <div className="col-12" draggable onDragStart={() => handleDragStart(patient.name, patient.address, patient.coordinates, index, patient.frequency)}> 
                        <div key={patient._id} className="used">{patient.name}</div>
                      </div>
                    ) : 
                    
                    (
                      <div key={patient._id} draggable onDragStart={() => handleDragStart(patient.name, patient.address, patient.coordinates, index, patient.frequency)} className="col-12">
                        {patient.name}
                      </div>
                    )
                  ))}

                </div>
              </div>
            ))
          ) : 
          
          (
            patientGroups.map((patient) => (
              <div className="col-6 group">
                <div className="row">
                  <div draggable onDragStart={() => handleDragStart(patient.name, patient.address, patient.coordinates)} className="col-12">
                    {patient.name}
                  </div>
                </div>
              </div>
            ))
          )
        }
      </div>

      {doubleSessions && (
        <div className="row">
          {doubleSessions.map((session) => (
            <div className="col-4">{session.name}</div>
          ))}
        </div>
      )}

    </div>
   
  )
}

export default DisplayGroups;

// useEffect(() => {
//   if(patientGroups) {
//     const viewStart = new Date(start.setHours(0, 0, 0, 0)).getTime();
//     const viewEnd = new Date(end.setHours(23, 59, 59, 999)).getTime();
    
//     const currentEvents = myEvents.filter((event) => {
//       const eventStart = new Date(event.start).getTime();
//       return eventStart >= viewStart && eventStart <= viewEnd;
//     });

//     const duplicateDaysArr = findDuplicateDays(currentEvents);

//     const updatedGroups = patientGroups.map((group, index) => {
//       const editGroup = group.map((patient) => {
//         const frequency = parseInt(patient.frequency);

//         const isScheduled = currentEvents.filter((event) => event.address === patient.address && event.title === patient.name);

//         const duplicateDays = duplicateDaysArr.find((element) => {
//           return element.address === patient.address && element.name === patient.name;
//         });

//         if(isScheduled.length === 0) {
//           return patient;
//         } else if(isScheduled.length === frequency) {
//           patient.scheduled = 'done';
//           return patient;
//         }

//         isScheduled.forEach((event) => {
//           if(event.groupNumber === index) {
//             patient.scheduled = 'done';
//           } else if(duplicateDays) {
//             patient.scheduled = duplicateDays.days;
//           }
//         });

        
//         return patient;
//       });

//       return editGroup;
//     });

//     setGroups(updatedGroups)
    
   
//   };


  
// }, [start, myEvents]);







// : 
                    
//                     (patient.scheduled) ? 
                    
//                     (
//                       <div className="col-12" draggable onDragStart={() => handleDragStart(patient.name, patient.address, patient.coordinates, index, patient.frequency)}>
//                         {patient.name} {patient.scheduled.map((day, dayIndex) => (
//                           <span key={dayIndex}>
//                             <input
//                               type="checkbox"
//                             />
//                             {day}
//                           </span>
//                         ))}
//                       </div>
//                     ) 





// const findDuplicateDays = (currentEvents) => {
//   const frequentEvents = currentEvents.filter((event) => {
//     const frequency = parseInt(event.frequency);
//     return frequency > 1;
//   });

//   const uniqueArray = createUniqueSet(frequentEvents);

//   const duplicateDays = uniqueArray.map((event) => {
//     let days = [];
//     const matches = frequentEvents.filter((item) => item.address === event.address && !item.groupNumber);

//     matches.forEach((match) => {
//       const options = { weekday: 'short' };
//       const timeStamp = new Date(match.start);
//       const dayShorthand = new Intl.DateTimeFormat('en-US', options).format(timeStamp);

//       const doesExist = days.find((day) => {
//         return day === dayShorthand;
//       });

//       if (!doesExist) {
//         days.push(dayShorthand);
//       }
//     });

//     return {
//       name: event.title,
//       address: event.address,
//       days: days
//     }
//   });

//   return duplicateDays;
// }

// const createUniqueSet = (frequentEvents) => {
//   const uniqueSet = new Set();
//   const uniqueArray = frequentEvents.filter((item) => {
//     if (!uniqueSet.has(item.name)) {
//       uniqueSet.add(item.name);
//       return true;
//     }

//     return false;
//   });

//   return uniqueArray;
// };