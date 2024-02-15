import React from "react";

const ManualGrouping = ({ openModal, handleDragStart, patientGroups, homes, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups }) => {

  const handleInitiateGrouping = () => {
    const initiateProps = {
      start: start
    }
    openModal('InitiateGrouping', initiateProps)
  }

  return (
    <div className="container">
      <button onClick={handleInitiateGrouping}>Initiate Grouping</button>
    </div>
  )
};

export default ManualGrouping;