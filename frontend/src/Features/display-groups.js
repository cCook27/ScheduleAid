import React, {useContext} from "react";
import { GroupsContext } from "../context/context";

import "../css/display-groups.css"

const DisplayGroups = () => {
  const patientGroups = useContext(GroupsContext);

  if(!patientGroups.groups) {
    return(
      <div>Hello</div>
    )
  }

  return (
   <div className="row">
    {patientGroups.groups.map((group) => (
      <div className="col-6 group">
        <div className="row">
          {group.map((patient) => (
            <div className="col-12">
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