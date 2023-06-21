import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRequestMaker from '../hooks/request-maker';

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
      <ul className='homes'>
        {homes.map((home) => (
          <li key={home._id}>{home.name}</li>
        ))}
      </ul>
      <ul className='distance'>
      {timeDistances.map((dist) => (
          <li key='1'>{dist.rows[0].elements[0].duration.text}</li>
        ))}
      </ul>
      <div>
        <Button onClick={sendTest}>Submit Test</Button>
      </div>
    </div>
  );
}

export default Schedule;