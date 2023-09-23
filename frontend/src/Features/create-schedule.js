import React, {useContext} from "react";

import useDistanceRequests from "../hooks/distance-request";
import {UserContext, AccessTokenContext} from '../context/context';

const CreateSchedule = () => {
  const { getRoutes } = useDistanceRequests();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const handleRoutes = () => {
    getRoutes(user._id, accessToken)
  }

  return(
    <div>
      <button onClick={handleRoutes}>Routes</button>
    </div>
  )
}

export default CreateSchedule