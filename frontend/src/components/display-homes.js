import React, { useEffect, useState } from 'react';
import useRequestMaker from '../hooks/request-maker';
import { useSelector } from 'react-redux';

import '../css/display-homes.css'
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function DisplayHomes() {
  const [pair, setPair] = useState({
    origin: null,
    destination: null
  })


  const {getHomes} = useRequestMaker();
  const {getPairDistance} = useRequestMaker();

  const homes = useSelector(state => state.homes);
  const newHome = useSelector(state => state.newHome);
  const pairData = useSelector(state => state.pair);

  useEffect(() => {
    getHomes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newHome]);

  const handleState = (home) => {
    if(!pair.origin) {
      setPair(prevPair => ({
        ...prevPair,
        origin: home
      }));
    } else {
      setPair(prevPair => ({
        ...prevPair,
        destination: home
      }));
    }
  };

  const handleTest = () => {
    getPairDistance(pair);

    setPair(prevPair => ({
      ...prevPair,
      origin: null,
      destination: null
    }));
  }

  const handlePairs = () => {
    if(pairData.length >= 1) {
      return (
        <div>Pair Times</div>
      )
      
    } else {
      return (
        <div>Waiting For Pair Test</div>
      )
    }
  };

  return (
    <div>
    {homes.map(home => (
      <Card className="card" key={home._id}>
        <Card.Body>
          <Card.Title>{home.name}</Card.Title>
          <Card.Text>{home.address.street}, {home.address.city}, {home.address.state}, {home.address.zip}</Card.Text>
          <Button className='btn' onClick={() => handleState(home)} variant="primary">Test</Button>
        </Card.Body>
      </Card>
    ))}

    <Button className='btn' onClick={handleTest} variant="primary">Run Test</Button>
  </div>
  );
}

export default DisplayHomes;


