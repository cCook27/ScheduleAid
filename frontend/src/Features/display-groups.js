import React, {useState, useEffect} from "react";

import Loading from "../pop-ups/loading";
import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes, patientGroups, doubleSessions, myEvents, start, end, handleEventsUpdate, handleGroupManual }) => {

  const [groups, setGroups] = useState([]);
  const [groupingManual, setGroupingManual] = useState([]);
  
 
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
          } else if(isScheduled.length === 1 && frequency === 1) {
            isScheduled.forEach((event) => {
              if(event.groupNumber === null) {
                event.groupNumber = index;
                updateEvents(event);
              }
            });
            patient.scheduled = 'done';
            return patient;
          }

          isScheduled.forEach((event) => {
            if(event.groupNumber === index) {
              patient.scheduled = 'done';
              patient.groupNumber = index;
              return patient;
            } else if(event.groupNumber === null && patient.scheduled !== 'done') {
              const patientInfo = {name: patient.name, id: event.id, address: patient.address, group: index}
              setGroupingManual((prev) => [...prev, patientInfo]);
            }
          });

          return patient;
        });
  
        return editGroup;
      });
  
      setGroups(updatedGroups);
    };
    
  }, [start, myEvents]);

  useEffect(() => {
    const uniqueObjectsMap = new Map();

    groupingManual.forEach(obj => {
      uniqueObjectsMap.set(obj.group, obj);
    });

    const patientGrpNums = Array.from(uniqueObjectsMap.values());


    handleGroupManual(patientGrpNums);
    console.log(patientGrpNums);
  }, [groupingManual])


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

// else if(isScheduled.length === 2 && frequency === 2) {
//   isScheduled.forEach((event) => {
//     if(event.groupNumber === null) {
//       event.groupNumber = index;
//       updateEvents(event);
//     }
//   });
//   return patient;