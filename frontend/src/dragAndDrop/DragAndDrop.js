
import { useState } from "react";

import { Calendar as BigCalendar,momentLocalizer } from "react-big-calendar";
import moment from 'moment';

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/dragAndDrop/styles.css";

const DnDCalendar = withDragAndDrop(BigCalendar);
const localizer = momentLocalizer(moment);

const events = [
  {
    start: moment('2023-07-25T10:00:00').toDate(),
    end: moment('2023-07-25T11:00:00').toDate(),
    title: 'Testing Phase'
  }
]

function DragAndDrop() {
  return (
    <DnDCalendar
      localizer={localizer}
      events={events}
      draggableAccessor={(event) => true}
    />
  )
}

export default DragAndDrop