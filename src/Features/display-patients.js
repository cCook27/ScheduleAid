import React, { useEffect, useState } from "react";

import Loading from "../pop-ups/loading";

import useComparisonRequests from "../hooks/comparison-requests";

import "../css/display-patients.css"

const DisplayPatients = ({ handleDragStart, homes, homeStatus, myEvents, start, end }) => {

  const { abbrevationFix } = useComparisonRequests();

  const [remainingPatients, setRemainingPatients]=useState([]);
 
  useEffect(() => {

    if(homes) {
      const viewStart = new Date(start.setHours(0, 0, 0, 0)).getTime();
      const viewEnd = new Date(end.setHours(23, 59, 59, 999)).getTime();

      const activePatients = homes.filter((home) => home.active);
      
      const eventsUsed = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });
  
      const patients = activePatients.map((patient) => {
        const patAddress = abbrevationFix(patient.address);
        const frequency = parseInt(patient.frequency);
        
        const patientsEvents =  eventsUsed.filter((event) => {
          const evAddress = abbrevationFix(event.address);

          return evAddress === patAddress && event.title === `${patient.firstName} ${patient.lastName}`
        });
      
        if(frequency > patientsEvents.length) {
          patient.additional = false;
          return patient;
        };
        
        if(frequency < patientsEvents.length || frequency === patientsEvents.length){
          patient.additional = true;
          return patient;
        };
      });
  
      setRemainingPatients(patients);
    }
  
  },[myEvents, start]);

 

  return (
    <div className="container">
      <div className="row patient-display">
        {
          homeStatus === 'loading' ? (
            <div><Loading /></div>
        ) : homeStatus === 'error' ? (
            <div>Error Loading Patients...</div>
        ) : !homes ? (
            <div className="col">
              <div>No Patients saved</div>     
            </div>
        ) : 
        (
          remainingPatients.map((patient) => 
            (   
              <div key={patient._id} className="col-4 d-flex justify-content-center align-items-center flex-column patient-card" >
                <div 
                  draggable 
                  onDragStart={() => handleDragStart(`${patient.firstName} ${patient.lastName}`, patient.address, patient.coordinates, patient.additional ? null : undefined, patient.additional)} 
                  className={`person-cont d-flex flex-column justify-content-center align-items-center ${patient.additional ? 'freq-fulfilled' : ''}`}
                >
                  <div className="name ellipsis-overflow"> <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span></div>
                  <div className="address ellipsis-overflow">{patient.address}</div>
                </div>
              </div>
            ) 
          )
        )
        }
      </div>
    </div>
    
  )
}

export default DisplayPatients

  