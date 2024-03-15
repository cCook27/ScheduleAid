import React, {useState, useEffect, useContext} from "react";

import Loading from "../../pop-ups/loading";
import AutoGroups from "./auto-grouping";

import useDistanceRequests from "../../hooks/distance-request";
import { UserContext } from "../../context/context";
import { AccessTokenContext } from "../../context/context";

import "../../css/display-groups.css"
import ManualGrouping from "./manual-grouping";


const DisplayGroups = ({ isOpen, openModal, handleDragStart, homes, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups, therapistParameters }) => {

  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const {createAutoGroups} = useDistanceRequests();

  const [patientGroups, setPatientGroups] = useState(undefined);
  const [groupType, setGroupType] = useState(undefined);

  useEffect(() => {
    handleVisitGroups({target:{id:'visits'}});
  }, []);

  const handleManualGroups = async (event) => {
    setGroupType(event.target.id);
  };

  const handleVisitGroups = async (event) => {
    setPatientGroups(undefined);

    const returnedGroups = await createAutoGroups(
      user._id, 
      accessToken, 
      therapistParameters
    );

    setPatientGroups(returnedGroups);
    setGroupType(event.target.id);
  };

  return (
    <div className="container">
      
      <div className="row views mb-3">
          <div className="col d-flex justify-content-center">
            <div className="btn-group" role="group" aria-label="Basic radio  toggle button group">
              
              <input type="radio" className="btn-check group-view-btn" name="visits" id="visits" 
              checked={groupType === "visits"}  onChange={handleVisitGroups}
              />
              <label className="view group-view left-rad" htmlFor="visits">Auto</label>

              <input type="radio" className="btn-check group-view-btn" name="manual" id="manual" checked={groupType === "manual"}  onChange={handleManualGroups} />
              <label className="view group-view right-rad" htmlFor="manual">Manual</label>
            </div>
          </div>
        </div>

      <div className="row">
        {
          groupType === 'visits' ? 
          (
            <AutoGroups handleDragStart={handleDragStart} patientGroups={patientGroups} homes={homes} myEvents={myEvents} start={start} end={end} handleEventsUpdate={handleEventsUpdate} handleUpdatedGroups={handleUpdatedGroups} />
          ):  
          (
            <ManualGrouping isOpen={isOpen} handleDragStart={handleDragStart} openModal={openModal} patients={homes} myEvents={myEvents} start={start} end={end} />
          )
        }
      </div>
     
    </div>
  )
 
}

export default DisplayGroups;
