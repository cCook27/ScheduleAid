import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import useDistanceRequests from "../hooks/distance-request";

const InitiateGroupingModal = ({ userId, accessToken, modalProps, closeModal }) => {
  const { initiateGroupSet } = useDistanceRequests();
  
  const [formData, setFormData] = useState({
    manualGroupId: uuidv4(),
    week: modalProps.start,
    setName: '',
    groups: []
  });

  useState(() => {
    const date = new Date(modalProps.start);
    const day = date.getDate() + 1;
    const month = (date.getMonth() + 1);
    const year = date.getFullYear();

    const formattedDate = month + '/' + day + '/' + year;

    setFormData({
      ...formData,
      week: formattedDate
    });
  }, [modalProps]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    initiateGroupSet(userId, accessToken, formData);
    closeModal();
  };

  return (
    <div className="container-fluid">
      <div className="row my-2">
          <div className="col d-flex justify-content-center flex-column">
            <h4 className='sched-title'>Initiate Group Creation</h4>
          </div>
          <div className="col">
            <div className='d-flex justify-content-end'>
              <button type="button" className="btn-close close-all close-all-custom btn-close-create" aria-label="Close"
              onClick={() => closeModal()}></button>
            </div>
          </div>
      </div>
      <div className="row my-2">
        <div className="col">
          <div className="npat-cont">
            <label className='nPat-label my-2'>Week Of</label>
            <input
              className="form-control npat-input"
              id="week"
              name="week"
              value={formData.week}
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <div className="npat-cont">
            <label className='nPat-label my-2'>Set Name</label>
            <input
              className="form-control npat-input"
              placeholder="e.g. West Group"
              id="setName"
              name="setName"
              value={formData.setName}
              onChange={(event) => handleInputChange(event)}
            />
          </div>
        </div>
      </div>
      <div className="row mt-4 pe-3">
        <div className="col d-flex justify-content-end align-items-center">
          <button disabled={formData.week === '' || formData.setName === '' } onClick={handleSave} className="add-btn btn save">Save</button>
        </div>
        </div>
    </div>
  )
};

export default InitiateGroupingModal;