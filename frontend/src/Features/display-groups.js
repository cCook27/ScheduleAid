import React, {useContext, useEffect} from "react";

import Loading from "../pop-ups/loading";


import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes, patientGroups, doubleSessions }) => {
 

  return (
    <div className="container">
      <div className="row">
        {!homes ? (
          <div className="col">
            <div>No Patients saved</div>     
          </div>
          ) : !patientGroups ? (
            <div><Loading /></div>
          ) : (patientGroups.length >= 1 && patientGroups.length <= 7) ? (
            patientGroups.map((group) => (
              <div className="col-6 group">
                <div className="row">
                  {group.map((patient) => (
                    <div draggable onDragStart={() => handleDragStart(patient.name, patient.address, patient.coordinates)} className="col-12">
                      {patient.name}
                    </div>
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

export default DisplayGroups