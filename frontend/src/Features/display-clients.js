import React from 'react';
import CreateClient from './create-client';
import useHomeRequests from '../hooks/home-requests';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/display-homes.css';
import { useMutation, useQuery, useQueryClient } from 'react-query';



function DisplayClients() {
  const queryClient = useQueryClient();

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

          <div className="col">
            <div className="row">
              <div className="col">
                <CreateClient />
              </div>
            </div>
          </div>


          <div className="col-8">
            <div className="row">
              {status === 'loading' ? (
                <div className="col">
                  <div>Loading...</div>     
                </div>
              ) : status === 'error' ? (
                <div className="col">
                  <div>Error loading data</div>
                </div>
              ) : (
                homes.map(home => (
                  <div key={home._id} className="col-3">
                    <div className="card m-2" style={{width: '10rem', height: 'auto'}}>
                      <div className="card-body p-2">
                        <h5>{home.name}</h5>
                        <div >
                          {home.address.street}, {home.address.city}, {home.address.state}, {home.address.zip}
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




