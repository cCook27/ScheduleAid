import React, { useEffect, useState } from "react";

import Loading from "../pop-ups/loading";

import "../css/display-patients.css"

const DisplayPatients = ({ handleDragStart, homes, homeStatus, myEvents, start, end }) => {

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
  
      const patientsRemaining = activePatients.map((patient) => {
        const frequency = parseInt(patient.frequency);
      
        if(frequency !== eventsUsed.filter((event) => event.address === patient.address && event.title === `${patient.firstName} ${patient.lastName}`).length) {
          return patient;
        }
      });
  
      setRemainingPatients(patientsRemaining);
    }
  
  },[myEvents, start]);

 

  return (
    <div className="container">
      <div className="row">
        <div className="col d-flex justify-content-center">
          <h4 className="title">Patients</h4>
        </div>
      </div>
      <div className="row patient-display">
      {homeStatus === 'loading' ? (
        <div><Loading /></div>
      ) : homeStatus === 'error' ? (
        <div>Error Loading Patients...</div>
      ) : !homes ? (
        <div className="col">
          <div>No Patients saved</div>     
        </div>
      ) : (
        remainingPatients.sort((a, b) => a.lastName - b.lastName).map((patient, index) => (
          patient ? 
              (
                <div key={patient._id} className="col-4 d-flex justify-content-center align-items-center flex-column patient-card" >
                  <div draggable onDragStart={() =>
                    handleDragStart(`${patient.firstName} ${patient.lastName}`, patient.address, patient.coordinates)} className="person-cont d-flex flex-column justify-content-center align-items-center">
                    <div className="name ellipsis-overflow"> <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span></div>
                    <div className="address ellipsis-overflow">{patient.address}</div>
                  </div>
                </div>
              ) : 
              (
                <div key={homes[index]._id} className="col-4 d-flex justify-content-center align-items-center flex-column patient-card" >
                  <div className="person-cont used d-flex flex-column justify-content-center align-items-center">
                    <div className="name ellipsis-overflow"><span className="me-1">{homes[index].firstName}</span> {homes[index].lastName}</div>
                    <div className="address ellipsis-overflow">{homes[index].address}</div>
                  </div>
                </div>
              )
              
              )
            )
          )
        }
      </div>
    </div>
    
  )
}

export default DisplayPatients




