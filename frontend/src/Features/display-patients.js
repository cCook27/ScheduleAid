import React from "react";

import Loading from "../pop-ups/loading";

import "../css/display-groups.css"

const DisplayPatients = ({ handleDragStart, homes, homeStatus }) => {
 

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
            homes.map(home => (
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




