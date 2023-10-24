import React, {useEffect, useContext} from 'react';
import { useState, useCallback } from 'react';
import '../css/calendar.css';
import { v4 as uuidv4 } from 'uuid';
import { useQuery, useQueryClient } from 'react-query';

import { UserContext, AccessTokenContext } from '../context/context';
import useDistanceRequests from '../hooks/distance-request';
import useHomeRequests from '../hooks/home-requests.js';
import useScheduleRequests from '../hooks/schedule-requests';
import Loading from '../pop-ups/loading.js';

import { momentLocalizer, Calendar as BigCalendar } from 'react-big-calendar';
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import DisplayGroups from '../Features/display-groups';

const DnDCalendar = withDragAndDrop(BigCalendar);
const localizer = momentLocalizer(moment);


function Calendar(props) {
  const queryClient = useQueryClient();

  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const {getHomes} = useHomeRequests();
  const {getTimeDistances, createGroups} = useDistanceRequests();
  const {saveUserSchedule, getUserSchedule, deleteSchedule} = useScheduleRequests();

  const [myEvents, setMyEvents] = useState([]);
  const [draggedClient, setDraggedClient] = useState();
  const [modal, setModal] = useState({
    patient: false,
    group: false,
    error: false
  });
  const [client, setClient] = useState(null);
  const [changesSaved, setChangesSaved] = useState(false);
  const [viewChange, setViewChange] = useState(false);
  const [groupFocus, setGroupFocus] = useState(false);
  const [patientGroups, setPatientGroups] = useState(undefined);
  const [therapistParameters, setTherapistParameters] = useState({
    workingDays: null,
  });

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

  useEffect(() => {
    if(changesSaved) {
      saveUserSchedule(user._id, myEvents, accessToken);
      setChangesSaved(true)
    }
    
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
  },[viewChange])

  const changeView = () => {
    setViewChange(!viewChange);
  }
  
  const eventPropGetter = useCallback(
    (event) => ({
      
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
    }),
    [myEvents]
  );

  const eventViability = useCallback(
    (viabilityData) => {
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
     
      setChangesSaved(false);
    },
      []
  );

  const fillInCalendar = useCallback(
    (dbSchedule) => {
      const schedule = dbSchedule.map((event) => {
        const startTime = new Date(event.start);
        const endTime = new Date(event.end);

        event.start = startTime;
        event.end = endTime;

        return event; 
      });

      
      setMyEvents([...schedule]);
    },
    []
  );

  const newEvent = useCallback(
    (event) => {
      setMyEvents((prev) => {
        return [...prev, { ...event }]
      });

      setChangesSaved(true);
      
    },
    [setMyEvents]
  );

  const onDropFromOutside = useCallback(
    ({ start, allDay: isAllDay }) => {

      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const {client} = draggedClient;
      const {address} = draggedClient
      const calId = uuidv4();

      const event = {
        title: client,
        id: calId,
        address: address,
        start,
        end,
        isAllDay,
        isViableOrg: null,
        isViableDest: null,
        repeat: null
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

      setChangesSaved(true);

    }, 
      [setMyEvents]
  );

  const handleDragStart = useCallback((client, address) => setDraggedClient({client: client, address: address}), []);

  const testSchedule = useCallback(
    async () => {
      const weeklySchedule = myEvents.reduce((accum, event) => {
        const day = event.start.toLocaleString('en-US', { weekday: 'short' });

        return {
          ...accum, [day]: [...accum[day], event].sort((a, b) => a.start - b.start)
        }
        }, {
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
            Sun: []
          }
      );
      console.log(weeklySchedule)
      const viabilityData = await getTimeDistances(weeklySchedule, accessToken);

      eventViability(viabilityData);
    },
    [myEvents]
  );

  const removeAllEvents = () => {
    setMyEvents([]);
    deleteSchedule(user._id, accessToken)
  };

  const selectEvent = useCallback(
    (event) => {

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
                 id: event.id,
                 start: `${month}-${day}-${year} at ${hours}:${minutes}`,
                 repeat: event.repeat
                });
    },
    []
  );

  const handleTherapistParameters = (event) => {
    const {name, value} = event.target;
    setTherapistParameters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGrouping = async () => {
    closeModal();
    setPatientGroups(null);
    const returnedGroups = await createGroups(
      user._id, 
      accessToken, 
      therapistParameters
    );

    console.log(returnedGroups)
    setPatientGroups(returnedGroups);
    setGroupFocus(true);
  };

  const setClientRepeat = (id, data) => {
    setMyEvents(prev => {
      const updatedEvents = prev.map((event) => {
        if(event.id === id) {
          return {...event, repeat: data}
        }

        return event
      });

      return updatedEvents;
    }); 
    
    setClient(prev => ({
      ...prev, repeat: data
    }));

    setChangesSaved(false);
  };

  const openGroup = () => {
    setModal(prev => ({
      ...prev,
      group: true
    }));
  };

  const removeFromCal = (id) => {
    setMyEvents((prev) => {
      const filteredState = prev.filter((ev) => ev.id !== id);

      return [...filteredState];
    });

    setModal(prev => ({
      ...prev,
      patient: false
    }));
    setClient(null);
    setChangesSaved(false);
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
          <div style={{height: '80vh', width: '100%'}}>
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
              onView={changeView}
              resizable
              selectable
            />
          </div>
        </div>

        {/* Homes */}
        <div className="col ms-3">
          <div className="row d-flex">
            <div className="col">
              <div className='d-flex flex-column justify-content-center align-items-center mb-3'>
                <button onClick={testSchedule} className="test my-2">Test</button>
              </div>
              <div className='d-flex flex-column justify-content-center align-items-center mb-3'>
              <button onClick={openGroup} className="test my-2">Group</button>
              </div>
            </div>

            <div className="col">
              <div className='d-flex flex-column justify-content-center align-items-center mb-3'>
                <button onClick={removeAllEvents} className="test my-2">Delete All</button>
                <button className="save">All Schedules</button>
              </div>
            </div>
          </div>
            
            <div className="row">
              {homeStatus === 'loading' ? (
                <div><Loading /></div>
              ) : homeStatus === 'error' ? (
                <div>Error Loading Patients...</div>
              ) : !homes ? (
                <div className="col">
                  <div>No Patients saved</div>     
                </div>
              ) : !groupFocus ? (
                  homes.map(home => (
                    <div key={home._id} draggable className="col d-flex justify-content-end align-items-center" 
                      onDragStart={() =>
                          handleDragStart(home.name, home.address)
                        }>
                      <div  className="card my-3">
                        <div className="card-body">
                          <div className="card-title">{home.name}</div>
                        </div>
                      </div>
                    </div>
                  )
              )
              ): (
                <div>
                  <DisplayGroups handleDragStart={handleDragStart} homes={homes} patientGroups ={patientGroups} />
                </div>
              )
            }
            </div>

            
         </div>
      

        {modal.patient ? <div className="above-overlay" >
          <div className="card" style={{width: "18rem", height: "300px"}}>
            <div className="p-0 card-body text-center">
              <h2>{client.title}</h2>
              <h6 className='text-start ps-2 pt-2'>Repeat:</h6>
              <div className='row pb-4'>
                <div className="col">
                  <button className={`repeat ${client.repeat === 'weekly' ? 'repeat-selected' : ''}`} onClick={() => setClientRepeat(client.id, 'weekly')}>Weekly</button>
                </div>
                <div className="col">
                <button className={`repeat ${client.repeat === 'monthly' ? 'repeat-selected' : ''}`} onClick={() => setClientRepeat(client.id, 'monthly')}>Monthly</button>
                </div>
                <div className="col">
                <button className={`repeat ${client.repeat === 'never' ? 'repeat-selected' : ''}`} onClick={() => setClientRepeat(client.id, 'never')}>Never</button>
                </div>
              </div>
              <p>
                Would you like to remove this client from {client.start}
              </p>
              <button className='m-2 remove' onClick={() => removeFromCal(client.id)}>Remove</button>
              <button className='m-2' onClick={closeModal}>Close</button>
            </div>
          </div>
        </div> : null}

        {modal.group ? <div className="above-overlay" >
          <div className="card" style={{width: "18rem", height: "300px"}}>
            <div className="p-0 card-body text-center">
              <h2>Group Geographically</h2>
                <div>
                  <label for="workingDays">Working Days:</label>
                  <input onChange={handleTherapistParameters} type="number" id="workingDays" value={therapistParameters.workingDays} name="workingDays" min="1" max="7" />
                </div>
                <button onClick={handleGrouping}>
                  Go
                </button>
                <button onClick={closeModal}>
                  Cancel
                </button>
            </div>
          </div>
        </div> : null}

        {modal.error ? <div className="above-overlay" >
          <div className="card" style={{width: "18rem", height: "175px"}}>
            <div className="p-0 card-body text-center">
              <h2>OOPS!</h2>
              <p>
                It looks like we're ahving trouble testing your schedule. Try again later. We're on it.
              </p>
              <button className='m-2' onClick={closeModal}>Close</button>
            </div>
          </div>
        </div> : null}
      </div>
    </div>
  )


}

export default Calendar;


      
      


       


       


