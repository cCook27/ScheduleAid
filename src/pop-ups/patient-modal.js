import React from "react";
import { useEffect, useState } from "react";

import useComparisonRequests from "../hooks/comparison-requests";
import useScheduleRequests from "../hooks/schedule-requests";

import '../css/patient-modal.css';

const PatientModal = ({accessToken, userId, modalProps, closeModal}) => {

  const { abbrevationFix } = useComparisonRequests();
  const { deletePatientSchedule, saveUserSchedule } = useScheduleRequests();

  const [patient, setPatient] = useState(undefined);
  const [patientSeeDays, setPatientSeeDays] = useState(false);

  useEffect(() => {
    const clientAddress = abbrevationFix(modalProps.client.address);

    const patientData = modalProps.patients.find((patient) => {
      const patAddress = abbrevationFix(patient.address);
      return patAddress === clientAddress && `${patient.firstName} ${patient.lastName}` === modalProps.client.title;
    });

    setPatient(patientData);

  }, [modalProps.client, modalProps.groups, modalProps.patients]);

  useEffect(() => {
    if (patient) {
      const entries = Object.entries(patient.noSeeDays);
      for (let i = 0; i < entries.length; i++) {
        const [propertyName, propertyValue] = entries[i];
        if (propertyValue) {
          setPatientSeeDays(true);
          break;
        }
      }
    }
  }, [patient])

  const removeFromCal = async () => {
    const filteredState = modalProps.myEvents.filter((ev) => ev.id !== modalProps.client.id);
    await deletePatientSchedule(userId, filteredState, accessToken);
    closeModal()
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
          <div className="pat-start-modal d-flex justify-content-end">{modalProps.client.start}</div>
        </div>
      </div>

      <div className="row my-1">
        <div className="col">
          <div className="d-flex align-items-center justify-content-start pat-name-modal">
            {modalProps.client.title}
          </div>
        </div>
      </div>

   
      {
        patient &&  patientSeeDays ? 
          (
            <div className="row my-3">
              <div className="col-4">
                <div className="p-modal-label">Cannot be Seen:</div>
              </div>
              <div className="col d-flex align-items-center">
                {
                  Object.entries(patient.noSeeDays).map(([propertyName, propertyValue]) =>(
                  propertyValue && (
                    <div className="col-6 d-flex p-modal-badge me-1 badge" key={propertyName}>
                      {propertyName.toUpperCase()}
                    </div>
                  ) 
                  ))
                }
                
              </div>
            </div>
          ) : null
      }
        

      {
        patient ? 
        (
          <div>
            <div className="row my-3">
              <div className="col-4">
                <div className="p-modal-label">Primary Number:</div>
              </div>
              <div className="col">
                <div className="p-modal-label pat-modal-info">{patient.primaryNumber || 'NA'}</div>
              </div>
            </div>
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

      <div className="row my-2">
        <div className="col d-flex justify-content-center">
          <button 
            className='m-2 remove-cal btn' 
            onClick={removeFromCal}
          >
            Remove From Calendar
          </button>
        </div>
      </div>

    </div>
  )
}

export default PatientModal;
