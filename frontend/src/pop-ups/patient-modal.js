import React from "react";
import { useEffect, useState } from "react";

import useComparisonRequests from "../hooks/comparison-requests";

import '../css/patient-modal.css';

const PatientModal = ({client, removeFromCal, closeModal, groups, myEvents, handleEventsUpdate, patients, view}) => {

  const { abbrevationFix } = useComparisonRequests();

  const [groupsAvailable, setGroupsAvailable] = useState([]);
  const [patient, setPatient] = useState(undefined);

  useEffect(() => {
    let availableGroups = [];
    const clientAddress = abbrevationFix(client.address);
   
    if(view === 'Group') {
      groups.forEach((group, index) => {
        const patientMatches = group.filter((patient) => {
          const patAddress = abbrevationFix(patient.address);
          return patAddress === clientAddress && `${patient.firstName} ${patient.lastName}` === client.title && !patient.scheduled
        });
  
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
    }

    const patientData = patients.find((patient) => {
      const patAddress = abbrevationFix(patient.address);
      return patAddress === clientAddress && `${patient.firstName} ${patient.lastName}` === client.title;
    });

    setPatient(patientData);

  }, [client, groups, patients]);

  const handleAssignGroup = (group) => {
    const updatedEvents = [...myEvents];
    const index = updatedEvents.findIndex((ev) => ev.id === client.id);

    if(index !== -1) {
      updatedEvents[index].groupNumber = group;
      handleEventsUpdate(updatedEvents);
    }

    closeModal();
  }

  return (
    <div className="container patient-modal">
      <div className="row">
        <div className="col py-2 p-modal-title-cont">
          <div className="p-modal-title">Manage this Event</div>
          <button onClick={closeModal} type="button" className="btn-close close-all close-p-notes me-1" aria-label="Close"></button>
        </div>
      </div>

      <div className="row my-1">
        <div className="col">
          <div className="pat-start-modal d-flex justify-content-end">{client.start}</div>
        </div>
      </div>

      <div className="row my-1">
        <div className="col">
          <div className="d-flex align-items-center justify-content-start pat-name-modal">
            {client.title}
          </div>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-4">
          <div className="p-modal-label">Cannot be Seen:</div>
        </div>
        <div className="col d-flex align-items-center">
          <div className="row">
            {
              patient ? 
                (
                  Object.entries(patient.noSeeDays).map(([propertyName, propertyValue]) =>(
                  propertyValue && (
                    <div className="col-6 d-flex p-modal-badge me-1 badge" key={propertyName}>
                      {propertyName.toUpperCase()}
                    </div>
                  ) 
                  ))
                ) : null
            }
          </div>
         
        </div>
      </div>

      {
        patient ? 
        (
          <div>
            <div className="row my-3">
              <div className="col-4">
                <div className="p-modal-label">Frequency:</div>
              </div>
              <div className="col">
                <div className="p-modal-label pat-modal-info">{patient.frequency}/week</div>
              </div>
            </div>
            <div className="row my-3">
              <div className="col-4">
                <div className="p-modal-label">Address:</div>
              </div>
              <div className="col">
                <div className="p-modal-label pat-modal-info">{patient.address}</div>
              </div>
            </div>
          </div>
          
        ):null
      }

      {
        view === 'Group' ? 
        (
          <div className="row p my-3 d-flex justify-content-center assign-row">
            <div className="col-4 d-flex align-items-center">
              <div className="p-modal-label ">Assign a Group for this Event:</div>
            </div>

            <div className="col d-flex align-items-center">
              <div className="row">
                {
                  groupsAvailable.length > 0 ? (
                    groupsAvailable.map((patient, index) => (
                      <div className="col-3">
                        <div className="d-flex align-items-center pb-1">
                          <button 
                            className="group-btn-modal btn mx-3 mt-2" 
                            key={index} 
                            onClick={() => handleAssignGroup(patient.group)} 
                          >
                            {patient.group + 1}
                          </button>
                        </div>
                        
                      </div>
                      
                    ))
                  ): null
                }
              </div>
            </div>

            
      </div>
        ): null
      }

      

      <div className="row my-2">
        <div className="col d-flex justify-content-center">
          <button 
            className='m-2 remove-cal btn' 
            onClick={() => removeFromCal(client.id)}
          >
            Remove From Calendar
          </button>
        </div>
      </div>

    </div>
  )
}

export default PatientModal;
