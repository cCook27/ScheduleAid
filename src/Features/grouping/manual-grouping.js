import React, { useEffect, useContext, useState } from "react";
import { useQuery } from 'react-query';

import useDistanceRequests from "../../hooks/distance-request";
import { UserContext, AccessTokenContext } from '../../context/context';

import "../../css/manual-grouping.css";

const ManualGrouping = ({ openModal, patients, myEvents, start, end, }) => {
  const { getGroupSet, retrieveGroupSets } = useDistanceRequests();
  // const { data: patient, status, refetch } = useQuery('patient', () => viewPatient(user._id, id, accessToken));
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const [currentGroups, setCurrentGroups] = useState([]);

  const handleAddGroup = () => {
    setCurrentGroups([...currentGroups, {pats:[]}])
  };

  const handleClose = (delIndex) => {
    const filteredGroups = currentGroups.filter((group, index) => index !== delIndex);
    setCurrentGroups(filteredGroups);
  };

  const startDrag = (event, patId) => {
    event.dataTransfer.setData("patId", patId);
  };

  const onDrop = (event, groupIndex) => {
    const patientId = event.dataTransfer.getData("patId");
    const patientRetrieved = patients.filter((pat) => pat._id === patientId);
    let groupToChange = [...currentGroups][groupIndex];
    groupToChange.pats.push(patientRetrieved[0]);

    const currentGroupsToUpdate = [...currentGroups];
    currentGroupsToUpdate[groupIndex] = groupToChange;
    setCurrentGroups(currentGroupsToUpdate);
  };

  const delPatient = (patient, groupIndex) => {
    const groupToUpdate = [...currentGroups][groupIndex].pats;
    const indexToRemove = groupToUpdate.findIndex((pat) => pat._id == patient._id);
    groupToUpdate.splice(indexToRemove, 1);

    const updatedCurrentGroups = [...currentGroups];
    updatedCurrentGroups[groupIndex].pats = groupToUpdate;

    setCurrentGroups(updatedCurrentGroups);
  };

  return (
    <div className="container">
      <div className="row top-row">
        <div className="col">
          <button onClick={handleAddGroup}>Add Group</button>
        </div>
      </div>
      
      <div className="row mid-section">
        {
          currentGroups.length > 0 ?
            currentGroups.map((groupCont, index) => (
              <div key={index} onDrop={(e) => onDrop(e, index)} className="col-4">
                <div className="group-cont p-1">
                  <div className="row">
                    <div className="col">
                      <div className="d-flex justify-content-start">
                      <h6> Group { index+1 }</h6>
                      </div>
                    </div>
                    <div className="col">
                      <div className='d-flex justify-content-end'>
                        <button type="button" className="d-flex justify-content-end btn-close close-all close-all-custom btn-close-create" aria-label="Close"
                        onClick={() => handleClose(index)}></button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    {
                      groupCont.pats.length > 0 ?
                        groupCont.pats.map((pat, patIndex) => (
                          <div key={patIndex} className="col">
                            <div className="person-cont">
                              <div className="row">
                                <div className="col">
                                  <div className='d-flex justify-content-end del-pat'>
                                    <button onClick={() => delPatient(pat, index)} type="button" className="del-pat-x pb-0 pe-0 d-flex justify-content-end btn-close" aria-label="Close"></button>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col">
                                  <div className="name ellipsis-overflow"> <span className="me-1">{pat.firstName}</span> <span>{pat.lastName}</span></div>
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        )) : null
                    }
                  </div>
                </div>
                
                
              </div>
            )) : null
          
        }
      </div>

      <div className="row pat-section">
        {
          currentGroups.length > 0 && patients && patients.length > 0 ?
            patients.map((patient) => 
            (   
              <div key={patient._id} className="col-4 d-flex justify-content-center align-items-center flex-column patient-card" >
                <div 
                  draggable 
                  onDragStart={(e) => startDrag(e, patient._id)}
                  className={`person-cont d-flex flex-column justify-content-center align-items-center ${patient.additional ? 'freq-fulfilled' : ''}`}
                >
                  <div className="name ellipsis-overflow"> <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span></div>
                  <div className="address ellipsis-overflow">{patient.address}</div>
                </div>
              </div>
            ) 
          ): null
        }
      </div>

    </div>
  )
};

export default ManualGrouping;