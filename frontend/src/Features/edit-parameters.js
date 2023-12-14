import { useState } from "react";

import "../css/edit-parameters.css"

const EditParameters = ({therapistParameters, handleTherapistParameters}) => {

  const [parameters, setParameters] = useState({
    workingDays: 5,
    sessionLength: 60,
    bufferTime: 5
  });

  const handleParameterChange = (event, param) => {
    const value = event.target.value;

    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleIncrement = (operation, param) => {
    setParameters(prev => ({
      ...prev,
      [param]: operation === '+' ? prev[param] + 1 : prev[param] - 1 
    }));
  };



  return (
    <div classparam="container-fluid">
      <div classparam="row py-2">
        <div classparam="col d-flex justify-content-start">
          <h4 classparam="title">Edit Your Workday Parameters</h4>
        </div>
      </div>

      <div classparam="row">
        <div classparam="col d-flex flex-column">

        <div classparam="form-control d-flex">
          <input classparam="info-place" type="number" 
          value={parameters.workingDays} 
          onChange={(event) => handleParameterChange(event, 'workingDays')}
          />
          <div classparam="d-flex flex-column">
            <button classparam="counter">^</button>
            <button classparam="counter"><span classparam="upside-down">^</span></button>
          </div>
          
        </div>

        <div classparam="form-control d-flex">
          <input classparam="info-place" type="number" 
          value={parameters.workingDays} 
          onChange={(event) => handleParameterChange(event, 'workingDays')}
          />
          <div classparam="d-flex flex-column">
            <button classparam="counter">^</button>
            <button classparam="counter"><span classparam="upside-down">^</span></button>
          </div>
          
        </div>
          

          

          
        </div>
      </div>



     

      
    </div>
  )
}

export default EditParameters;

