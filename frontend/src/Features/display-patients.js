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
      
        if(frequency !== eventsUsed.filter((event) => event.address === patient.address && event.title === patient.name).length) {
          return patient;
        }
      });
  
      setRemainingPatients(patientsRemaining);
    }
  
  },[myEvents, start])

  return (
    <div className="row">
      {homeStatus === 'loading' ? (
        <div><Loading /></div>
      ) : homeStatus === 'error' ? (
        <div>Error Loading Patients...</div>
      ) : !homes ? (
        <div className="col">
          <div>No Patients saved</div>     
        </div>
      ) : (
        remainingPatients.map((patient, index) => (
          patient ? 
              (
                <div key={patient._id} draggable className="col d-flex justify-content-end align-items-center" 
                onDragStart={() =>
                    handleDragStart(patient.name, patient.address, patient.coordinates, null, patient.frequency)
                  }>
                <div  className="card my-3">
                  <div className="card-body">
                    <div className="card-title">{patient.name}</div>
                  </div>
                </div>
              </div>
              ) : 
              (
                <div key={homes[index]._id} className="col d-flex justify-content-end align-items-center" >
                    <div  className="card my-3 used">
                      <div className="card-body">
                        <div className="card-title">{homes[index].name}</div>
                      </div>
                    </div>
                </div>
              )
              
              )
            )
          )
      }
    </div>
  )
}

export default DisplayPatients




