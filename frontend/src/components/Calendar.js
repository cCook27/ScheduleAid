import React, {useEffect, useContext, useState, useCallback} from 'react';
import '../css/calendar.css';
import '../css/calendar-extra.css'
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from 'react-query';

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
import EditParameters from '../Features/edit-parameters.js';
import ErrorModal from '../pop-ups/error-modal';
import PatientModal from '../pop-ups/patient-modal';


const DnDCalendar = withDragAndDrop(BigCalendar);
const localizer = momentLocalizer(moment);


function Calendar(props) {
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
  const [testDay, setTestDay] = useState(undefined);
  const [patientGroups, setPatientGroups] = useState(undefined);
  const [groupsForPatientModal, setGroupsForPatientModal] = useState([]);
  const [therapistParameters, setTherapistParameters] = useState({
    workingDays: 5,
    sessionLength: 60,
    bufferTime: 5
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

  // const displaySourceHeight = document.getElementById('display-source') ? document.getElementById('display-source').clientHeight : '85vh';

  // if(displaySourceHeight) {
  //   const calendarTarget = document.getElementById('calendar-target');

  //   if(calendarTarget) {
  //     calendarTarget.style.height = `${displaySourceHeight}px`
  //   }

    
  // }
  

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
    console.log(therapistParameters);
  }, [therapistParameters]);

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
  };

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
    (name, address, coordinates, groupNumber) => {
      setDraggedClient({client: name, address: address, coordinates: coordinates, groupNumber: groupNumber});
  },[])
  
  const testSchedule = async () => {
    const viewStart = new Date(viewStartDate).getTime();
    const viewEnd = new Date(viewEndDate).getTime();

    const selectedDaySchedule = myEvents.filter((event) => {
      const day = event.start.toLocaleString('en-US', { weekday: 'long' });

      const start = new Date(event.start).getTime();

      return day === testDay && (start >= viewStart && start <= viewEnd);
    }).sort((a, b) => a.start - b.start);

    const noGroupAssigned = selectedDaySchedule.filter((ev) => ev.groupNumber === undefined);
    const needsTesting = selectedDaySchedule.filter((ev) => ev.isViableDest === null && ev.isViableOrg === null);

    if(needsTesting.length > 0) {
      if(viewFocus.view === 'Group') {
        if(selectedDaySchedule.length > 1 && noGroupAssigned.length === 0) {
          const viabilityData = await getTimeDistances(selectedDaySchedule, accessToken);
          eventViability(viabilityData);
          setTestDay(null);
        }; 
        
        if(selectedDaySchedule.length <= 1) {
          window.alert(`Please make sure there are at least 2 patients on ${testDay}.`);
        };
        
        if(noGroupAssigned.length > 0) {
          window.alert(`Before proceeding please assign the patients in red to a group by clicking the patient and choosing a corresponding group number or return to patient view.`);
        };
      };
  
      if(viewFocus.view === 'Patient') {
        if(selectedDaySchedule.length > 1) {
          const viabilityData = await getTimeDistances(selectedDaySchedule, accessToken);
          eventViability(viabilityData);
          setTestDay(null);
        } else {
          window.alert(`Please make sure there are at least 2 patients on ${testDay}.`);
        }
      };
    } else if(selectedDaySchedule.length === 0) {
      window.alert(`Looks like ${testDay} doesn't have any patients to test, you're FREE...for now...`);
    } else {
      window.alert(`Looks like ${testDay} has already been tested with no changes`);
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

  const daySelection = (event) => {
    switch (event) {
      case 'Sunday':
        setTestDay('Sunday');
        break;
      case 'Monday':
        setTestDay('Monday');
        break;
      case 'Tuesday':
        setTestDay('Tuesday');
        break;
      case 'Wednesday':
        setTestDay('Wednesday');
        break;
      case 'Thursday':
        setTestDay('Thursday');
        break;
      case 'Friday':
        setTestDay('Friday');
        break;
      case 'Saturday':
        setTestDay('Saturday');
        break;
      default:
        setTestDay(undefined);
        break;
    }
  };

  const handleTherapistParameters = (params) => {
    setTherapistParameters(params);
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
    <div className="container-fluid d-flex flex-column">
      <h2 className='sched-title'>Schedule Your Patients</h2>
      <div className={`row mt-3 ${modal.patient | modal.group | modal.error ? 'overlay' : ''}`}>

        {/* calendar */}
        <div className='col-12 col-lg-7 d-flex flex-column calendar-cont'>
          <div className="d-flex d-lg-none justify-content-center align-items-center">
            <select className="form-select daySelect" name="testDay" id="testDay" 
            onChange={(event) => daySelection(event.target.value)}
            value={testDay || ''}
            >
              <option disabled selected value="">Select a Day to Test</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>

            <button onClick={testSchedule} className="test btn m-2" 
            disabled={!testDay}>
              Test
            </button>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <h6>Need to Reschedule or Add Extra Visits This Week?</h6>
          </div>
          
          <div className='dndCal-container d-flex justify-content-start align-items-start' id='calendar-target'>
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
        <div className="col">
          <div id="display-source" className='d-flex flex-column align-items-center'>
            <div className="row testing mb-2">
              <div className="col">

                <div className="d-none d-lg-flex justify-content-center align-items-center">
                  <select className="form-select daySelect" name="testDay" id="testDay" 
                  onChange={(event) => daySelection(event.target.value)}
                  value={testDay || ''}
                  >
                    <option disabled selected value="">Select a Day to Test</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>

                  <button onClick={testSchedule} className="test btn m-2" 
                  disabled={!testDay}>
                    Test
                  </button>
                </div>
          
              </div>
            </div>

            <div className="row views mb-3">
              <div className="col">
                <div className="btn-group" role="group" aria-label="Basic radio  toggle button group">
                  
                  <input type="radio" className="btn-check view-btn" name="Patient" id="Patient" 
                  checked={viewFocus.view === 'Patient'}  onChange={viewCheck}
                  />
                  <label className="view left-rad" htmlFor="Patient">Patient View</label>

                  <input type="radio" className="btn-check view-btn" name="Edit" id="Edit" checked={viewFocus.view === 'Edit'}  onChange={viewCheck} />
                  <label className="view" htmlFor="Edit">Edit Parameters</label>

                  <input type="radio" className="btn-check view-btn" name="Group" id="Group" checked={viewFocus.view === 'Group'}  onChange={viewCheck} />
                  <label className="view right-rad" htmlFor="Group">Group View</label>
                </div>
              </div>
            </div>
              
            <div className="row displays">
              {!viewFocus.showGroups && !viewFocus.groupParams ? (
                <div className="mb-3">
                  <DisplayPatients handleDragStart={handleDragStart} homes={homes} homeStatus={homeStatus} myEvents={myEvents} start={viewStartDate} end={viewEndDate} />
                </div>
              ) : viewFocus.showGroups ? (
                  <div>
                    <DisplayGroups handleDragStart={handleDragStart} homes={homes} patientGroups ={patientGroups.groups} doubleSessions = {patientGroups.considerDoubleSession} myEvents={myEvents} start={viewStartDate} end={viewEndDate} handleEventsUpdate={handleEventsUpdate} handleUpdatedGroups={handleUpdatedGroups} />
                  </div>
              ) : viewFocus.groupParams ? (
                  <div>
                    <EditParameters therapistParameters={therapistParameters} handleTherapistParameters={handleTherapistParameters}
                    handleGrouping={handleGrouping}
                    closeModal={closeModal} />
                  </div>
              ) : null
              }
            </div>
          </div>
          
         </div>
      

        {modal.patient ? 
          <div className="above-overlay" >
            <PatientModal client={client} removeFromCal={removeFromCal} closeModal={closeModal} groups={groupsForPatientModal} myEvents={myEvents} handleEventsUpdate={handleEventsUpdate} />
          </div> : null
        }

        {modal.error ? 
          <div className="above-overlay" >
            <ErrorModal closeModal={closeModal} />
          </div> : null
        }
      </div>
    </div>
  )
}

export default Calendar;