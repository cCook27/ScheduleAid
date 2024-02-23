import React, { useEffect, useContext, useState, useRef } from "react";
import { useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import useDistanceRequests from "../../hooks/distance-request";
import { UserContext, AccessTokenContext } from '../../context/context';

import "../../css/manual-grouping.css";

// Would you like to add a group name also a save btn and edit/production btn

const ManualGrouping = ({ handleDragStart, openModal, patients, myEvents, start, end, }) => {
  const { saveGroupSet } = useDistanceRequests();
  // const { data: patient, status, refetch } = useQuery('patient', () => viewPatient(user._id, id, accessToken));
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const [groupSet, setGroupSet] = useState({ name: undefined, setId: uuidv4(), weekStart: start, weekEnd: end, groups: [] });
  const [editMode, setEditMode] = useState(true);

  const groupSetRef = useRef(groupSet);

   useEffect(() => {
        groupSetRef.current = groupSet;
    }, [groupSet]);

   useEffect(() => {
    return () => {
      // handleSaveGroupSet();
    };
   }, []);
  
  useEffect(() => {
    if (!editMode) {
      // handleSaveGroupSet()
    }
  }, [editMode]);
  
  const handleSaveGroupSet = () => {
    if (groupSetRef.current.groups.length > 0) {
      if (groupSetRef.current.groups.length === 1) {
        if (groupSetRef.current.groups[0].pats.length > 0) {
          saveGroupSet(user._id, accessToken, groupSetRef.current);
        }
      } else {
        saveGroupSet(user._id, accessToken, groupSetRef.current);
      }
    }
  };

  const handleSetName = (event) => {
    const newName = event.target.value;

    setGroupSet((prev) => ({
      ...prev,
      setName: newName
    }));
  };

  const handleModeSelection = (event) => {
    const value = event.target.value;
    if (value === 'Edit') {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  };
  
  const handleAddGroup = () => {
    setGroupSet((prev) => ({
      ...prev,
      groups: [...prev.groups, { pats: [] }]
    }));
  };

  const handleClose = (delIndex) => {
    const filteredGroups = groupSet.groups.filter((group, index) => index !== delIndex);
    setGroupSet((prev) => ({
      ...prev,
      groups: filteredGroups
    }));
  };

  const startDrag = (event, patId) => {
    event.dataTransfer.setData("patId", patId);
  };

  const onDrop = (event, groupIndex) => {
    const patientId = event.dataTransfer.getData("patId");
    const patientRetrieved = patients.filter((pat) => pat._id === patientId);
    let groupToChange = [...groupSet.groups][groupIndex];
    groupToChange.pats.push(patientRetrieved[0]);

    const groupSetToUpdate = [...groupSet.groups];
    groupSetToUpdate[groupIndex] = groupToChange;
    setGroupSet((prev) => ({
      ...prev,
      groups: groupSetToUpdate
    }));
  };

  const delPatient = (patient, groupIndex) => {
    const groupToUpdate = [...groupSet.groups][groupIndex].pats;
    const indexToRemove = groupToUpdate.findIndex((pat) => pat._id == patient._id);
    groupToUpdate.splice(indexToRemove, 1);

    const updatedgroupSet = [...groupSet.groups];
    updatedgroupSet[groupIndex].pats = groupToUpdate;

    setGroupSet((prev) => ({
      ...prev,
      groups: updatedgroupSet
    }));
  };

  return (
    <div className="container">
      <div className="row top-row">
        <div className="col-4">
          {/* disabled if it's on schedule mode */}
          <button disabled={!editMode} onClick={handleAddGroup}>Add Group</button>
        </div>

        <div className="col-4">
          <select onChange={handleModeSelection}>
            <option value="Edit">Edit Mode</option>
            <option value="Schedule">Schedule Mode</option>
          </select>
        </div>

        <div className="col-4">
          <button onClick={handleSaveGroupSet}>Save My Work</button>
        </div>
      </div>
      
      <div className="row edit-section">
        {
          editMode && groupSet.groups.length > 0 ?
            groupSet.groups.map((groupCont, index) => (
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
                            <div className="person-man-cont man-w-h">
                              <div className="row">
                                <div className="col">
                                  <div className='d-flex justify-content-end del-pat'>
                                    <button onClick={() => delPatient(pat, index)} type="button" className="del-pat-x pb-0 pe-0 d-flex justify-content-end btn-close" aria-label="Close"></button>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col">
                                  <div className="name-man ellipsis-overflow"> <span className="me-1">{pat.firstName}</span> <span>{pat.lastName}</span></div>
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
          editMode && groupSet.groups.length > 0 && patients && patients.length > 0 ?
            patients.map((patient) => 
            (   
              <div key={patient._id} className="col-2 d-flex justify-content-center align-items-center flex-column patient-card" >
                <div 
                  draggable 
                  onDragStart={(e) => startDrag(e, patient._id)}
                  className={`person-man-cont d-flex flex-column justify-content-center align-items-center ${patient.additional ? 'freq-fulfilled' : ''}`}
                >
                  <div className="name-man ellipsis-overflow"> <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span></div>
                  <div className="address ellipsis-overflow">{patient.address}</div>
                </div>
              </div>
            ) 
          ): null
        }
      </div>

      <div className="row schedule-section">
        {
          !editMode && groupSet.groups.length > 0 ?
            groupSet.groups.map((groupCont, index) => (
              <div key={index} className="col-4">
                <div className="group-cont p-1">
                  <div className="row">
                    <div className="col">
                      <div className="d-flex justify-content-start">
                      <h6> Group { index+1 }</h6>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    {
                      groupCont.pats.length > 0 ?
                        groupCont.pats.map((pat, patIndex) => (
                          <div key={patIndex} className="col">
                            <div className="person-man-cont man-w-h" draggable onDragStart={() => handleDragStart(`${pat.firstName} ${pat.lastName}`, pat.address, pat.coordinates, index)}>
                              <div className="row">
                                <div className="col">
                                  <div className="name-man ellipsis-overflow"> <span className="me-1">{pat.firstName}</span> <span>{pat.lastName}</span></div>
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

    </div>
  )
};

export default ManualGrouping;