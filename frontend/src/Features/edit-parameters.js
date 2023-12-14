import { useEffect, useState } from "react";

import "../css/edit-parameters.css"

const EditParameters = ({therapistParameters, handleTherapistParameters}) => {

  const [parameters, setParameters] = useState({
    workingDays: 5,
    sessionLength: 60,
    bufferTime: 5
  });

  useEffect(() => {
    setParameters(therapistParameters);
  }, []);

  const handleParameterChange = (event, param) => {
    const value = parseInt(event.target.value);

    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleSaveParameters = () => {
    handleTherapistParameters(parameters);
  }

  return (
    <div className="container-fluid">
      <div className="row py-2">
        <div className="col d-flex justify-content-center">
          <h4 className="title">Edit Your Workday Parameters</h4>
        </div>
      </div>

      <div className="row">
  
        <div className="col d-flex flex-column justify-content-center align-items-center">

          <div className="row">
            <div className="col-4">
              <div className="input-group my-4">
                <label className="label-edit">Working Days</label>
                <input type="number" className="form-control" value={parameters.workingDays} onChange={(event) => handleParameterChange(event, 'workingDays')} min={1} max={7}/>
                <span className="input-group-text">Days</span>
              </div>
            </div>

            <div className="col-4">
              <div className="input-group my-4">
                <label className="label-edit">Session Length</label>
                <input type="number" className="form-control" value={parameters.sessionLength} onChange={(event) => handleParameterChange(event, 'sessionLength')}/>
                <span className="input-group-text">Min</span>
              </div>
            </div>

            <div className="col-4">
              <div className="input-group my-4">
                <label className="label-edit">Buffer Time</label>
                <input type="number" className="form-control" value={parameters.bufferTime} onChange={(event) => handleParameterChange(event, 'bufferTime')} min={1} max={7}/>
                <span className="input-group-text">Min</span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <button className="save-btn btn" onClick={handleSaveParameters}>Save</button>
          </div>
        </div>
          
      </div>
    </div>
  )
}

export default EditParameters;