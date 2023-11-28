import React, { useEffect, useState } from "react";

import Loading from "../pop-ups/loading";

import "../css/display-patients.css"

const DisplayPatients = ({ handleDragStart, homes, homeStatus, myEvents, start, end }) => {

  const [remainingHomes, setRemainingHomes]=useState([]);
 
  useEffect(() => {

    if(homes) {
      const viewStart = new Date(start).getTime();
      const viewEnd = new Date(end).getTime();

      const activePatients = homes.filter((home) => home.active);
      const fulfillAllFrequecies = activePatients.map((patient) => {
        const patientFrequency = patient.frequency;
        if(patientFrequency > 1) {
          let frequencyArray = [];
          for (let i = 0; i < patientFrequency; ++i) {
            frequencyArray.push(patient);
          }
          return frequencyArray;
        } else {
          return [patient];
        }
      });
      const visits = [].concat(...fulfillAllFrequecies).map((visit) => {
        return visit;
      });

      const duplicates = visits.filter((visit, index, arr) => arr.indexOf(visit) !== index)
    
      const eventsUsed = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });
  
      const homesRemaining = homes.map((home) => {
        const frequency = parseInt(home.frequency);
      
        if(frequency !== eventsUsed.filter((event) => event.address === home.address && event.title === home.name).length) {
          return home;
        }
      });
  
      setRemainingHomes(homesRemaining);
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
        remainingHomes.map((home, index) => (
              home ? (
                <div key={home._id} draggable className="col d-flex justify-content-end align-items-center" 
                onDragStart={() =>
                    handleDragStart(home.name, home.address, home.coordinates, null)
                  }>
                <div  className="card my-3">
                  <div className="card-body">
                    <div className="card-title">{home.name}</div>
                  </div>
                </div>
              </div>
              ) : (
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




