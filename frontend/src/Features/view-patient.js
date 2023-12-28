import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';


import useHomeRequests from '../hooks/home-requests';
import {UserContext, AccessTokenContext} from '../context/context';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../pop-ups/loading";

const ViewPatient = () => {
  const queryClient = useQueryClient();


  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const { isLoading } = useAuth0();


  const {viewPatient} = useHomeRequests();


  const { id } = useParams();


  const { data: patient, status } = useQuery('patient',
    () => viewPatient(user._id, id, accessToken)
  );


  return (
    <div className="container">
      {
        isLoading ? (
          <div><Loading /></div>
        ) :
        !patient ? (
          <div>
            Patient not found
          </div>
        ) :
        patient ? (
          <div>{patient.address}</div>
        ) : null
      }
    </div>
  )
}


export default ViewPatient;
