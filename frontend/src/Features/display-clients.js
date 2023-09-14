import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/display-homes.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from 'react-query';

import CreateClient from './create-client';
import useHomeRequests from '../hooks/home-requests';
import {UserContext, AccessTokenContext} from '../context/context';

function DisplayClients() {
  const queryClient = useQueryClient();

  const { isLoading } = useAuth0();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const { getHomes, removeClient } = useHomeRequests();

  const { data: homes, status } = useQuery('homes', 
    () => getHomes(user._id, accessToken)
  );

  const removeHome = useMutation({
    mutationFn: (id) => 
      removeClient(id, user._id, accessToken),
      
    onSuccess: () => {
      queryClient.invalidateQueries('homes');
    },
  });

  return (
    <div className="page-container">
      <div className='container-fluid'>
        <div className="row">

          <div className="col" style={{height: '100vh'}}>
            <div className="row">
              <div className="title d-flex justify-content-center">
                <h4>Create & Manage Your Clients</h4>
              </div>
              <div className="col">
                <CreateClient />
              </div>
            </div>
          </div>


          <div className="col-8 ps-5 pt-4">
            <div className="row">
              {isLoading ? (
                <div className="col">
                  <div>Loading...</div>     
                </div>
              ) : status === 'error' ? (
                <div className="col">
                  <div>Error loading data</div>
                </div>
              ) : !homes ? (
                <div className="col">
                  <div>No Current Clients</div>     
                </div>
              ): (
                homes.map(home => (
                  <div  key={home._id} className="col-3">
                    <div className="card m-2 shadow-lg" style={{width: '10rem', height: 'auto'}}>
                      <div className="card-body p-2">
                        <h5 className='text-center'>{home.name}</h5>
                        <div className='text-center'>
                          <p>{home.address}</p>
                          <p>{home.number}</p>
                        </div>
                        <div className="btn-container">
                          <button className="btn btn-primary my-2">
                            Edit
                          </button>
                          <button onClick={() => removeHome.mutate(home._id)} className="btn btn-danger mb-2">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayClients;




