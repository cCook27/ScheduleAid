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
  const [groupType, setGroupType] = useState(null);

  const handleGeoGroups = async (event) => {
    const returnedGroups = await createGeoGroups(
      user._id, 
      accessToken, 
      therapistParameters
    );

    setPatientGroups(returnedGroups[0]);
    setGroupType(event.target.id);
  };

  const handleVisitGroups = async (event) => {
    setPatientGroups(null);

    const returnedGroups = await createVisitGroups(
      user._id, 
      accessToken, 
      therapistParameters
    );

    setPatientGroups(returnedGroups[0]);
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
              <label className="view group-view left-rad" htmlFor="visits">Visits</label>

              <input type="radio" className="btn-check group-view-btn" name="patients" id="patients" checked={groupType === "patients"}  onChange={handleGeoGroups} />
              <label className="view group-view right-rad" htmlFor="patients">Patients</label>
            </div>
          </div>
        </div>

      <div className="row">
        {
          groupType === 'visits' ? 
          (
            <VisitGroups handleDragStart={handleDragStart} patientGroups={patientGroups} homes={homes} myEvents={myEvents} start={start} end={end} handleEventsUpdate={handleEventsUpdate} handleUpdatedGroups={handleUpdatedGroups} />
          ): groupType === 'patients' ?
          (
            <GeoGroups handleDragStart={handleDragStart} patientGroups={patientGroups} homes={homes} myEvents={myEvents} start={start} end={end} handleEventsUpdate={handleEventsUpdate} handleUpdatedGroups={handleUpdatedGroups}/>
          ): 
          (
            <div className="d-flex flex-column group-explain p-4">
              <div className="d-flex">
                <p className="group-des"><span className="title p-0">Visits</span> will break your Active Patient list down into individual visits and group them based on geographic location. This means that if Jane Doe must be seen twice a week she will be appear in 2 different geogrpahic groups.</p>
              </div>
              <div className="d-flex">
                <p className="group-des"><span className="title p-0">Patients</span> groups all of your patients based on geogrpahic location.</p>
              </div>
            </div>
          )
        }
      </div>
     
    </div>
  )
 
}

export default DisplayGroups;




