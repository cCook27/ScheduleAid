import React, { useContext, useEffect, useState } from 'react';

import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {UserContext, AccessTokenContext} from '../context/context';
import usePatientRequests from '../hooks/patient-requests';

import Loading from '../pop-ups/loading';

import 'bootstrap/dist/css/bootstrap.css';
import '../css/display-clients.css';

function DisplayClients({openModal, isOpen}) {
  const queryClient = useQueryClient();

  const { isLoading } = useAuth0();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const { getPatients, removePatient } = usePatientRequests();
  const { data: patients, status, refetch } = useQuery('patients', 
    () => getPatients(user._id, accessToken)
  );

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filter, setFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [addPatinet, setAddPatient] = useState(false);
  const [stillFetching, setStillFetching] = useState(false);

  useEffect(() => {
    setStillFetching(true);
    handleRefetch();
  }, [isOpen]);

  const filterSelection = (filterEvent) => {
    setFilter(filterEvent);

    if(filterEvent === 'A-Z') {
      const sortAZ = patients.sort((a, b) => a.lastName.localeCompare(b.lastName));
      sortAZ.length > 0 ? setFilteredPatients(sortAZ) : window.alert('Add Patients!');
    } else if(filterEvent === 'Z-A')  {
      const sortZA = patients.sort((a, b) => b.lastName.localeCompare(a.lastName));
      sortZA.length > 0 ? setFilteredPatients(sortZA) : window.alert('Add Patients!');
    } else if(filterEvent === 'Active') {
      const filterActive = patients.filter((patient) => patient.active);
      filterActive.length > 0 ? setFilteredPatients(filterActive) : window.alert('You have no Active patients');
    } else if(filterEvent === 'Inactive') {
      const filterInactive = patients.filter((patient) => !patient.active);
      filterInactive.length > 0 ? setFilteredPatients(filterInactive) : window.alert('You have no Inactive patients');
    } else if(filterEvent === 'All') {
      setFilteredPatients(patients);
    }
  };

  const handleSearchName = (event) => { 
    setSearchFilter(event);
  };

  const searchName = () => {
    const isName = patients.filter((patient) => patient.firstName.toUpperCase() === searchFilter.toUpperCase() || patient.lastName.toUpperCase() === searchFilter.toUpperCase());

    isName.length > 0 ? setFilteredPatients(isName) : window.alert(`Sorry, it looks like there is no one by the name of ${searchFilter} in your patient list.`);

    setFilter(null);
  };

  const handleAddPatModal = () => {
    openModal('CreatePatient', {});
  };

  const handleRefetch = async () => {
    const { data, error, failureCount, isFetching } = await refetch();
    if(data.error) {
      console.log('this is working')
    }

    if(data) {
      setStillFetching(false);
    }
  };

  const deletePatient = useMutation({
    mutationFn: (id) => 
      removePatient(id, user._id, accessToken),
      
    onSuccess: () => {
      queryClient.invalidateQueries('patients');
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
          <div className="col-10 pt-4">
          {
            isLoading || stillFetching ? 
            (
              <div className="row">
                <div className="col">
                  <div><Loading /></div>     
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
              
            ) : !patients ? 
            (
              <div className="row">
                <div className="col">
                  <div>No Current Patients</div>     
                </div>
              </div>
              
            ) : filteredPatients.length > 0 ?
            (
              <div className="contacts-bg mb-3 d-flex flex-column">
                <div className="row mt-2 contact-title-row py-2">
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Name</div>
                  </div>
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Status</div>
                  </div>
                  <div className="col info-cont larger-cont">
                    <div className="d-flex labeling-description">Address</div>
                  </div>
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Frequency</div>
                  </div>
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Primary Number</div>
                  </div>
                  <div className="col info-cont">
                    
                  </div>
                </div>

                <div className="row">
                  <div className="col p-3 d-flex flex-column justify-content-center align-items-center">
                    { filteredPatients.map((patient) => (
                      <div key={patient._id} className="row pat-cont">
                        <div className="col info-cont">
                          <div className="pat-name me-1">{patient.firstName}</div>
                          <div className="pat-name">{patient.lastName}</div>
                        </div>
                        <div className="col info-cont">
                          <div className="pat-active ellipsis-overflow">{patient.active ? 'Active' : 'Inactive'}</div>
                        </div>
                        <div className="col info-cont larger-cont">
                          <div className="pat-address ellipsis-overflow">{patient.address}</div>
                        </div>
                        <div className="col info-cont">
                          <div className="pat-frequency ellipsis-overflow">{patient.frequency}/Week</div>
                        </div>
                        <div className="col info-cont">
                          <div className="pat-number ellipsis-overflow">{patient.primaryNumber}</div>
                        </div>
                        <div className="col info-cont">
                          <button className='btn view-btn'>
                            <Link className='link' to={`/manage/${patient._id}`}>View</Link>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
             
            ) : filteredPatients.length === 0 && patients.length > 0 ?
            (
              <div className="contacts-bg mb-3 d-flex flex-column">
                <div className="row mt-2 contact-title-row py-2">
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Name</div>
                  </div>
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Status</div>
                  </div>
                  <div className="col info-cont larger-cont">
                    <div className="d-flex labeling-description">Address</div>
                  </div>
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Frequency</div>
                  </div>
                  <div className="col info-cont">
                    <div className="d-flex labeling-description">Primary Number</div>
                  </div>
                  <div className="col info-cont">
                    
                  </div>
                </div>

                <div className="row">
                  <div className="col p-3 d-flex flex-column justify-content-center align-items-center">
                    { patients.map((patient) => (
                      <div key={patient._id} className="row pat-cont">
                        <div className="col info-cont">
                          <div className="pat-name me-1">{patient.firstName}</div>
                          <div className="pat-name">{patient.lastName}</div>
                        </div>
                        <div className="col info-cont">
                          <div className="pat-active ellipsis-overflow">{patient.active ? 'Active' : 'Inactive'}</div>
                        </div>
                        <div className="col info-cont larger-cont">
                          <div className="pat-address ellipsis-overflow">{patient.address}</div>
                        </div>
                        <div className="col info-cont">
                          <div className="pat-frequency ellipsis-overflow">{patient.frequency}/Week</div>
                        </div>
                        <div className="col info-cont">
                          <div className="pat-number ellipsis-overflow">{patient.primaryNumber}</div>
                        </div>
                        <div className="col info-cont">
                          <button className='btn view-btn'>
                            <Link className='link' to={`/manage/${patient._id}`}>View</Link>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
             
            ) : 
            (
              <div className='container'>
                <div className='d-flex justify-content-center align-items-center flex-column my-4 no-p-titles'>
                  <h4>No Current Patients</h4>
                  <h6>Click the <span className='add-span'>Add Patient</span> button to start creating your patient list.</h6>
                </div>
              </div>
            )
          }
          </div>
        </div>

        {/* {addPatinet ?
          <div className="above-overlay-n">
              <CreatePatient close={handleAddPatModal} />
          </div> : null 
        } */}
      </div>
    </div>
  );
}

export default DisplayClients;




