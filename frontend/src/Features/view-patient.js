import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';


import useHomeRequests from '../hooks/home-requests';
import {UserContext, AccessTokenContext} from '../context/context';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../pop-ups/loading";

import '../css/view-patient.css';

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

  const handleActive = () => {
    // need to be able to change the active patient
  }


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
          <div className="container">
            <div className="row mt-5 header-cont d-flex align-items-center">
              <div className="col-6">
                <div className="d-flex ms-4">
                  <div className="p-name me-3">{patient.firstName}</div>
                  <div className="p-name">{patient.lastName}</div>
                </div>
              </div>
              <div className="col-2">
                <div class="form-check form-switch">
                  <input class="form-check-input npat-input" type="checkbox" role="switch" id="active" onChange={handleActive} 
                  checked={patient.active} />
                  <contact-label class="form-check-contact-label nPat-contact-label" for="active">
                    Active
                  </contact-label>
                </div>
              </div>
              <div className="col-2">
                <button className="remove-pat btn d-flex justify-content-center align-items-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className='trash' fill-rule="evenodd" clip-rule="evenodd" d="M20 5.5V4.5C20 4.22386 19.7761 4 19.5 4H15V3C15 2.44772 14.5523 2 14 2H10C9.44772 2 9 2.44772 9 3V4H4.5C4.22386 4 4 4.22386 4 4.5V5.5C4 5.77614 4.22386 6 4.5 6H19.5C19.7761 6 20 5.77614 20 5.5ZM7.87 22C6.81787 22.0026 5.94365 21.1896 5.87 20.14L5 8H19L18.15 20.14C18.0764 21.1896 17.2021 22.0026 16.15 22H7.87Z" fill="red"/>
                  </svg>
                </button>
              </div>
              <div className="col-2">
                <button className='edit-name'>Edit Name</button>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-8">
                <div className="d-flex notes-section flex-column">
                  <div className="d-flex notes-header">
                    <div className="notes-title">Notes:</div>
                    <button className="notes-add btn">Add</button>
                  </div>
                  <div className="container"></div>
                </div>
              </div>

              <div className="col-4">
                <div className="contact-section d-flex flex-column">
                  <div className="d-flex contact-header">
                    <div className="contact-title">Contact Info:</div>
                    <button className="contact-edit">Edit</button>
                  </div>
                    <div className="row p-2">
                      <div className="col-4">
                        <div className="contact-label">Primary Phone:</div>
                        <div className="contact-label">Secondary Phone:</div>
                        <div className="contact-label">Email:</div>
                        <div className="contact-label">Address:</div>
                      </div>
                      <div className="col-8">
                        <div className="contact-info">{patient.primaryNumber}</div>
                        <div className="contact-info">{patient.secondaryNumber || 'NA'}</div>
                        <div className="contact-info">{patient.email}</div>
                        <div className="contact-info">{patient.address}</div>
                      </div>
                    </div>
                </div>

                <div className="contact-section extra-section d-flex flex-column"></div>
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
}


export default ViewPatient;
