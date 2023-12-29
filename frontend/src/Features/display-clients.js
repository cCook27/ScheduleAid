import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/display-clients.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

import CreatePatient from './create-patient';
import useHomeRequests from '../hooks/home-requests';
import {UserContext, AccessTokenContext} from '../context/context';

function DisplayClients() {
  const queryClient = useQueryClient();

  const { isLoading } = useAuth0();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const { getHomes, removeHome } = useHomeRequests();
  const { data: homes, status } = useQuery('homes', 
    () => getHomes(user._id, accessToken)
  );

  const [filteredHomes, setFilteredHomes] = useState([]);
  const [filter, setFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [addPatinet, setAddPatient] = useState(false);

  const filterSelection = (filterEvent) => {
    setFilter(filterEvent);

    if(filterEvent === 'A-Z') {
      const sortAZ = homes.sort((a, b) => a.name.localeCompare(b.name));
      sortAZ.length > 0 ? setFilteredHomes(sortAZ) : window.alert('Add Patients!');
    } else if(filterEvent === 'Z-A')  {
      const sortZA = homes.sort((a, b) => b.name.localeCompare(a.name));
      sortZA.length > 0 ? setFilteredHomes(sortZA) : window.alert('Add Patients!');
    } else if(filterEvent === 'Active') {
      const filterActive = homes.filter((home) => home.active);
      filterActive.length > 0 ? setFilteredHomes(filterActive) : window.alert('You have no Active patients');
    } else if(filterEvent === 'Inactive') {
      const filterInactive = homes.filter((home) => !home.active);
      filterInactive.length > 0 ? setFilteredHomes(filterInactive) : window.alert('You have no Inactive patients');
    } else if(filterEvent === 'All') {
      setFilteredHomes(homes);
    }
  };

  const handleSearchName = (event) => { 
    setSearchFilter(event);
  };

  const searchName = () => {
    const isName = homes.filter((home) => home.name.toUpperCase() === searchFilter.toUpperCase());

    isName.length > 0 ? setFilteredHomes(isName) : window.alert(`Sorry, it looks like there is no one by the name of ${searchFilter} in your patient list.`);

    setFilter(null);
  };

  const handleAddPatModal = () => {
    setAddPatient(!addPatinet);
  };

  const deleteHome = useMutation({
    mutationFn: (id) => 
      removeHome(id, user._id, accessToken),
      
    onSuccess: () => {
      queryClient.invalidateQueries('homes');
    },
  });

  return (
    <div className="page-container">
      <div className={`container-fluid ${addPatinet ? 'overlay' : ''}`}>
        <div className="row p-3 d-flex justify-content-center align-items-center">
          <div className="col-10">
            <h2 className='sched-title'>Manage Your Patients</h2>
          </div>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-5 d-flex">
              <select name="filter" id="filter" className="form-select pat-select"
              onChange={(event) => filterSelection(event.target.value)}
              value={filter || ''}>
                <option disabled selected value="">Filter</option>
                <option value="All">All</option>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="add mx-2">
                <button onClick={handleAddPatModal} className="btn add-btn">Add Patient</button>
              </div>
            </div>

            <div className="col-5 d-flex justify-content-end">
            <div className="input-group search-group">
              <input type="text" className="form-control search pat-search" placeholder="Search By Name" value={searchFilter} onChange={(e) => handleSearchName(e.target.value)} />
              <button onClick={searchName} className="btn search-btn" type="button">Search</button>
            </div>
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-center align-items-center">
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
              
            ): filteredHomes.length > 0 ?
            (
              filteredHomes.map((home) => (
                <div key={home._id} className="row pat-cont my-2 d-flex justify-content-center align-items-center">
                  <div className="col info-cont d-flex">
                    <div className="pat-name">{home.firstName}</div>
                    <div className="pat-name">{home.lastName}</div>
                  </div>
                  <div className="col info-cont">
                    <div className="pat-active ellipsis-overflow">{home.active ? 'Active' : 'Inactive'}</div>
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
                    <button className='btn view-btn'>
                      <Link className='link' to={`/manage/${home._id}`}>View</Link>
                    </button>
                  </div>
                </div>
              ))
            ) :
            (
              homes.map((home) => (
                <div key={home._id} className="row pat-cont my-2 d-flex justify-content-center align-items-center">
                  <div className="col info-cont d-flex">
                    <div className="pat-name me-1">{home.firstName}</div>
                    <div className="pat-name">{home.lastName}</div>
                  </div>
                  <div className="col info-cont">
                    <div className="pat-active ellipsis-overflow">{home.active ? 'Active' : 'Inactive'}</div>
                  </div>
                  <div className="col info-cont larger-cont">
                    <div className="pat-address ellipsis-overflow">{home.address}</div>
                  </div>
                  <div className="col info-cont">
                    <div className="pat-frequency ellipsis-overflow">{home.frequency}/Week</div>
                  </div>
                  <div className="col info-cont">
                    <div className="pat-number ellipsis-overflow">{home.primaryNumber}</div>
                  </div>
                  <div className="col info-cont">
                    <button className='btn view-btn'>
                      <Link className='link' to={`/manage/${home._id}`}>View</Link>
                    </button>
                  </div>
                </div>
              ))
            )
          }
          </div>
        </div>

        {addPatinet ?
          <div className="above-overlay-n">
              <CreatePatient close={handleAddPatModal} />
          </div> : null 
        }
      </div>
    </div>
  );
}

export default DisplayClients;




