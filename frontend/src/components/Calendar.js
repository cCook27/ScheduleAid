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

  const newEvent = useCallback(
      (event) => {
        setMyEvents((prev) => {
          
          return [...prev, { ...event }]
        })
      },
      [setMyEvents]
    );

  const onDropFromOutside = useCallback(
    ({ start, allDay: isAllDay }) => {

      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const {client} = draggedClient;
      const calId = uuidv4();

      const event = {
        title: client,
        id: calId,
        start,
        end,
        isAllDay,
      }
      newEvent(event)
    },
    [newEvent, draggedClient]
  );

  const moveEvent = useCallback(({event, start, end, allDay: isAllDay}) =>{
  
    setMyEvents((prev) => {
      const existingEvent = prev.find((ev) => ev.id === event.id); 
      const filteredState = prev.filter((ev) => ev.id !== event.id);

      console.log(filteredState)
      console.log(existingEvent)

      return [...filteredState, {...existingEvent, start, end, isAllDay}]
    })

  }, [setMyEvents]);

  const handleDragStart = useCallback((client) => setDraggedClient({client: client}), []);
 

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
                  handleDragStart(home.name)
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




// import React, { Fragment, useCallback, useMemo, useState } from 'react'
// import PropTypes from 'prop-types'
// import events from '../../resources/events'
// import { Calendar, Views, DateLocalizer } from 'react-big-calendar'
// import Card from '../../resources/Card'
// import DemoLink from '../../DemoLink.component'
// // Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop'
// import withDragAndDrop from '../../../src/addons/dragAndDrop'
// // Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
// import '../../../src/addons/dragAndDrop/styles.scss'

// const DragAndDropCalendar = withDragAndDrop(Calendar)

// const adjEvents = events.map((it, ind) => ({
//   ...it,
//   isDraggable: ind % 2 === 0,
// }))

// const formatName = (name, count) => `${name} ID ${count}`

// export default function DnDOutsideResource({ localizer }) {
//   const [myEvents, setMyEvents] = useState(adjEvents)
//   const [draggedEvent, setDraggedEvent] = useState()
//   const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true)
//   const [counters, setCounters] = useState({ item1: 0, item2: 0 })

//   const eventPropGetter = useCallback(
//     (event) => ({
//       ...(event.isDraggable
//         ? { className: 'isDraggable' }
//         : { className: 'nonDraggable' }),
//     }),
//     []
//   )
//   //,
//   const handleDragStart = useCallback((event) => setDraggedEvent(event), [])

//   const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent])

//   const customOnDragOver = useCallback(
//     (dragEvent) => {
//       // check for undroppable is specific to this example
//       // and not part of API. This just demonstrates that
//       // onDragOver can optionally be passed to conditionally
//       // allow draggable items to be dropped on cal, based on
//       // whether event.preventDefault is called
//       if (draggedEvent !== 'undroppable') {
//         console.log('preventDefault')
//         dragEvent.preventDefault()
//       }
//     },
//     [draggedEvent]
//   )

//   const handleDisplayDragItemInCell = useCallback(
//     () => setDisplayDragItemInCell((prev) => !prev),
//     []
//   )

//   const moveEvent = useCallback(
//     ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {

//       setMyEvents((prev) => {
//         const existing = prev.find((ev) => ev.id === event.id) ?? {}
//         const filtered = prev.filter((ev) => ev.id !== event.id)
//         return [...filtered, { ...existing, start, end, allDay }]
//       })
//     },
//     [setMyEvents]
//   )

//   const newEvent = useCallback(
//     (event) => {
//       setMyEvents((prev) => {
//         const idList = prev.map((item) => item.id)
//         const newId = Math.max(...idList) + 1
//         return [...prev, { ...event, id: newId }]
//       })
//     },
//     [setMyEvents]
//   )

//   const onDropFromOutside = useCallback(
//     ({ start, end, allDay: isAllDay }) => {
//       if (draggedEvent === 'undroppable') {
//         setDraggedEvent(null)
//         return
//       }

//       const { name } = draggedEvent
//       const event = {
//         title: formatName(name, counters[name]),
//         start,
//         end,
//         isAllDay,
//       }
//       setDraggedEvent(null)
//       setCounters((prev) => {
//         const { [name]: count } = prev
//         return {
//           ...prev,
//           [name]: count + 1,
//         }
//       })
//       newEvent(event)
//     },
//     [draggedEvent, counters, setDraggedEvent, setCounters, newEvent]
//   )

//   const resizeEvent = useCallback(
//     ({ event, start, end }) => {
//       setMyEvents((prev) => {
//         const existing = prev.find((ev) => ev.id === event.id) ?? {}
//         const filtered = prev.filter((ev) => ev.id !== event.id)
//         return [...filtered, { ...existing, start, end }]
//       })
//     },
//     [setMyEvents]
//   )

//   const defaultDate = useMemo(() => new Date(2015, 3, 12), [])

//   return (
//     <Fragment>
//       <DemoLink fileName="dndOutsideSource">
//         <Card className="dndOutsideSourceExample">
//           <div className="inner">
//             <h4>Outside Drag Sources</h4>
//             <p>
//               Lighter colored events, in the Calendar, have an `isDraggable` key
//               of `false`.
//             </p>
//             {Object.entries(counters).map(([name, count]) => (
//               <div
//                 draggable="true"
//                 key={name}
//                 onDragStart={() =>
//                   handleDragStart({ title: formatName(name, count), name })
//                 }
//               >
//                 {formatName(name, count)}
//               </div>
//             ))}
//             <div
//               draggable="true"
//               onDragStart={() => handleDragStart('undroppable')}
//             >
//               Draggable but not for calendar.
//             </div>
//           </div>

//           <div>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={displayDragItemInCell}
//                 onChange={handleDisplayDragItemInCell}
//               />
//               Display dragged item in cell while dragging over
//             </label>
//           </div>
//         </Card>
//       </DemoLink>
//       <div className="height600">
//         <DragAndDropCalendar
//           defaultDate={defaultDate}
//           defaultView={Views.MONTH}
//           dragFromOutsideItem={
//             displayDragItemInCell ? dragFromOutsideItem : null
//           }
//           draggableAccessor="isDraggable"
//           eventPropGetter={eventPropGetter}
//           events={myEvents}
//           localizer={localizer}
//           onDropFromOutside={onDropFromOutside}
//           onDragOver={customOnDragOver}
//           onEventDrop={moveEvent}
//           onEventResize={resizeEvent}
//           onSelectSlot={newEvent}
//           resizable
//           selectable
//         />
//       </div>
//     </Fragment>
//   )
// }
// DnDOutsideResource.propTypes = {
//   localizer: PropTypes.instanceOf(DateLocalizer),
// }




