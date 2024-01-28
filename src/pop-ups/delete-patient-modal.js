import React from "react";

import usePatientRequests from "../hooks/patient-requests";

import '../css/delete-patient-modal.css';

const DeletePatientModal = ({userId, accessToken, modalProps, closeModal}) => {
  const { removePatient } = usePatientRequests();

  const handleCancelDelete = () => {
    closeModal();
  };

  const finalRemove = () => {
    removePatient(modalProps.patientId, userId, accessToken);
    window.location.href = '/manage';

    if(window.location.href === '/manage') {
      closeModal();
    }
  };

  return (
    <div className="container px-3 pb-3">
      <div className="d-flex del-header">
        <div className="del-title">Just to Make Sure</div>
      </div>
      <div className="d-flex p-3 flex-column justify-content-center align-items-center">
        <div className="del-explanation">Are you sure you want to remove 
          <span className="del-name ps-1">{modalProps.patientData.firstName}</span> from your patient list?
        </div>
        <div className="del-explanation">This change cannot be undone.</div>
      </div> 
      <div className="d-flex justify-content-center my-2">
        <button onClick={handleCancelDelete} className="btn del-btn cancel-del mx-2">Cancel</button>
        <button onClick={finalRemove} className="btn del-btn remove-del">Remove</button>
      </div> 
    
    </div>
  )
};

export default DeletePatientModal;