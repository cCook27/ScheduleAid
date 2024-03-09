import React, { useEffect, useContext, useState, useRef } from "react";
import { useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import useDistanceRequests from "../../hooks/distance-request";
import useComparisonRequests from "../../hooks/comparison-requests";
import { UserContext, AccessTokenContext } from '../../context/context';

import add_group from './assets/add_group.svg';
import check_mark from './assets/check_mark.svg';
import x_mark from './assets/x_mark.svg';

import "../../css/manual-grouping.css";

const ManualGrouping = ({ handleDragStart, openModal, patients, myEvents, start, end, }) => {
  const { saveGroupSet, retrieveGroupSet } = useDistanceRequests();
  const { abbrevationFix } = useComparisonRequests();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const [groupSet, setGroupSet] = useState({ setName: undefined, setId: uuidv4(), weekStart: start, weekEnd: end, groups: [] });
  const [editMode, setEditMode] = useState("Edit");
  const [groupChange, setGroupChange] = useState(false);
  const [remainingPatients, setRemainingPatients] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [onDeck, setOnDeck] = useState({patient: undefined, groupIndex: undefined, patIndex: undefined, assignedEvent: undefined});

  const groupSetRef = useRef(groupSet);
  const groupChangeRef = useRef(groupChange);

  useEffect(() => {

    if(patients) {
      const viewStart = new Date(start.setHours(0, 0, 0, 0)).getTime();
      const viewEnd = new Date(end.setHours(23, 59, 59, 999)).getTime();

      const activePatients = patients.filter((patient) => patient.active);
      
      const eventsUsed = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });

      setCurrentEvents(eventsUsed);
  
      const patientsToReport = activePatients.map((patient) => {
        const patAddress = abbrevationFix(patient.address);
        const frequency = parseInt(patient.frequency);
        
        const patientsEvents =  eventsUsed.filter((event) => {
          const evAddress = abbrevationFix(event.address);

          return evAddress === patAddress && event.title === `${patient.firstName} ${patient.lastName}`
        });
      
        if(frequency > patientsEvents.length) {
          patient.additional = false;
          return patient;
        };
        
        if(frequency < patientsEvents.length || frequency === patientsEvents.length){
          patient.additional = true;
          return patient;
        };
      });
  
      setRemainingPatients(patientsToReport);

      
    }
  
  },[myEvents, start]);

  useEffect(() => {
    if(groupSet.groups.length > 0 && editMode === 'Schedule') {
      const allPatientGroups = groupSet.groups.map((groupObj) => groupObj.pats);

      const newPatientGroups = allPatientGroups.map((group) => {
        const patients = group.map((patient) => {
          const isScheduled = currentEvents.find((ev) => {
            return ev.id === patient.manualScheduled;
          });
          patient.isScheduled = isScheduled ? true : false;

          return patient;
        });
        return patients;
      });

      setGroupSet(prev => {
        const newGroups = prev.groups.map((groubObj, index) => {
          const newPats = newPatientGroups[index];
          return {...groubObj, pats: newPats};
        });
        return {...prev, groups: newGroups}
      });
    }

  }, [currentEvents, editMode]);

  useEffect(() => {
    groupSetRef.current = groupSet;
    if (!groupChange) {
      setGroupChange(true);
    }
  }, [groupSet]);
  
  useEffect(() => {
    groupChangeRef.current = groupChange;
  }, [groupChange]);

  useEffect(() => {
    const storedSetId = localStorage.getItem('setId');
    getGroupSet(storedSetId);

    return () => {
      handleSaveGroupSet();
    };
  }, []);
  
  useEffect(() => {
    if (!editMode) {
      handleSaveGroupSet();
    }
  }, [editMode]);

  const getGroupSet = async (storedSetId) => {
    const groupSetReturned = await retrieveGroupSet(user._id, accessToken, storedSetId);
    setGroupSet(groupSetReturned);
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('setId', groupSetRef.current.setId);
    } catch (error) {
      console.error("Error saving data to local storage", error);
    }
  };
  
  const handleSaveGroupSet = () => {
    setEditMode('Schedule');
    if (groupChangeRef) {
      if (groupSetRef.current.groups.length > 0) {
        if (groupSetRef.current.groups.length === 1) {
          if (groupSetRef.current.groups[0].pats.length > 0 || groupSetRef.current.setName) {
            saveToLocalStorage();
            saveGroupSet(user._id, accessToken, groupSetRef.current);
          } 
        } else {
          saveToLocalStorage();
          saveGroupSet(user._id, accessToken, groupSetRef.current);
        }
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
    setEditMode(value);
  };
  
  const handleAddGroup = () => {
    setGroupSet((prev) => ({
      ...prev,
      groups: [...prev.groups, { pats: [] }]
    }));
  };

  const handleNewGroupSet = () => {
    handleSaveGroupSet();
    setGroupSet({ setName: undefined, setId: uuidv4(), weekStart: start, weekEnd: end, groups: [] });
    setEditMode('Edit');
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

  const moveToCalendar = (pat, index, patIndex) => {
    const eventId = uuidv4();
    handleDragStart(`${pat.firstName} ${pat.lastName}`, pat.address, pat.coordinates, index, false, eventId); 
    // setOnDeck({patient: pat, groupIndex: index, patIndex: patIndex, assignedEvent: eventId});
    handleCheckName(pat, index, patIndex, eventId);
  };

  const handleCheckName = (patient, groupIndex, patIndex, eventId) => {
    patient.manualScheduled = eventId;
    groupSet.groups[groupIndex].pats[patIndex] = patient;
    const updatedPatient = { ...patient, manualScheduled: eventId };
    const updatedGroup = [...groupSet.groups];
    updatedGroup[groupIndex].pats[patIndex] = updatedPatient;
    setGroupSet({ ...groupSet, groups: updatedGroup });
  };

  const handleUnCheckName = (patient, groupIndex, patIndex) => {
    // patient.manualScheduled = false;
    // groupSet.groups[groupIndex].pats[patIndex] = patient;
    // const updatedPatient = { ...patient, manualScheduled: false };
    // const updatedGroup = [...groupSet.groups];
    // updatedGroup[groupIndex].pats[patIndex] = updatedPatient;
    // setGroupSet({ ...groupSet, groups: updatedGroup });
  };

  return (
    <div className="container">
      <div className="row top-row">
        <div className="col-3 d-flex justify-content-center">
          <button className="btn manual-btns">Find Groups</button>
        </div>

        <div className="col-3 d-flex justify-content-center">
          <button className="btn manual-btns" onClick={handleNewGroupSet}>Start Fresh</button>
        </div>

        <div className="col-3 d-flex justify-content-center">
          <select className="form-select" value={editMode} onChange={handleModeSelection}>
            <option value="Edit">Edit</option>
            <option value="Schedule">Schedule</option>
          </select>
        </div>

        <div className="col-3 d-flex justify-content-center">
          <button className="btn manual-btns" onClick={handleSaveGroupSet}>Save Work</button>
        </div>
      </div>

      <div className="row py-3">
        <div className="col d-flex justify-content-start">
          {editMode === 'Edit' && <button className="btn add-man-group-btn d-flex align-items-center" onClick={handleAddGroup}>
            <span className="d-flex align-items-center">
              <img className="add-group-icon" src={add_group} alt="add" />
            </span>
            Add Group
          </button>} 
        </div>
      </div>
      
      <div className="row edit-section pb-3">
        {
          editMode === 'Edit' && groupSet.groups.length > 0 ?
            groupSet.groups.map((groupCont, index) => (
              <div key={index} onDrop={(e) => onDrop(e, index)} className="col-4">
                <div className="group-cont p-1 mb-2">
                  <div className="row">
                    <div className="col">
                      <div className='d-flex justify-content-end'>
                        <button type="button" className="del-group-x d-flex justify-content-end btn-close" aria-label="Close"
                        onClick={() => handleClose(index)}></button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="d-flex justify-content-center">
                      <h6> Group { index+1 }</h6>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col d-flex justify-content-center align-items-center flex-column">
                      {
                        groupCont.pats.length > 0 ?
                          groupCont.pats.map((pat, patIndex) => (
                            <div key={patIndex} className="person-man-cont man-w-h">
                              <div className="row d-flex align-items-center">
                                <div className="col-10">
                                  <div className="name-man ellipsis-overflow"> <span className="me-1">{pat.firstName}</span> <span>{pat.lastName}</span></div>
                                </div>
                                <div className="col-2">
                                  <div className="d-flex justify-content-end">
                                    <button onClick={() => delPatient(pat, index)} type="button" className="del-pat-x btn-close" aria-label="Close"></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )) : null
                      }
                    </div>
                  </div>
                </div>
                
                
              </div>
            )) : null
          
        }
      </div>

      <div className="row pat-section">
        {
          editMode === 'Edit' && groupSet.groups.length > 0 && patients && patients.length > 0 ?
          remainingPatients.map((patient) => 
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
          editMode === 'Schedule' && groupSet.groups.length > 0 ?
            groupSet.groups.map((groupCont, index) => (
              <div key={index} className="col-4">
                <div className="group-cont p-1 mb-2">
                  <div className="row">
                    <div className="col">
                      <div className="d-flex justify-content-start">
                      <h6> Group { index+1 }</h6>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col d-flex justify-content-start align-items-center flex-column">
                      {
                        groupCont.pats.length > 0 ?
                          groupCont.pats.map((pat, patIndex) => (
                            <div key={patIndex} className={`person-man-cont man-w-h ${pat.isScheduled ? 'freq-fulfilled' : ''}`} draggable onDragStart={() => moveToCalendar(pat, index, patIndex)}>
                              <div className="row">
                                <div className="col-10">
                                  <div className="name-man d-flex justify-content-start ellipsis-overflow"> <span className="me-1">{pat.firstName}</span> <span>{pat.lastName}</span></div>
                                </div>
                                <div className="col-2 d-flex justify-content-end">

                                  {
                                    !pat.manualScheduled ? 
                                    (
                                      <button className="check-mark-btn d-flex align-items-center" onClick={() => handleCheckName(pat, index, patIndex)}>
                                        <img className="check-mark-icon" src={check_mark} alt="add" />  
                                      </button>
                                    ): 
                                    (
                                      <button className="check-mark-btn d-flex align-items-center" onClick={() => handleUnCheckName(pat, index, patIndex)}>
                                        <img className="check-mark-icon" src={x_mark} alt="add" />  
                                       </button>
                                    )
                                  }                                 
                                </div>
                              </div>
                            </div>
                          )) : null
                      }
                    </div>
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


