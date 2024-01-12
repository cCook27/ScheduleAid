import React, {useState, useEffect, useContext} from "react";

import Loading from "../../pop-ups/loading";
import VisitGroups from "./visit-grouping";
import GeoGroups from "./geo-groups";

import useDistanceRequests from "../../hooks/distance-request";
import { UserContext } from "../../context/context";
import { AccessTokenContext } from "../../context/context";

import "../../css/display-groups.css"


const DisplayGroups = ({ handleDragStart, homes, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups, therapistParameters }) => {

  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const {createVisitGroups, createGeoGroups} = useDistanceRequests();

  const [patientGroups, setPatientGroups] = useState(undefined);
  const [groupType, setGroupType] = useState({
    visit: false,
    patient: false
  });

  const handleGeoGroups = async () => {
    setGroupType((prev) => ({
      ...prev,
      visit: false,
      patient: true
    }));
  };

  const handleVisitGroups = async () => {
    setPatientGroups(null);

    const returnedGroups = await createVisitGroups(
      user._id, 
      accessToken, 
      therapistParameters
    );

    setPatientGroups(returnedGroups[0]);
    setGroupType((prev) => ({
      ...prev,
      visit: true,
      patient: false
    }));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div>Would you like to break your patients into geographic groups?</div>
        </div>
        <div className="col">
          <button onClick={handleGeoGroups}>Go</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div>Would you like to break each visit into geographic groups corresponding to a day?</div>
        </div>
        <div className="col">
          <button onClick={handleVisitGroups}>Go</button>
        </div>
      </div>


      <div className="row">
        {
          groupType.visit ? 
          (
            <VisitGroups handleDragStart={handleDragStart} patientGroups={patientGroups} homes={homes} myEvents={myEvents} start={start} end={end} handleEventsUpdate={handleEventsUpdate} handleUpdatedGroups={handleUpdatedGroups} />
          ):
          (
            <GeoGroups />
          )
        }
      </div>
     
    </div>
  )
 
}

export default DisplayGroups;




