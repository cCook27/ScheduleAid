import React, {Children, useEffect} from 'react';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import '../css/calendar.css';
import { v4 as uuidv4 } from 'uuid';

import useDistanceRequests from '../hooks/distance-request';

import { momentLocalizer, Calendar as BigCalendar } from 'react-big-calendar';
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop(BigCalendar);

const localizer = momentLocalizer(moment);


function Calendar(props) {

  const {getTimeDistances} = useDistanceRequests();
  const homes = useSelector(state => state.homes);
  const dataLoaded = homes.length > 0;

  const [myEvents, setMyEvents] = useState([]);
  const [draggedClient, setDraggedClient] = useState();

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.isViable === true && {
        className: 'isViable',
      }),
      ...(event.isViable === false && {
        className: 'notViable',
      }),
    }),
    [myEvents]
  );

  const eventViability = useCallback(
    (viabilityData) => {

      viabilityData.forEach((element) => {
        setMyEvents((prev) => {
          let origin = prev.find((event) => event.id === element.originId);
          origin.isViable = element.isViable;

          const filteredState = prev.filter((event) => event.id !== element.originId);

        return [...filteredState, {...origin}]
      });


      })

    },
      []
  );

  useEffect(() => {
    console.log(myEvents)
  }, [myEvents])
  

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
        isViable: null
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

        return [...filteredState, {...existingEvent, start, end, isAllDay}]
      });

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

      const viabilityData = await getTimeDistances(weeklySchedule);

      eventViability(viabilityData);
    },
    [myEvents]
  );
 

  if(!dataLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className='row my-5'>

      <div className='col-8 ms-3 d-flex justify-content-start'>
        <div style={{height: '80vh', width: '100%'}}>
          <DnDCalendar {...props} 
            localizer={localizer} 
            events={myEvents} 
            onDropFromOutside={onDropFromOutside}
            onEventDrop={moveEvent}
            onEventResize={moveEvent}
            eventPropGetter={eventPropGetter}
            defaultView="week" 
            resizable
            selectable
          />
        </div>
        <button onClick={testSchedule} className="btn">Test</button>
      </div>


      <div className="col-3 d-flex justify-content-center">
        <div className="row">
          {homes.map(home => (
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
          ))}
        </div>
      </div>
     
    </div>
    
  ) 
}

export default Calendar;



