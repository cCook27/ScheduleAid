import React from "react";

const GroupModal = ({therapistParameters, handleTherapistParameters, handleGrouping, closeModal}) => {

  return (
    <div className="container-fluid">
      <div className="row my-2">
        <div className="col d-flex justify-content-center">
          <h4>Group Patients Geogrphically</h4>
        </div>
      </div>

      <div className="row my-2">
        <div className="col d-flex justify-content-center">
          <div>
            <label for="workingDays">Working Days:</label>
            <input onChange={handleTherapistParameters} type="number" id="workingDays" value={therapistParameters.workingDays} name="workingDays" min="1" max="7" />
          </div>
        </div>
      </div>

      <div className="row my-2">
        <div className="col d-flex justify-content-center">
          <button onClick={handleGrouping}>Go!</button>
        </div>
      </div>
    </div>
  )
}

export default GroupModal;