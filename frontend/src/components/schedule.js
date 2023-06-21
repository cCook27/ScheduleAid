import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRequestMaker from '../hooks/request-maker';
import CreateSchedule from './create-schedule';

import '../css/schedule.css'
import Button from 'react-bootstrap/Button';

function Schedule(props) {
  const homes = props.homes;
  const {getTimeDistances} = useRequestMaker();

  const timeDistances = useSelector(state => state.currentSchedule);

  useEffect(() => {
    console.log(timeDistances);
    if(timeDistances.length > 1) {
      const duration = timeDistances[0].rows[0].elements[0].duration.text;
      console.log(duration);
    }
    
  },[timeDistances])

  const sendTest = () => {
    getTimeDistances(homes);
  };

  return (
    <div className='page-container'>
      <CreateSchedule />
      <ul className='homes'>
        {homes.map((home) => (
          <li key={home._id}>{home.name}</li>
        ))}
      </ul>
      <div>
        <Button onClick={sendTest}>Submit Test</Button>
      </div>
    </div>
  );
}

export default Schedule;