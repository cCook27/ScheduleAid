import React, { useContext, useEffect } from 'react';
import CreateClient from './create-client';
import useHomeRequests from '../hooks/home-requests';
import UserContext from '../context/context';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/display-homes.css';
import { useMutation, useQuery, useQueryClient } from 'react-query';

function DisplayClients() {
  const queryClient = useQueryClient();

  const user = useContext(UserContext)

  const { getHomes, removeClient } = useHomeRequests();

  const { data: homes, status } = useQuery('homes', getHomes);

  const removeHome = useMutation({
    mutationFn: (id) => 
      removeClient(id),
      
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
              {status === 'loading'  ? (
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
                  <div key={home._id} className="col-3">
                    <div className="card m-2 shadow-lg" style={{width: '10rem', height: 'auto'}}>
                      <div className="card-body p-2">
                        <h5 className='text-center'>{home.name}</h5>
                        <div className='text-center'>
                          {home.address.state}, {home.address.zip}
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




