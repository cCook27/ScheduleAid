import React from "react";

import DeletePatientModal from "../pop-ups/delete-patient-modal";
import EditPatientNotes from "../pop-ups/edit-patient-note";
import ErrorModal from "../pop-ups/error-modal";
import Loading from "../pop-ups/loading";
import PatientModal from "../pop-ups/patient-modal";
import PatientScheduleNotes from "../pop-ups/patient-schedule-notes";

const ModalWrapper = (props) => {
  const MODAL_COMPONENTS = {
    DeletePatientModal: DeletePatientModal,
    EditPatientNotes: EditPatientNotes,
    ErrorModal: ErrorModal,
    Loading: Loading,
    PatientModal: PatientModal,
    PatientScheduleNotes: PatientScheduleNotes
  };

  const SelectedModal = MODAL_COMPONENTS[props.modalType] || ErrorModal;

  return <SelectedModal userId={props.userId} accessToken={props.accessToken} modalProps={props.modalProps} closeModal={props.closeModal}/>
};

export default ModalWrapper;