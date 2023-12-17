import React, { useContext, useEffect, useState } from 'react';
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
  const { getHomes, removeHome } = useHomeRequests();
  const [editClient, setEditClient] = useState(null)

  const { data: homes, status } = useQuery('homes', 
    () => getHomes(user._id, accessToken)
  );

  const deleteHome = useMutation({
    mutationFn: (id) => 
      removeHome(id, user._id, accessToken),
      
    onSuccess: () => {
      queryClient.invalidateQueries('homes');
    },
  });

  const handleEdit = (home) => {
    setEditClient(home)
  }

  useEffect(() => {
    console.log(homes)
    console.log(editClient)
  }, [homes, editClient])

  return (
    <div className="page-container">
      <div className='container-fluid'>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-10">
            <h2 className='sched-title'>Manage Your Patients</h2>
          </div>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-5 d-flex">
              <select name="filter" id="filter" className="form-select pat-select">
                <option disabled selected value="">Filter</option>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="add mx-2">
                <button className="btn add-btn">Add Patient</button>
              </div>
            </div>

            <div className="col-5 d-flex justify-content-end">
              <input type="text" className="form-control pat-search" id="search" placeholder="Search By Name" />
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-center align-items-center">

          {/* <div className="col" style={{height: '100vh'}}>
            <div className="row">
              <div className="title d-flex justify-content-center">
                <h4>Create & Manage Your Clients</h4>
              </div>
              <div className="col">
                <CreateClient editClient={editClient} />
              </div>
            </div>
          </div> */}


          <div className="col-10 ps-5 pt-4">
          {
            isLoading ? 
            (
              <div className="row">
                <div className="col">
                  <div>Loading...</div>     
                </div>
              </div>
              
            ) : 
            status === 'error' ? 
            (
              <div className="row">
                <div className="col">
                  <div>Error loading data</div>
                </div>
              </div>
              
            ) : !homes ? 
            (
              <div className="row">
                <div className="col">
                  <div>No Current Clients</div>     
                </div>
              </div>
              
            ): 
            (
              homes.map((home) => (
              <div key={home._id} className="row pat-cont my-2 d-flex justify-content-center align-items-center">
                <div className="col info-cont">
                  <div className="pat-name">{home.name}</div>
                </div>
                <div className="col info-cont">
                  <div className="pat-active ellipsis-overflow">{home.active}Active</div>
                </div>
                <div className="col info-cont larger-cont">
                  <div className="pat-address ellipsis-overflow">{home.address}</div>
                </div>
                <div className="col info-cont">
                  <div className="pat-frequency ellipsis-overflow">{home.frequency}/Week</div>
                </div>
                <div className="col info-cont">
                  <div className="pat-number ellipsis-overflow">{home.number}number</div>
                </div>
                <div className="col info-cont">
                  <button className='btn view-btn'>View</button>
                </div>
              </div>
              ))

            )
          }
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayClients;




// homes.map(home => (
//   <div  key={home._id} className="col-3">
//     <div className="card m-2 shadow-lg" style={{width: '10rem', height: 'auto'}}>
//       <div className="card-body p-2">
//         <h5 className='text-center'>{home.name}</h5>
//         <div className='text-center'>
//           <p>{home.address}</p>
//           <p>{home.number}</p>
//           {home.active ? <p>{home.active}</p> : null}
//         </div>
//         <div className="btn-container">
//           <button onClick={() => handleEdit(home)} className="btn btn-primary my-2">
//             Edit
//           </button>
//           <button onClick={() => deleteHome.mutate(home._id)} className="btn btn-danger mb-2">Delete</button>
//         </div>
//       </div>
//     </div>
//   </div>
// ))