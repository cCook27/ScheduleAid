import React, {useContext, useEffect} from "react";

import Loading from "../pop-ups/loading";


import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes, patientGroups }) => {
 

  return (
   <div className="row">
    {!homes ? (
      <div className="col">
        <div>No Patients saved</div>     
      </div>
    ) : !patientGroups ? (
      <div><Loading /></div>
    ) : patientGroups.map((group) => (
        <div className="col-6 group">
          <div className="row">
            {group.map((patient) => (
              <div draggable onDragStart={() => handleDragStart(patient.name, patient.address)} className="col-12">
                {patient.name}
              </div>
            ))}
          </div>
        </div>
      ))}
   </div>
  )
}

export default DisplayGroups