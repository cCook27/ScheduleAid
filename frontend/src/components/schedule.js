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
    
  },[timeDistances])

  const sendTest = () => {
    getTimeDistances(homes);
  };

  return (
    <div>
      <ul>
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