import React, {useContext} from "react";
import { useQuery } from 'react-query';
import { useAuth0 } from "@auth0/auth0-react";

import useDistanceRequests from "../hooks/distance-request";
import useHomeRequests from "../hooks/home-requests";
import {UserContext, AccessTokenContext, GroupsContext} from '../context/context';
import "../css/create-schedule.css"

const CreateSchedule = () => {
  const { getRoutes } = useDistanceRequests();
  const { getHomes } = useHomeRequests();
  const { isLoading } = useAuth0();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const { groups, updateGroups } = useContext(GroupsContext);

  const { data: homes, status } = useQuery('homes', 
    () => getHomes(user._id, accessToken)
  );

  const handleRoutes = async () => {
    const returnedGroups = await getRoutes(user._id, accessToken);
    updateGroups(returnedGroups);
  }

  return(
    <div className="div">
      <button onClick={handleRoutes}>Routes</button>
    </div>
  )
}

export default CreateSchedule

