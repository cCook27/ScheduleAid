const ModalWrapper = (props) => {
  const MODAL_COMPONENTS = {
    DeletePatientModal: DeletePatientModal,
    EditPatientNotes: EditPatientNotes,
    ErrorModal: ErrorModal,
    Loading: Loading,
    PatientModal: PatientModal,
    PatientScheduleNotes: PatientScheduleNotes
  };

  const SelectedModal = MODAL_COMPONENTS[props.modalType];

  return <SelectedModal {...props.modalProps}/>
};

export default ModalWrapper;