import React, {useContext, useEffect} from "react";
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { UserContext, AccessTokenContext } from '../context/context';
import useDistanceRequests from "../hooks/distance-request";

import Loading from "../pop-ups/loading";


import "../css/display-groups.css"

const DisplayGroups = ({ handleDragStart, homes }) => {
  const queryClient = useQueryClient();

  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const {getGroups} = useDistanceRequests();

  const { data: groups, status } = useQuery(['groups'],
    () => getGroups(user._id, accessToken)
  );

  useEffect(() => {
    console.log(groups);
  }, [groups])

  return (
   <div className="row">
    {status === 'loading' ? (
      <div><Loading /></div>
    ) : status === 'error' ? (
      <div>Error Loading Patients...</div>
    ) : !homes ? (
      <div className="col">
        <div>No Patients saved</div>     
      </div>
    ) : !groups ? (
      <div><Loading /></div>
    ) : groups.map((group) => (
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