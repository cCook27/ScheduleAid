import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PlacesAutocomplete from 'react-places-autocomplete';


import useHomeRequests from '../hooks/home-requests';
import {UserContext, AccessTokenContext} from '../context/context';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../pop-ups/loading";

import '../css/view-patient.css';
import DeletePatientModal from '../pop-ups/delete-patient-modal';
import PatientScheduleNotes from '../pop-ups/patient-schedule-notes';

const ViewPatient = () => {
  const queryClient = useQueryClient();


  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const { isLoading } = useAuth0();

  const {viewPatient, updatePatient, removeHome} = useHomeRequests();
  const { id } = useParams();
  const { data: patient, status } = useQuery('patient',
    () => viewPatient(user._id, id, accessToken)
  );

  const [edit, setEdit] = useState({
    patientName: false,
    contactSide: false,
    scheduleSide: false,
    deletePatient: false,
    patientNotes: false,
  });
  const [patientData, setPatientData] = useState(undefined);

  useEffect(() => {
    setPatientData(patient);
    console.log(patientData);
  },[patient]);

  useEffect(() => {
    saveChanges();
  },[patientData]);
  
  const handleDeletePatient = () => {
    removeHome(id, user._id, accessToken);
    window.location.href = '/manage';
  };

  const handleBack = () => {
    window.location.href = '/manage';
  };

  const handleEditName = () => {
    setEdit((prev) => ({
      ...prev,
      patientName: !prev.patientName,
    }));
  };

  const handleContactEdit = () => {
    setEdit((prev) => ({
      ...prev,
      contactSide: !prev.contactSide,
    }));
  };

  const handleScheduleEdit = () => {
    setEdit((prev) => ({
      ...prev,
      scheduleSide: !prev.scheduleSide,
    }));
  };
  
  const handleDeletePatientEdit = () => {
    setEdit((prev) => ({
      ...prev,
      deletePatient: !prev.deletePatient,
    }));
  };

  const handleEditPatientNotes = () => {
    setEdit((prev) => ({
      ...prev,
      patientNotes: !prev.patientNotes,
    }));
  };

  const saveScheduleChanges = () => {
    setEdit((prev) => ({
      ...prev,
      scheduleSide: !prev.scheduleSide,
    }));
  };

  const saveContactChanges = () => {
    setEdit((prev) => ({
      ...prev,
      contactSide: !prev.contactSide,
    }));
  };

  const saveChanges = () => {
    updatePatient(user._id, patientData, accessToken);
  };

  const handleActive = () => {
    setPatientData((prev) => ({
      ...prev,
      active: !prev.active
    }));
  };

  const handleInputChange = (event) => {
    const {name, value} = event.target;

    setPatientData({
      ...patientData,
      [name]: value
    });
  };

  const handleNoSeeDays = (value) => {
    setPatientData((prev) => ({
      ...prev,
      noSeeDays: {
        ...prev.noSeeDays,
        [value]: !prev.noSeeDays[value]
      }
    }));
  };

  const handleAddressChange = (value) => {
    setPatientData((prevData) => ({
      ...prevData,
      address: value,
    }));
  };

  const handleNoteAddition = (note) => {
    setPatientData((prev) => ({
      ...prev,
      notes: prev.notes.push(note)
    }));
  };

  return (
    <div className={`container ${edit.deletePatient || edit.patientNotes ? 'overlay' : ''}`}>
      {
        isLoading ? (
          <div><Loading /></div>
        ) :
        !patient ? (
          <div>
            Patient not found
          </div>
        ) :
        !patientData ? (
          <div><Loading /></div>
        ) :
        patientData ? (
          <div className="container">
            <div className="row mt-5 header-cont d-flex align-items-center">
              <div className="col-6 d-flex">
                <div className="d-flex align-items-center ms-3">
                  <button onClick={handleBack} className='back-btn'>
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className='back-color' d="M20 6.49985V7.49985C20 7.77599 19.7761 7.99985 19.5 7.99985H3.33L7.78 12.4399C7.87466 12.5337 7.9279 12.6615 7.9279 12.7949C7.9279 12.9282 7.87466 13.056 7.78 13.1499L7.07 13.8499C6.97612 13.9445 6.84832 13.9978 6.715 13.9978C6.58168 13.9978 6.45388 13.9445 6.36 13.8499L0.22 7.71985C0.0793075 7.57934 0.000175052 7.3887 0 7.18985V6.80985C0.00230401 6.61144 0.081116 6.42157 0.22 6.27985L6.36 0.149852C6.45388 0.055196 6.58168 0.00195312 6.715 0.00195312C6.84832 0.00195312 6.97612 0.055196 7.07 0.149852L7.78 0.859852C7.87406 0.952016 7.92707 1.07816 7.92707 1.20985C7.92707 1.34154 7.87406 1.46769 7.78 1.55985L3.33 5.99985H19.5C19.7761 5.99985 20 6.22371 20 6.49985Z" fill="#499165"/>
                    </svg>
                  </button>
                 
                </div>
                <div className={`${!edit.patientName ? 'd-flex ms-5' : 'd-none'}`}>
                  <div className="p-name me-3">{patientData.firstName}</div>
                  <div className="p-name">{patientData.lastName}</div>
                </div>
                <div className={`${!edit.patientName ? 'd-none' : 'd-flex ms-5'}`}>
                  <input
                    type="text"
                    className="form-control npat-input me-2"
                    placeholder='First Name'
                    id="firstName"
                    name="firstName"
                    value={patientData.firstName}
                    onChange={(event) => handleInputChange(event)}
                  />
                  <input
                    type="text"
                    className="form-control npat-input"
                    placeholder='Last Name'
                    id="lastName"
                    name="lastName"
                    value={patientData.lastName}
                    onChange={(event) => handleInputChange(event)}
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="form-check form-switch">
                  <input className="form-check-input npat-input" type="checkbox" role="switch" id="active" onChange={handleActive} 
                  checked={patientData.active} />
                  <contact-label className="form-check-contact-label nPat-contact-label" for="active">
                    <span className="edit-active">Active</span>
                  </contact-label>
                </div>
              </div>
              <div className="col-2">
                <button className="remove-pat btn d-flex justify-content-center align-items-center" onClick={handleDeletePatientEdit}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className='trash' fillRule="evenodd" clipRule="evenodd" d="M20 5.5V4.5C20 4.22386 19.7761 4 19.5 4H15V3C15 2.44772 14.5523 2 14 2H10C9.44772 2 9 2.44772 9 3V4H4.5C4.22386 4 4 4.22386 4 4.5V5.5C4 5.77614 4.22386 6 4.5 6H19.5C19.7761 6 20 5.77614 20 5.5ZM7.87 22C6.81787 22.0026 5.94365 21.1896 5.87 20.14L5 8H19L18.15 20.14C18.0764 21.1896 17.2021 22.0026 16.15 22H7.87Z" fill="red"/>
                  </svg>
                </button>
              </div>
              <div className="col-2">
                <button onClick={handleEditName} className='edit-name'>
                  <span className={`${!edit.patientName ? '' : 'd-none'}`}>
                    Edit Name
                  </span>
                  <span className={`${!edit.patientName ? 'd-none' : ''}`}>
                    Save
                  </span>
                </button>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-8">
                <div className="d-flex notes-section flex-column">
                  <div className="d-flex notes-header">
                    <div className="notes-title">Notes:</div>
                    <button onClick={handleEditPatientNotes} className="notes-add btn">Add</button>
                  </div>
                  <div className="container"></div>
                </div>
              </div>

              <div className="col-4">
                <div className="contact-section d-flex flex-column">
                  <div className="d-flex contact-header">
                    <div className="contact-title">Contact Info:</div>
                    <button onClick={saveContactChanges} className={`${!edit.contactSide ? 'd-none' : 'contact-edit'}`}>
                     Save
                    </button>
                    <button onClick={handleContactEdit} className={`${!edit.contactSide ? 'contact-edit' : 'd-none'}`}>
                     Edit
                    </button>
                  </div>
                    <div className="row p-2">
                      <div className="col-4">
                        <div className="contact-label">Primary Phone:</div>
                        <div className="contact-label">Secondary Phone:</div>
                        <div className="contact-label">Email:</div>
                        <div className="contact-label">Address:</div>
                      </div>
                      <div className="col-8">
                        <div className={`${!edit.contactSide ? '' : 'd-none'}`}>
                          <div className="contact-info">
                            {patientData.primaryNumber || 'NA'}
                          </div>
                          <div className="contact-info">
                            {patientData.secondaryNumber || 'NA'}
                          </div>
                          <div className="contact-info">
                            {patientData.email || 'NA'}
                          </div>
                          <div className="contact-info">
                            {patientData.address}
                          </div>
                        </div>

                        <div className={`${!edit.contactSide ? 'd-none' : 'solid'}`}>
                          <div className="contact-info">
                            <input
                              type="tel"
                              className="edit-input"
                              placeholder='e.g. 480-123-456'
                              id="primaryNumber"
                              name="primaryNumber"
                              value={patientData.primaryNumber}
                              onChange={(event) => handleInputChange(event)}
                            />
                          </div>
                          <div className="contact-info">
                            <input
                              type="tel"
                              className="edit-input"
                              placeholder='e.g. 928-789-1234'
                              id="secondaryNumber"
                              name="secondaryNumber"
                              value={patientData.secondaryNumber}
                              onChange={(event) => handleInputChange(event)}
                            />
                          </div>
                          <div className="contact-info">
                            <input
                              className="edit-input"
                              placeholder='e.g. janedoe@example.com'
                              id="email"
                              name="email"
                              value={patientData.email}
                              onChange={(event) => handleInputChange(event)}
                            />
                          </div>
                          <div className="contact-info">
                            <PlacesAutocomplete
                              value={patientData.address}
                              onChange={handleAddressChange}
                            >

                              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                              <div >
                                <input
                                  {...getInputProps({
                                    placeholder: 'Search Address ...',
                                  })}
                                  className={`${suggestions.length > 0 ? 'location-search-input-bot edit-input ' : 'location-search-input edit-input'}`}
                                />
                                <div className={`${suggestions.length > 0 ? 'autocomplete-dropdown-container' : 'autocomplete-dropdown-container-none'}`}>
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                      ? 'suggestion-item--active'
                                      : 'suggestion-item';
                                    const style = suggestion.active
                                      ? { backgroundColor: '#6a9f6d', cursor: 'pointer' }
                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                      <div
                                        key={suggestion.description}
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              )}
                            </PlacesAutocomplete> 
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                <div className="contact-section extra-section d-flex flex-column">
                  <div className="d-flex contact-header">
                    <div className="contact-title">Scheduling Info:</div>
                    <button onClick={saveScheduleChanges} className={`${!edit.scheduleSide ? 'd-none' : 'contact-edit'}`}>
                     Save
                    </button>
                    <button onClick={handleScheduleEdit} className={`${!edit.scheduleSide ? 'contact-edit' : 'd-none'}`}>
                     Edit
                    </button>
                  </div>
                  <div className="row p-2">
                   <div className="col-4">
                    <div className="contact-label">Frequency:</div>
                   </div>
                   <div className="col-8">
                    <div className={`${!edit.scheduleSide ? 'd-none' : 'd-flex'}`}>
                      <input
                        type="number"
                        className="contact-info extra-input"
                        id="frequency"
                        name="frequency"
                        value={patientData.frequency}
                        onChange={(event) => handleInputChange(event)}
                      />
                      <div className="contact-info ps-1">/Week</div>
                    </div>
                    <div className={`${!edit.scheduleSide ? 'd-flex' : 'd-none'}`}>
                      <div className="contact-info">
                        {patientData.frequency}/Week
                      </div>
                    </div>
                    
                   </div>
                  </div>
                  <div className="row p-2">
                    <div className="col-4">
                      <div className="contact-label nsd-label">Cannot Be Seen:</div>
                      <select disabled={!edit.scheduleSide} className="contact-label extra-nsd" name="noseeDays" id="noSeeDays" 
                      onChange={(event) => handleNoSeeDays(event.target.value)}>
                        <option disabled selected value="">Select Day</option>
                        <option className={`${patientData.noSeeDays.sunday ? 'd-none' : null}`} value="sunday">
                          Sunday
                        </option>
                        <option className={`${patientData.noSeeDays.monday ? 'd-none' : null}`} value="monday">
                          Monday
                        </option>
                        <option className={`${patientData.noSeeDays.tuesday ? 'd-none' : null}`} value="tuesday">
                          Tuesday
                        </option>
                        <option className={`${patientData.noSeeDays.wednesday ? 'd-none' : null}`} value="wednesday">
                          Wednesday
                        </option>
                        <option className={`${patientData.noSeeDays.thursday ? 'd-none' : null}`} value="thursday">
                          Thursday
                        </option>
                        <option className={`${patientData.noSeeDays.friday ? 'd-none' : null}`} value="friday">
                          Friday
                        </option>
                        <option className={`${patientData.noSeeDays.saturday ? 'd-none' : null}`} value="saturday">
                          Saturday
                        </option>
                      </select>
                    </div>
                    <div className="col-8">
                      <div className="d-flex row nsd-cont my-2">
                        {Object.entries(patientData.noSeeDays).map(([propertyName, propertyValue]) => (
                          propertyValue && (
                            <div className="col-6" key={propertyName}>
                              <span className={`${!edit.scheduleSide ? 'badge dis-badge' : 'badge'}`}>
                                {propertyName}
                                <button className={`${!edit.scheduleSide ? 'd-none' : 'btn-close'}`} onClick={() => handleNoSeeDays(propertyName)}></button>
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${!edit.deletePatient ? 'd-none' : 'delete-modal'}`}>
              <DeletePatientModal patientData={patientData} 
              handleDeletePatient={handleDeletePatient} 
              handleDeletePatientEdit={handleDeletePatientEdit} />
            </div>

            <div className={`${!edit.patientNotes ? 'd-none' : 'p-notes-modal'}`}>
              <PatientScheduleNotes patientData={patientData} 
              handleEditPatientNotes={handleEditPatientNotes} 
              handleNoteAddition={handleNoteAddition} />
            </div>
          </div>
        ) : null
      }
    </div>
  )
}


export default ViewPatient;




