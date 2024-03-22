import React, {useState, useEffect, useContext, useRef} from "react";
import { v4 as uuidv4 } from 'uuid';

import Loading from "../../pop-ups/loading";
import "../../css/display-groups.css"

import useComparisonRequests from "../../hooks/comparison-requests";
import useDistanceRequests from "../../hooks/distance-request";
import { UserContext } from "../../context/context";
import { AccessTokenContext } from "../../context/context";

const AutoGroups = ({ handleDragStart, openModal, patientGroups, myEvents, start, end }) => {

  const { abbrevationFix } = useComparisonRequests();
  const { saveAutoGroups } = useDistanceRequests();

  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const [currentEvents, setCurrentEvents] = useState([]); 
  const [autoGroups, setAutoGroups] = useState({});

  const isInitialMount = useRef(true);

  useEffect(() => {
    const viewStart = new Date(start.setHours(0, 0, 0, 0)).getTime();
    const viewEnd = new Date(end.setHours(23, 59, 59, 999)).getTime();

    const eventsUsed = myEvents.filter((event) => {
      const eventStart = new Date(event.start).getTime();
      return eventStart >= viewStart && eventStart <= viewEnd;
    });

    setCurrentEvents(eventsUsed);
    setAutoGroups(patientGroups);
  }, [myEvents, start]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; 
      return;
    }

    if(patientGroups.visits.length > 0) {
      const newPatientGroups = patientGroups.visits.map((group) => {
        const newPatients = group.map((patient) => {
          const isScheduled = currentEvents.find((ev) => {
            return ev.id === patient.manualScheduled;
          });

          if(!isScheduled) {
            const patAddress = abbrevationFix(patient.address);
            const eventInstances = currentEvents.filter((event) => {
              const evAddress = abbrevationFix(event.address);
              return evAddress === patAddress && `${patient.firstName} ${patient.lastName}` === event.title;
            });

            const patientInstances = patientGroups.visits.flat().filter((pat) => pat._id === patient._id);

            if(eventInstances.length === 1 && patientInstances.length === 1) {
              patient.manualScheduled = eventInstances[0].id;
              patient.isScheduled = true;
            } else if(eventInstances.length === patientInstances.length) {
              const noScheduledPairsPat = patientInstances.filter((patient) => {
                const isPair = eventInstances.find((ev) => {
                  return ev.id === patient.manualScheduled;
                });

                return !isPair;
              });

              const noScheduledPairsEvent = eventInstances.filter((ev) => {
                const isPair = patientInstances.find((patient) => {
                  return ev.id === patient.manualScheduled;
                });

                return !isPair;
              });

              if(noScheduledPairsPat.length === 1 && noScheduledPairsEvent.length === 1) {
                patient.manualScheduled = noScheduledPairsEvent[0].id;
                patient.isScheduled = true;
              } else {
                patient.manualScheduled = 'NONE';
                patient.isScheduled = false;
              }
            } else {
                patient.manualScheduled = 'NONE';
                patient.isScheduled = false;
            }
          } else {
            patient.isScheduled = true;
          }

          return patient;
        });

        return newPatients;
      });

      setAutoGroups((prev) => ({
        ...prev,
        visits: newPatientGroups
      }));
    }
  }, [currentEvents]);
  
  const moveToCalendar = (pat, index, patIndex) => {
    const eventId = uuidv4();
    handleDragStart(`${pat.firstName} ${pat.lastName}`, pat.address, pat.coordinates, index, false, eventId); 
    handleCheckName(pat, index, patIndex, eventId);
  };

  const handleCheckName = (patient, groupIndex, patIndex, eventId) => {
    patient.manualScheduled = eventId;
    const newGroups = [...autoGroups.visits];
    newGroups[groupIndex][patIndex] = patient;

    setAutoGroups((prev) => ({
      ...prev,
      visits: newGroups
    }));

    saveChanges();
  };

  const saveChanges = async () => {
    await saveAutoGroups(user._id, accessToken, patientGroups);
  };

  const handleOpenModal = (patient, groupIndex, patientIndex) => {
    const allPatients = autoGroups.visits.flat();
    const matchingPatients = allPatients.filter((p) => p._id === patient._id);

    const availableEvents = currentEvents.filter((ev) => {
      const isScheduled = matchingPatients.find((p) => p.manualScheduled === ev.id);
      return !isScheduled && ev.title === `${patient.firstName} ${patient.lastName}`;
    });

    openModal('PatientGroupModal', {patient: patient, availableEvents: availableEvents, groupNum: groupIndex, groups: autoGroups.visits, patientIndex: patientIndex})
  };

  return(
    <div className="container">
      {
        autoGroups.visits && autoGroups.visits.length > 0 ? 
        (
          <div className="row">
            {
            autoGroups.visits.map((group, index) => (
              <div key={index} className="col-4 group">
                {
                  group.map((pat, patIndex) => (
                    <div key={pat._id} 
                    className={`person-man-cont man-w-h ${pat.isScheduled ? 'freq-fulfilled' : ''}`}
                    draggable onDragStart={() => moveToCalendar(pat, index, patIndex)}
                    onClick={() => handleOpenModal(pat, index, patIndex)}
                    >
                      {pat.firstName}
                    </div>
                  ))
                }
              </div>
            ))
            }
          </div>
        ) : <div>Nope</div>
      }
    </div>
  )
}

export default AutoGroups;