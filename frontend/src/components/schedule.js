import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequestMaker from '../hooks/request-maker';

import '../css/schedule.css'
import Button from 'react-bootstrap/Button';

function Schedule(props) {
  const homes = props.homes;
  const {getPairDistance} = useRequestMaker();

  const pairData = useSelector(state => state.pair);

  return (
    <div>
      <ul>
        {homes.map((home) => (
          <li>{home.name}</li>
        ))}
      </ul>
      <div>
        <Button>Submit Test</Button>
      </div>
    </div>
  );
}

export default Schedule;