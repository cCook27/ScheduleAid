import React, {useState, useEffect} from "react";

import Loading from "../pop-ups/loading";


import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes, patientGroups, doubleSessions, myEvents, start, end }) => {

  const [groups, setGroups] = useState([]);
 
  useEffect(() => {

    if(patientGroups) {
   
      const viewStart = new Date(start).getTime();
      const viewEnd = new Date(end).getTime();

      const currentEvents = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });

      const updatedGroups = patientGroups.map((group, index) => {
        const editGroup = group.map((patient) => {
          const frequency = parseInt(patient.frequency);

          const isScheduled = currentEvents.filter((event) => event.address === patient.address);

          if(isScheduled.length === 0) {
            return patient;
          } else if(isScheduled.length === frequency) {
            patient.scheduled = 'done';
            return patient;
          }

          isScheduled.forEach((event) => {
            if(event.groupNumber === index) {
              patient.scheduled = 'done';
            } else if(event.groupNumber === null) {
              patient.scheduled = 'user-marks'
            }
          });

          
          return patient;
        });

        return editGroup;
      });

      setGroups(updatedGroups)
     
    };
    
  }, [start, myEvents]);

  const checkMark = (id, checkedGroup) => {
    const matchedPatient = homes.find((home) => {
      return home._id === id;
    });

    const frequency = parseInt(matchedPatient.frequency);

    let completedChecks = frequency;
    
    const viewStart = new Date(start).getTime();
    const viewEnd = new Date(end).getTime();

    const currentEvents = myEvents.filter((event) => {
      const eventStart = new Date(event.start).getTime();
      return eventStart >= viewStart && eventStart <= viewEnd;
    });

    const isScheduled = currentEvents.filter((event) => event.address === matchedPatient.address);
    
    const updatedGroups = groups.map((group, index) => {
      const editGroup = group.map((patient) => {
        if(patient._id !== id) {
          return patient;
        }

        if(patient._id === id && index === checkedGroup) {
          patient.scheduled = 'done';
        } else if(patient._id === id && index !== checkedGroup) {
          patient.scheduled = undefined;
        }

        return patient;
      });

      return editGroup;
    });

    setGroups(updatedGroups);
  }

  return (
    <div className="container">
      <div className="row">
        {!homes ? (
          <div className="col">
            <div>No Patients saved</div>     
          </div>
          ) : !patientGroups ? (
            <div><Loading /></div>
          ) : (groups.length >= 1 && groups.length <= 7) ? (
            groups.map((group, index) => (
              <div className="col-6 group">
                <div className="row">
                  {group.map((patient) => (
                    patient.scheduled === 'done' ? (
                      <div className="col-12">
                        <div key={patient._id} className="used">{patient.name}</div>
                      </div>
                    ) : (patient.scheduled === 'user-marks') ? (
                      <div className="col-12">
                        <div key={patient._id} onClick={() => checkMark(patient._id, index)}>{patient.name} check mark</div>
                      </div>
                    ) : (
                      <div key={patient._id} draggable onDragStart={() => handleDragStart(patient.name, patient.address, patient.coordinates, index)} className="col-12">
                        {patient.name}
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))
          ) : (
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
//     const viewStart = new Date(start).getTime();
//     const viewEnd = new Date(end).getTime();
    
//     const eventsUsed = myEvents.filter((event) => {
//       const eventStart = new Date(event.start).getTime();
//       return eventStart >= viewStart && eventStart <= viewEnd;
//     });

//     const updatedGroups = patientGroups.map((group, index) => {
//       const updateGroup = group.map((patient) => {

//         const findDuplicates = patientGroups.flat().filter((element) => {
//           return element.address === patient.address;
//         });

//         if(findDuplicates.length > 1) {
//           const addressMatch = eventsUsed.find((event) => {
//             return event.address === patient.address;
//           });
//           const numberMatch = eventsUsed.find((event) => {
//             return index === event.groupNumber;
//           })

//           if(addressMatch && numberMatch) {
//             patient.scheduled = 'done';
//           } else if(addressMatch) {
//               patient.scheduled = 'user-marks';
//           } else if(eventsUsed.length === 0) {
//               patient.scheduled = undefined;
//           }
//           return patient;
//         } 

//         const match = eventsUsed.filter((event) => event.address === patient.address);
//         const frequency = parseInt(patient.frequency);

//         if(match.length === frequency) {
//           patient.scheduled = 'done';
//         } else if(eventsUsed.length === 0) {
//           patient.scheduled = undefined;
//         }
//         return patient; 
//       });

//       return updateGroup;
//     });

//     setGroups(updatedGroups);
//   }
  

// }, [start, myEvents])