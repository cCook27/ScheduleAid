import React from "react";
import useDistanceRequests from "../hooks/distance-request";

const PatientGroupModal = ({accessToken, userId, modalProps, closeModal}) => {

  const { saveGroupSet } = useDistanceRequests();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const weekday = weekdays[date.getDay()];
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'
    const minutesPadded = minutes < 10 ? '0' + minutes : minutes;

    return (
      <>
          {weekday}<br />
          {month}/{day}/{year}<br />
          {hours}:{minutesPadded}{ampm}
      </>
    );
  };

  const handleAssignEvent = (event) => {
    if(modalProps.groups.setId) {
      const newGroupSet = {...modalProps.groups}
      const groupToChange = [...newGroupSet.groups[modalProps.groupNum].pats];
      const patientToChange = {...modalProps.patient};
      patientToChange.manualScheduled = event.id;
      groupToChange[modalProps.patientIndex] = patientToChange;
      newGroupSet.groups[modalProps.groupNum].pats = groupToChange;

      saveGroupSet(userId, accessToken, newGroupSet);
      closeModal();
    }
  }

  return (
    <div className="container patient-modal">
      <div className="row">
        <div className="col py-2 p-modal-title-cont">
          <div className="p-modal-title">Assign an Event to This Patient</div>
          <button onClick={closeModal} type="button" className="btn-close close-all close-p-notes me-1" aria-label="Close"></button>
        </div>
      </div>

      <div className="row my-4">
        <div className="col">
          <div className="d-flex align-items-center justify-content-start pat-name-modal">
            {modalProps.patient.firstName} <span className="ms-1">{modalProps.patient.lastName}:</span> <span className="ms-1">Group {modalProps.groupNum + 1}</span>
          </div>
        </div>
      </div>

      <div className="row my-4">
        {
          modalProps.availableEvents && modalProps.availableEvents.length > 0 ?
          (
            modalProps.availableEvents.map((event) => (
              <div key={event.id} className="col-4">
                <button className="btn manual-btns" onClick={() => handleAssignEvent(event)}>
                  {formatDate(event.start)}
                </button>
              </div>
            ))
          ) : <div>no</div>
        }
      </div>
    </div>
  )
}

export default PatientGroupModal;