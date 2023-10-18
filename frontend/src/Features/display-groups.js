import React, {useContext} from "react";
import { GroupsContext } from "../context/context";

import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart }) => {
  const patientGroups = useContext(GroupsContext);

  return (
   <div className="row">
    {patientGroups.groups.map((group) => (
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