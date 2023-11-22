import React, { useEffect, useState } from "react";

import Loading from "../pop-ups/loading";

import "../css/display-groups.css"

const DisplayPatients = ({ handleDragStart, homes, homeStatus, myEvents, start, end }) => {

  const [remainingHomes, setRemainingHomes]=useState([]);
 
  useEffect(() => {

    if(homes) {
      const viewStart = new Date(start).getTime();
      const viewEnd = new Date(end).getTime();
    
      const eventsUsed = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });
  
      const homesRemaining = homes.filter((home) => {
        const frequency = parseInt(home.frequency);
      
        return frequency !== eventsUsed.filter((event) => event.address === home.address).length;
      });
      
  
      setRemainingHomes(homesRemaining);
    }
    

  },[myEvents])

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
        remainingHomes.map(home => (
              <div key={home._id} draggable className="col d-flex justify-content-end align-items-center" 
                onDragStart={() =>
                    handleDragStart(home.name, home.address, home.coordinates)
                  }>
                <div  className="card my-3">
                  <div className="card-body">
                    <div className="card-title">{home.name}</div>
                  </div>
                </div>
              </div>
              )
            )
          )
      }
    </div>
  )
}

export default DisplayPatients




