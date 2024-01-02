import React, {useState, useEffect} from "react";

import Loading from "../pop-ups/loading";
import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes, patientGroups, doubleSessions, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups }) => {

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
          const isScheduled = currentEvents.filter((event) => {
            const evAddress = event.address.replace(/,/g, '');
            return evAddress === patient.address && event.title === `${patient.firstName} ${patient.lastName}`
          });

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

            if(schedEvent.groupNumber || schedEvent.groupNumber === 0) {
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
      <div className="row d-flex justify-content-center align-items-center">
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
          
            groups.length >= 1 && groups.length <= 7 ? 
            (
              groups.map((group, index) => (
                <div className="col d-flex flex-column group mx-3 my-2">
                  <div className="group-number">Group {index + 1}</div>
                  <div className="d-flex justify-content-center align-items-center row">

                {
                  group.map((patient) => (
                    patient.scheduled === true ? 

                    (
                      <div className="col-6 d-flex patient-cont used" key={patient._id} >
                        <div className="patient-name ellipsis-overflow">
                          <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span>
                        </div>
                      </div>
                    ) :

                    (
                      <div className="col-6 d-flex patient-cont" key={patient._id} draggable onDragStart={() => handleDragStart(`${patient.firstName} ${patient.lastName}`, patient.address, patient.coordinates, index)}>
                        <div className="patient-name ellipsis-overflow">
                          <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span>
                        </div>
                      </div>
                    )

                  ))
                }

                  </div>
                </div>
              ))
            ) :

            (
              <div>contrary</div>
            )
        }
      </div>
    </div>
  
  )
}

export default DisplayGroups;




