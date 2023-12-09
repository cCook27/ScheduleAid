import React, {useState, useEffect} from "react";

import Loading from "../pop-ups/loading";
import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes, patientGroups, doubleSessions, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups }) => {

  const [groups, setGroups] = useState([]);
  // const [groupingManual, setGroupingManual] = useState([]);
  
 
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
            patient.scheduled = false;
            return patient;
          };

          if(isScheduled.length === 1 && frequency === 1) {
            let schedEvent = isScheduled[0];

            if(schedEvent.groupNumber === undefined) {
              schedEvent.groupNumber = index;
              updateEvents(schedEvent);
            };

            if(schedEvent.groupNumber) {
              patient.scheduled = true;
              return patient;
            };
          };

          if(isScheduled.length > 0) {
            const hasGroupNum = isScheduled.filter((ev) => ev.groupNumber === index);

            if(hasGroupNum.length === 0) {
              patient.scheduled = false;
              return patient;
            }

            if(hasGroupNum.length === 1) {
              patient.scheduled = true;
              return patient;
            }
          };

          return patient;
        });
  
        return editGroup;
      });
  
      setGroups(updatedGroups);
      handleUpdatedGroups(updatedGroups);
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
                    patient.scheduled === true ? 
                    (
                      <div className="col-12"> 
                        <div key={patient._id} className="used">{patient.name}</div>
                      </div>
                    ) : 
                    
                    (
                      <div key={patient._id} draggable onDragStart={() => handleDragStart(patient.name, patient.address, patient.coordinates, index)} className="col-12">
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

// if(isScheduled.length > 0) {
//   const hasGroupNum = isScheduled.filter((ev) => ev.groupNumber === index);
//   const noGroupNum = isScheduled.filter((ev) => ev.groupNumber !== index);

//   if(hasGroupNum.length === frequency - 1 && noGroupNum.length === 1) {
//     let schedEvent = noGroupNum[0];
//     schedEvent.groupNumber = index;
//     updateEvents(schedEvent);
//     return patient;
//   };

//   if(hasGroupNum.length === 0) {
//     patient.scheduled = false;
//     return patient;
//   };

//   if(hasGroupNum.length === 1) {
//     patient.scheduled = true;
//     return patient;
//   };
// };