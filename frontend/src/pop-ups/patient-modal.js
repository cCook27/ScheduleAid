import React from "react";
import { useEffect, useState } from "react";

const PatientModal = ({client, removeFromCal, closeModal, groups, myEvents, handleEventsUpdate}) => {

  const [groupsAvailable, setGroupsAvailable] = useState([]);

  useEffect(() => {
    let availableGroups = [];

    groups.forEach((group, index) => {
      const patientMatches = group.filter((patient) => patient.address === client.address && `${patient.firstName} ${patient.lastName}` === client.title && !patient.scheduled);

      if(patientMatches.length > 0) {
        const groupsAvail = patientMatches.map((patient) => {
          patient.group = index;
          return patient;
        });

        groupsAvail.forEach((element) => {
          availableGroups.push(element);
        });
      }

    });

    setGroupsAvailable(availableGroups);
 
  }, [client, groups]);

  const handleAssignGroup = (group) => {
    const updatedEvents = [...myEvents];
    const index = updatedEvents.findIndex((ev) => ev.id === client.id);

    if(index !== -1) {
      updatedEvents[index].groupNumber = group;
      handleEventsUpdate(updatedEvents);
    }

    closeModal();
  }

  return(
    <div className="card" style={{width: "18rem", height: "300px"}}>
    <div className="p-0 card-body text-center">
      <h2>{client.title}</h2>
      <h6 className='text-start ps-2 pt-2'>Choose the Group this Patient Belongs to:</h6>
        {
          groupsAvailable.length > 0 ? (
            groupsAvailable.map((patient, index) => (
              <button key={index} onClick={() => handleAssignGroup(patient.group)} >{patient.group}</button>
            ))
          ): null
        }
      <p>
        Would you like to remove this client from {client.start}
      </p>
      <button className='m-2 remove' onClick={() => removeFromCal(client.id)}>Remove</button>
      <button className='m-2' onClick={closeModal}>Close</button>
    </div>
  </div>
  )
}

export default PatientModal;