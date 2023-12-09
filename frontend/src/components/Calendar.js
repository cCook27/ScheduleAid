import React, {useEffect, useContext, useState, useCallback} from 'react';
import '../css/calendar.css';
import { v4 as uuidv4 } from 'uuid';
import { useQuery, useQueryClient } from 'react-query';

import { UserContext, AccessTokenContext } from '../context/context';
import useDistanceRequests from '../hooks/distance-request';
import useHomeRequests from '../hooks/home-requests.js';
import useScheduleRequests from '../hooks/schedule-requests';

import { momentLocalizer, Calendar as BigCalendar } from 'react-big-calendar';
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import DisplayGroups from '../Features/display-groups';
import DisplayPatients from '../Features/display-patients';
import GroupModal from '../pop-ups/group-modal';
import ErrorModal from '../pop-ups/error-modal';
import PatientModal from '../pop-ups/patient-modal';

const DnDCalendar = withDragAndDrop(BigCalendar);
const localizer = momentLocalizer(moment);


function Calendar(props) {
  const queryClient = useQueryClient();

  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const {getHomes} = useHomeRequests();
  const {getTimeDistances, createGroups} = useDistanceRequests();
  const {saveUserSchedule, getUserSchedule, deleteSchedule, deletePatientSchedule} = useScheduleRequests();

  const [myEvents, setMyEvents] = useState([]);
  const [draggedClient, setDraggedClient] = useState();
  const [modal, setModal] = useState({
    patient: false,
    group: false,
    error: false
  });
  const [client, setClient] = useState(null);
  const [calViewChange, setCalViewChange] = useState(false);
  const [viewFocus, setViewFocus] = useState({
    showGroups: false,
    groupParams: false,
    view: 'Patient'
  });
  const [testSelection, setTestSelection] = useState(undefined);
  const [patientGroups, setPatientGroups] = useState(undefined);
  const [groupsForPatientModal, setGroupsForPatientModal] = useState([]);
  const [therapistParameters, setTherapistParameters] = useState({
    workingDays: null,
  });
  const [viewStartDate, setViewStartDate] = useState(null);
  const [viewEndDate, setViewEndDate] = useState(null);

  const { data: homes, homeStatus } = useQuery(["homes"], 
    () => getHomes(user._id, accessToken)
  );

  const { data: dbSchedule, dbScheduleStatus } = useQuery(["schedule"], 
    () => getUserSchedule(user._id, accessToken), {
      onSuccess: (data) => {
        fillInCalendar(data); 
      },
    }
  );

  const handleNavigate = date => {
    let newStart, newEnd;

    const newDate = new Date(date);
    const today = new Date(moment())

    if(newDate.getTime() > today.getTime()) {
      newStart = localizer.add(viewStartDate, 7, 'days');
      newEnd = localizer.add(viewEndDate, 7, 'days');
    } else {
      newStart = localizer.add(viewStartDate, -7, 'days');
      newEnd = localizer.add(viewEndDate, -7, 'days');
    }

    setViewStartDate(newStart);
    setViewEndDate(newEnd);
  };

  useEffect(() => {
    const currentDay = new Date(moment().toLocaleString('en-US', { weekday: 'short' })).getDay();
    const startDate = localizer.add(moment(), -currentDay, 'days');
    const endDate = localizer.add(moment(), (6-currentDay), 'days'); 

    setViewStartDate(startDate);
    setViewEndDate(endDate);
  }, []);

  useEffect(() => {
    saveUserSchedule(user._id, myEvents, accessToken);
  }, [myEvents]);

  useEffect(() => {
    setTherapistParameters((prev) => ({
      ...prev,
      workingDays: user.workingDays
    }));
  }, []);

  useEffect(() => {
    const timeSlots = document.querySelectorAll('.rbc-time-slot');
    const timeSlotsGroups = document.querySelectorAll('.rbc-timeslot-group');

    for (let i = 0; i < timeSlots.length; i++) {
      if (i % 6 !== 0) {
        const label = timeSlots[i].querySelector('.rbc-label');
        if (label) {
          label.style.display = 'none';
        }
      }
    }

    for (let i = 0; i < timeSlotsGroups.length; i++) {
      if (i % 6 === 0) {
        const slotGroup = timeSlotsGroups[i];
        slotGroup.style.border = '1px solid #a5a4a4';
      }
    }
  },[calViewChange]);

  const changeView = () => {
    setCalViewChange(!calViewChange);
  };
  
  const eventPropGetter = (event) => ({
    ...(event.isViableDest === false && event.isViableOrg === true && {
      className: 'orgVDestN',
    }),
    ...(event.isViableDest === true && event.isViableOrg === false && {
      className: 'orgNDestV',
    }),

    ...(event.isViableDest === false && event.isViableOrg === null && {
      className: 'orgNullDestN',
    }),
    ...(event.isViableDest === null && event.isViableOrg === false && {
      className: 'orgNDestNull',
    }),

    ...(event.isViableDest === null && event.isViableOrg === true && {
      className: 'orgVDestNull',
    }),
    ...(event.isViableDest === true && event.isViableOrg === null && {
      className: 'orgNullDestV',
    }),
    ...(event.isViableDest === false && event.isViableOrg === false && {
      className: 'bothNotViable',
    }),
    ...(event.isViableDest === true && event.isViableOrg === true && {
      className: 'bothViable',
    }),
    ...(event.groupNumber === undefined && viewFocus.view === 'Group' && {
      className: 'assign-day',
    }),
  });

  const handleEventsUpdate = (events) => {
    setMyEvents(events);
  };  
  
  const handleUpdatedGroups = (groups) => {
    setGroupsForPatientModal(groups);
  };

  const eventViability = (viabilityData) => {
    if(viabilityData) {
      viabilityData.forEach((element) => {
        setMyEvents((prev) => {
          let origin = prev.find((event) => event.id === element.originId);
          origin.isViableOrg = element.isViable;

          const filteredState = prev.filter((event) => event.id !== element.originId);

          return [...filteredState, {...origin}]
        });

        setMyEvents((prev) => {
          let destination = prev.find((event) => event.id === element.destinationId);
          destination.isViableDest = element.isViable;

          const filteredState = prev.filter((event) => event.id !== element.destinationId);

          return [...filteredState, {...destination}]
        });

      });
    } else {
      setModal(prev => ({
        ...prev,
        error: true
      }));
    }
    
  };

  const fillInCalendar = (dbSchedule) => {
    const schedule = dbSchedule.map((event) => {
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);

      event.start = startTime;
      event.end = endTime;

      return event; 
    });

    
    setMyEvents([...schedule]);
  }

  const newEvent = useCallback(
    (event) => {
      setMyEvents((prev) => {
        return [...prev, { ...event }]
      });
    },
    [setMyEvents]
  );

  const onDropFromOutside = useCallback(
    ({ start, allDay: isAllDay }) => {

      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const {client, address, coordinates, groupNumber} = draggedClient;
      const calId = uuidv4();

      const event = {
        title: client,
        id: calId,
        address: address,
        coordinates: coordinates,
        groupNumber: groupNumber,
        start,
        end,
        isAllDay,
        isViableOrg: null,
        isViableDest: null,
      }

      newEvent(event);
    },
    [newEvent, draggedClient]
  );

  const moveEvent = useCallback(
    ({event, start, end, allDay: isAllDay}) => {
  
      setMyEvents((prev) => {
        const existingEvent = prev.find((ev) => ev.id === event.id); 
        const filteredState = prev.filter((ev) => ev.id !== event.id);

        existingEvent.isViableOrg = null;
        existingEvent.isViableDest = null;

        return [...filteredState, {...existingEvent, start, end, isAllDay}]
      });
    }, 
      [setMyEvents]
  );

  const handleDragStart = useCallback(
    (client, address, coordinates, groupNumber) => {
      setDraggedClient({client: client, address: address, coordinates: coordinates, groupNumber: groupNumber});
  },[])
  
  const testSchedule = async () => {
    const viewStart = new Date(viewStartDate).getTime();
    const viewEnd = new Date(viewEndDate).getTime();

    const selectedDaySchedule = myEvents.filter((event) => {
      const day = event.start.toLocaleString('en-US', { weekday: 'long' });

      const start = new Date(event.start).getTime();

      return day === testSelection && (start >= viewStart && start <= viewEnd);
    }).sort((a, b) => a.start - b.start);

    const noGroupAssigned = selectedDaySchedule.filter((ev) => !ev.groupNumber);

    if(viewFocus.view === 'Group') {
      if(selectedDaySchedule.length > 1 && noGroupAssigned.length === 0) {
        const viabilityData = await getTimeDistances(selectedDaySchedule, accessToken);
        eventViability(viabilityData);
        setTestSelection(undefined);
      }; 
      
      if(selectedDaySchedule.length <= 1) {
        window.alert(`Please make sure there are at least 2 patients on ${testSelection}.`);
      };
      
      if(noGroupAssigned.length > 0) {
        window.alert(`Before proceeding please assign the ${noGroupAssigned.length} patients in red to a group by clicking the patient and choosing a corresponding group number or return to patient view.`);
      };
    }

    if(viewFocus.view === 'Patient') {
      if(selectedDaySchedule.length > 1) {
        const viabilityData = await getTimeDistances(selectedDaySchedule, accessToken);
        eventViability(viabilityData);
        setTestSelection(undefined);
      } else {
        window.alert(`Please make sure there are at least 2 patients on ${testSelection}.`);
      }
    }

    
  };

  const removeAllEvents = () => {
    setMyEvents([]);
    deleteSchedule(user._id, accessToken)
  };

  const selectEvent = (event) => {
      const date = new Date(event.start);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; 
      const day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();

      if(minutes === 0) {
        minutes = '00'
      }

      if(hours === 0) {
        hours = '12'
      }

      setModal(prev => ({
        ...prev,
        patient: true
      }));

      setClient({title: event.title,
                address: event.address,
                 id: event.id,
                 start: `${month}-${day}-${year} at ${hours}:${minutes}`,
                });
  };
  
  const viewCheck = async (event) => {
    if(event.target.id === 'Group') {

      setViewFocus(prev => ({
        ...prev,
        view: 'Group'
      }));

      handleGrouping();
    } else if(event.target.id === 'Patient') {
        setViewFocus(prev => ({
          ...prev,
          showGroups: false,
          groupParams: false,
          view: 'Patient'
        }));
    } else if(event.target.id === 'Edit') {
        setViewFocus(prev => ({
          ...prev,
          showGroups: false,
          groupParams: true,
          view: 'Edit'
        }));
    } 
  };

  const testSelectionCheck = (event) => {
    switch (event.target.id) {
      case 'Sunday':
        setTestSelection('Sunday');
        break;
      case 'Monday':
        setTestSelection('Monday');
        break;
      case 'Tuesday':
        setTestSelection('Tuesday');
        break;
      case 'Wednesday':
        setTestSelection('Wednesday');
        break;
      case 'Thursday':
        setTestSelection('Thursday');
        break;
      case 'Friday':
        setTestSelection('Friday');
        break;
      case 'Saturday':
        setTestSelection('Saturday');
        break;
      default:
        setTestSelection(undefined);
        break;
    }
  }

  const handleTherapistParameters = (event) => {
    const {name, value} = event.target;
    setTherapistParameters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGrouping = async () => {
    setPatientGroups(null);

    const returnedGroups = await createGroups(
      user._id, 
      accessToken, 
      therapistParameters
    );

    setPatientGroups(returnedGroups);
    setViewFocus(prev => ({
      ...prev,
      showGroups: true,
      groupParams: false,
      view: 'Group'
    }))
  };

  const removeFromCal = (id) => {
    setMyEvents((prev) => {
      const filteredState = prev.filter((ev) => ev.id !== id);
      deletePatientSchedule(user._id, filteredState, accessToken);
      return [...filteredState];
    });

    setModal(prev => ({
      ...prev,
      patient: false
    }));
    setClient(null);
  };

  const closeModal = () => {
    setModal(prev => ({
      ...prev,
      patient: false,
      group: false,
      error: false
    }));
    setClient(null);
  };
 
  return (
    <div className="container-fluid">
      <div className={`row my-5 ${modal.patient | modal.group | modal.error ? 'overlay' : ''}`}>

        {/* calendar */}
        <div className='col-8 d-flex justify-content-start'>
          <div style={{height: '90vh', width: '100%'}}>
            <DnDCalendar {...props} 
              localizer={localizer} 
              events={myEvents} 
              onDropFromOutside={onDropFromOutside}
              onEventDrop={moveEvent}
              onEventResize={moveEvent}
              eventPropGetter={eventPropGetter}
              onSelectEvent={selectEvent}
              step={5}
              defaultView="week" 
              onNavigate={handleNavigate}
              onView={changeView}
              resizable
              selectable
            />
          </div>
        </div>

        {/* Homes */}
        <div className="col d-flex flex-column justify-content-center align-items-center ms-3">
          <div className="row d-flex">
            <div className="col">
              <div className="btn-group d-flex justify-content-center">   
                <input type="radio" className="btn-check" name="Sunday" id="Sunday" onChange={testSelectionCheck} 
                checked={testSelection === 'Sunday'}
                />
                <label className="btn btn-outline-primary" htmlFor="Sunday">Sunday</label>

                <input type="radio" className="btn-check" name="Monday" id="Monday" onChange={testSelectionCheck}
                checked={testSelection === 'Monday'}
                />
                <label className="btn btn-outline-primary" htmlFor="Monday">Monday</label>

                <input type="radio" className="btn-check" name="Tuesday" id="Tuesday" onChange={testSelectionCheck}
                checked={testSelection === 'Tuesday'}
                />
                <label className="btn btn-outline-primary" htmlFor="Tuesday">Tuesday</label>

                <input type="radio" className="btn-check" name="Wednesday" id="Wednesday" onChange={testSelectionCheck}
                checked={testSelection === 'Wednesday'}
                />
                <label className="btn btn-outline-primary" htmlFor="Wednesday">Wednesday</label>
              </div>

              <div className="btn-group d-flex justify-content-center">
                <input type="radio" className="btn-check" name="Thursday" id="Thursday" onChange={testSelectionCheck}
                checked={testSelection === 'Thursday'}
                />
                <label className="btn btn-outline-primary" htmlFor="Thursday">Thursday</label>

                <input type="radio" className="btn-check" name="Friday" id="Friday" onChange={testSelectionCheck}
                checked={testSelection === 'Friday'}
                />
                <label className="btn btn-outline-primary" htmlFor="Friday">Friday</label>

                <input type="radio" className="btn-check" name="Saturday" id="Saturday" onChange={testSelectionCheck}
                checked={testSelection === 'Saturday'}
                />
                <label className="btn btn-outline-primary" htmlFor="Saturday">Saturday</label>
              </div>

              <div className='d-flex justify-content-center align-items-center mb-3'>
                <button onClick={testSchedule} className="test m-2" disabled={!testSelection}>Test</button>
                <button onClick={removeAllEvents} className="test m-2">Delete All</button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col d-flex flex-column justify-content-center">
              <div className="btn-group" role="group" aria-label="Basic radio  toggle button group">
                
                <input type="radio" className="btn-check view-btn" name="Patient" id="Patient" 
                checked={viewFocus.view === 'Patient'}  onChange={viewCheck}
                />
                <label className="btn btn-outline-primary" htmlFor="Patient">Patient View</label>

                <input type="radio" className="btn-check view-btn" name="Edit" id="Edit" checked={viewFocus.view === 'Edit'}  onChange={viewCheck} />
                <label className="btn btn-outline-primary" htmlFor="Edit">Edit Group</label>

                <input type="radio" className="btn-check view-btn" name="Group" id="Group" checked={viewFocus.view === 'Group'}  onChange={viewCheck} />
                <label className="btn btn-outline-primary" htmlFor="Group">Group View</label>
              </div>
            </div>
          </div>
            
          <div className="row">
            {!viewFocus.showGroups && !viewFocus.groupParams ? (
              <div>
                <DisplayPatients handleDragStart={handleDragStart} homes={homes} homeStatus={homeStatus} myEvents={myEvents} start={viewStartDate} end={viewEndDate} />
              </div>
            ) : viewFocus.showGroups ? (
                <div>
                  <DisplayGroups handleDragStart={handleDragStart} homes={homes} patientGroups ={patientGroups.groups} doubleSessions = {patientGroups.considerDoubleSession} myEvents={myEvents} start={viewStartDate} end={viewEndDate} handleEventsUpdate={handleEventsUpdate} handleUpdatedGroups={handleUpdatedGroups} />
                </div>
            ) : viewFocus.groupParams ? (
                <div>
                  <GroupModal therapistParameters={therapistParameters} handleTherapistParameters={handleTherapistParameters}
                  handleGrouping={handleGrouping}
                  closeModal={closeModal} />
                </div>
            ) : null
            }
          </div>
         </div>
      

        {modal.patient ? <div className="above-overlay" >
          <PatientModal client={client} removeFromCal={removeFromCal} closeModal={closeModal} groups={groupsForPatientModal} myEvents={myEvents} handleEventsUpdate={handleEventsUpdate} />
        </div> : null}

        {modal.error ? <div className="above-overlay" >
          <ErrorModal closeModal={closeModal} />
        </div> : null}
      </div>
    </div>
  )
}

export default Calendar;