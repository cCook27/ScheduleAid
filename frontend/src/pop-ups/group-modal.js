import React from "react";

const GroupModal = ({therapistParameters, handleTherapistParameters, handleGrouping, closeModal}) => {

  return (
    <div className="card" style={{width: "18rem", height: "300px"}}>
      <div className="p-0 card-body text-center">
        <h2>Group Geographically</h2>
          <div>
            <label for="workingDays">Working Days:</label>
            <input onChange={handleTherapistParameters} type="number" id="workingDays" value={therapistParameters.workingDays} name="workingDays" min="1" max="7" />
          </div>
          <button onClick={handleGrouping}>
            Go
          </button>
          <button onClick={closeModal}>
            Cancel
          </button>
      </div>
    </div>
  )
}

export default GroupModal;