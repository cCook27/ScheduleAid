import React, {useState, useEffect} from "react";

import Loading from "../../pop-ups/loading";
import "../../css/display-groups.css"

import useComparisonRequests from "../../hooks/comparison-requests";

const VisitGroups = ({ handleDragStart, patientGroups, homes, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups }) => {

  const { abbrevationFix } = useComparisonRequests();

  const [groups, setGroups] = useState([]);
  const [currEv, setCurrEv] = useState([]);
  const additional = false;
 
  useEffect(() => {
    if(patientGroups) {
      const viewStart = new Date(start.setHours(0, 0, 0, 0)).getTime();
      const viewEnd = new Date(end.setHours(23, 59, 59, 999)).getTime();
      
      const currentEvents = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });

      setCurrEv(currentEvents);

      const updatedGroups = patientGroups.visitGroups.visits.map((group, index) => {
        const editGroup = group.map((patient) => {
          if(patient.additional) {
            patient.scheduled = true;
          }

          const frequency = parseInt(patient.frequency);
          const isScheduled = currentEvents.filter((event) => {
            const evAddress = abbrevationFix(event.address);
            const patAddress = abbrevationFix(patient.address);
            return evAddress === patAddress && `${patient.firstName} ${patient.lastName}` === event.title;
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

  const uniformAddress = (address) => {
    const newAddress = address.replace(/,/g, '');
    return newAddress;
  }

  const updateEvents = (event) => {
    const updatedEvents = [...myEvents];
    const index = updatedEvents.findIndex((ev) => ev.id === event.id);

    if(index !== -1) {
      updatedEvents[index] = event;

      handleEventsUpdate(updatedEvents);
    }
  };

  const checkForUnassigned = (patient) => {
    const unassignedEvents = currEv.filter((event) => {
      return uniformAddress(event.address) === uniformAddress(patient.address) && event.groupNumber !== 0 && (event.groupNumber === undefined || event.groupNumber === null)
    });

    return unassignedEvents.length > 0 ? true : false;
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
                <div className="col-3 d-flex flex-column group mx-3 my-2">
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
                    ) : checkForUnassigned(patient) ? 

                    (
                      (
                        <div className="col-6 d-flex patient-cont pat-cont-disabled" key={patient._id} >
                          <div className="patient-name ellipsis-overflow">
                            <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span>
                          </div>
                        </div>
                      )
                    ) :

                    (
                      <div className="col-6 d-flex patient-cont" key={patient._id} draggable onDragStart={() => handleDragStart(`${patient.firstName} ${patient.lastName}`, patient.address, patient.coordinates, index, additional)}>
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
      {
        patientGroups && patientGroups.visitGroups.visitOverflow.length > 0 ? 
        (
          <div className="overflow-group mb-3 p-3">
            <div className="overflow-group-des pb-2">Overflow:</div>
            <div className="d-flex">
              {
                patientGroups.visitGroups.visitOverflow.length > 0 ? 
                (
                  patientGroups.visitGroups.visitOverflow.map((flow) => (
                    <div className="d-flex patient-cont" key={flow._id} draggable onDragStart={() => handleDragStart(`${flow.firstName} ${flow.lastName}`, flow.address, flow.coordinates, flow, additional)}>
                    <div className="patient-name ellipsis-overflow">
                      <span className="me-1">{flow.firstName}</span> <span>{flow.lastName}</span>
                    </div>
                  </div>
                  ))
                ): null
              }
            </div>
            
          </div>
        ): null
      }
    </div>
  
  )
}

export default VisitGroups;