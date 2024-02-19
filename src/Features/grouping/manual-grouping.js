import React, { useEffect, useContext } from "react";
import { useQuery } from 'react-query';

import useDistanceRequests from "../../hooks/distance-request";
import {UserContext, AccessTokenContext} from '../../context/context';

const ManualGrouping = ({ openModal, handleDragStart, patientGroups, homes, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups }) => {
  const { getGroupSet, retrieveGroupSets } = useDistanceRequests();
  // const { data: patient, status, refetch } = useQuery('patient', () => viewPatient(user._id, id, accessToken));
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const handleInitiateGrouping = () => {
    const initiateProps = {
      start: start
    }
    openModal('InitiateGroupingModal', initiateProps)
  };

  const handleViewGroupSet = async () => {
    const groupSets = await retrieveGroupSets(user._id, accessToken);
    
  };

  return (
    <div className="container">
      <div className="row top-row">
        <div className="col">
          <button onClick={handleViewGroupSet}>Select a Group Set</button>
        </div>
        <div className="col">
          <button onClick={handleInitiateGrouping}>Initiate Grouping</button>
        </div>
      </div>
      {}
    </div>
  )
};

export default ManualGrouping;