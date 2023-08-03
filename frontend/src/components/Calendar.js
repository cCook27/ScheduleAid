import React from 'react';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import '../css/calendar.css';
import { v4 as uuidv4 } from 'uuid';

import { momentLocalizer, Calendar as BigCalendar } from 'react-big-calendar';
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop(BigCalendar);

const localizer = momentLocalizer(moment);


function Calendar(props) {

  const homes = useSelector(state => state.homes);
  const dataLoaded = homes.length > 0;

  const [myEvents, setMyEvents] = useState([]);
  const [draggedClient, setDraggedClient] = useState();
  const [weeklySchedule, setWeeklySchedule] = useState({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [], });
 
  const formulateWeek = 
    useCallback((event) => {
      const dayOfWeek = event.start.toLocaleString('en-US', {weekday: 'short'});

      setWeeklySchedule((prev) => {
        return {...prev, [dayOfWeek]: [...prev[dayOfWeek], event]}
      });
    
    },
    [setWeeklySchedule]
  );

  const newEvent = useCallback((event) => {
    setMyEvents((prev) => {
      return [...prev, { ...event }]
    })

    formulateWeek(event)

    },
    [setMyEvents, formulateWeek]
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
            defaultView="week" 
            resizable
            selectable
          />
        </div>
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



