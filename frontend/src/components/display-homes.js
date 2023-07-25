import React, { useEffect, useState } from 'react';
import useRequestMaker from '../hooks/request-maker';
import { useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Draggable from 'react-draggable';

function DisplayHomes() {
  const [homesToSchedule, setHomesToSchedule] = useState([])

  const {getHomes} = useRequestMaker();

  const homes = useSelector(state => state.homes);
  const newHome = useSelector(state => state.newHome);

  useEffect(() => {
    getHomes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newHome]);

  const handleState = (home) => {
   setHomesToSchedule(prev => [...prev, home]);
  };

  return (
    <div className='page-container'>
      <div className='card-container'>
        {homes.map(home => (
          <Draggable>
            <Card className="card" key={home._id}>
              <Card.Body>
                <Card.Title>{home.name}</Card.Title>
                <Card.Text>{home.address.street}, {home.address.city}, {home.address.state}, {home.address.zip}</Card.Text>
                <Button className='btn' onClick={() => handleState(home)} variant="primary">Test</Button>
              </Card.Body>
            </Card>
          </Draggable>
        ))}
      </div>
  </div>
    
  
  );
}

export default DisplayHomes;


