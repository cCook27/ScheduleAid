import React from 'react';
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
    <div className='container-fluid'>
      <div className="row">
        {status === 'loading' ? (
          <div>Loading...</div>
        ) : status === 'error' ? (
          <div>Error loading data</div>
        ) : (
          homes.map(home => (
            <div key={home._id} className="col-4">
              <div className="card my-3" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{home.name}</h5>
                  <p className="card-text">
                    {home.address.street}, {home.address.city}, {home.address.state}, {home.address.zip}
                  </p>
                  <a href='/manage' className="btn btn-primary">Manage</a>
                  <button onClick={() => removeHome.mutate(home._id)} className="btn">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DisplayClients;







