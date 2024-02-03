import React from "react";

import DeletePatientModal from "../pop-ups/delete-patient-modal";
import EditPatientNotes from "../pop-ups/edit-patient-note";
import ErrorModal from "../pop-ups/error-modal";
import Loading from "../pop-ups/loading";
import PatientModal from "../pop-ups/patient-modal";
import PatientScheduleNotes from "../pop-ups/patient-schedule-notes";
import CreatePatient from "../pop-ups/create-patient";
import LoadingModal from "../pop-ups/loading-modal";

const ModalWrapper = (props) => {
  const MODAL_COMPONENTS = {
    DeletePatientModal: DeletePatientModal,
    EditPatientNotes: EditPatientNotes,
    ErrorModal: ErrorModal,
    Loading: Loading,
    PatientModal: PatientModal,
    PatientScheduleNotes: PatientScheduleNotes,
    CreatePatient: CreatePatient,
    LoadingModal: LoadingModal
  };

  const SelectedModal = MODAL_COMPONENTS[props.modalType] || ErrorModal;

  return (
    <div className="modal-wrapper">
      <SelectedModal userId={props.userId} accessToken={props.accessToken} modalProps={props.modalProps} closeModal={props.closeModal}/>
    </div>
    
  )
};

export default ModalWrapper;