import React, {useEffect} from 'react';
import { useState, useCallback } from 'react';
import '../css/calendar.css';
import { v4 as uuidv4 } from 'uuid';

import useDistanceRequests from '../hooks/distance-request';
import useHomeRequests from '../hooks/home-requests.js';
import useScheduleRequests from '../hooks/schedule-requests';

import { momentLocalizer, Calendar as BigCalendar } from 'react-big-calendar';
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { useMutation, useQuery, useQueryClient } from 'react-query';


const DnDCalendar = withDragAndDrop(BigCalendar);

const localizer = momentLocalizer(moment);


function Calendar(props) {
  const queryClient = useQueryClient();

  const dataLoaded = true;

  const {getHomes} = useHomeRequests();
  const {getTimeDistances} = useDistanceRequests();
  const {saveSchedule, getSchedule} = useScheduleRequests();

  const [myEvents, setMyEvents] = useState([]);
  const [draggedClient, setDraggedClient] = useState();
  const [modal, setModal] = useState(false);
  const [client, setClient] = useState(null);

  const { data: homes, status } = useQuery('homes', getHomes);
  const { data: dbSchedule, stat } = useQuery('schedule', getSchedule, {
    onSuccess: (data) => {
      fillInCalendar(data); 
      
    },
  });


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

    },
      []
  );

  const fillInCalendar = useCallback(
    async (dbSchedule) => {
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
      }
      newEvent(event)
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

  const handleDragStart = useCallback((client, address) => setDraggedClient({client: client, address: address}), []);


  const testSchedule = useCallback(
    async () => {
      console.log(myEvents)
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
      
      const viabilityData = await getTimeDistances(weeklySchedule);

      eventViability(viabilityData);
    },
    [myEvents]
  );

  const saveSched = () => {
    saveSchedule(myEvents)
  }


  const selectEvent = useCallback(
    (event) => {
      setModal(true);
      setClient({title: event.title,
                 id: event.id});
    },
    []
  );

  const removeFromCal = (id) => {
    setMyEvents((prev) => {
      const filteredState = prev.filter((ev) => ev.id !== id);

      return [...filteredState];
    });

    setModal(false);
    setClient(null);
  }

  const cancelModal = () => {
    setModal(false);
    setClient(null);
  }
 

  return (
    <div className={`row my-5 ${modal ? 'overlay' : ''}`}>
      { !dataLoaded ?
        <div className="loading .col d-flex justify-content-center py-4">
          <div className="spinner-grow me-2 text-primary" role="status"></div>
          <div className="spinner-grow me-2 text-secondary" role="status"></div>
          <div className="spinner-grow me-2 text-success" role="status"></div>
          <div className="spinner-grow me-2 text-danger" role="status"></div>
          <div className="spinner-grow me-2 text-warning" role="status"></div>
          <div className="spinner-grow me-2 text-info" role="status"></div>
          <div className="spinner-grow me-2 text-dark" role="status"></div>
        </div> : null
      }

       
      { modal ?
        <div className='position-absolute above-overlay'>
          <div className="card" style={{width: "18rem"}}>
            <div className="card-body modal-body">
              <h5 className="card-title">{client.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">Are you sure you want to remove this this client?</h6>
              <button onClick={() => removeFromCal(client.id)} className='btn btn-danger'>remove</button>
              <button onClick={cancelModal} className='btn btn-primary'>Cancel</button>
            </div>
          </div>
        </div>
         : null
      }
      
      

      <div className='col-8 ms-3 d-flex justify-content-start'>
        <div style={{height: '80vh', width: '100%'}}>
          <DnDCalendar {...props} 
            localizer={localizer} 
            events={myEvents} 
            onDropFromOutside={onDropFromOutside}
            onEventDrop={moveEvent}
            onEventResize={moveEvent}
            eventPropGetter={eventPropGetter}
            onSelectEvent={selectEvent}
            step={15}
            defaultView="week" 
            resizable
            selectable
          />
        </div>
        <button onClick={testSchedule} className="btn">Test</button>
        <button onClick={saveSched} className="btn">Save Schedule</button>
      </div>


      <div className="col-3 d-flex justify-content-center">
        <div className="row">
          {status === 'loading' ? (
            <div>Loading Homes...</div>
          ) : status === 'error' ? (
            <div>Error Loading Homes...</div>
          ) : (
            homes.map(home => (
              <div key={home._id} draggable className="col-4" 
                onDragStart={() =>
                    handleDragStart(home.name, home.address)
                  }>
                <div  className="card my-3">
                  <div className="card-body">
                    <div className="card-title">{home.name}</div>
                    <p className="card-text">{home.address.city}, {home.address.zip}</p>
                  </div>
                </div>
              </div>
            )
          )
          
          )}
        </div>
      </div>

    </div>
    
  ) 
}

export default Calendar;



