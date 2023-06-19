import React, { useEffect, useState } from 'react';
import useRequestMaker from '../hooks/request-maker';
import { useSelector } from 'react-redux';

import '../css/display-homes.css'
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';

function DisplayHomes() {
  const {getHomes} = useRequestMaker();

  const homes = useSelector(state => state.homes);
  const newHome = useSelector(state => state.newHome);

  useEffect(() => {
    getHomes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newHome]);



  return (
    <div>
    {homes.map(home => (
      <Card className="card" key={home._id}>
        <Card.Body>
          <Card.Title>{home.name}</Card.Title>
          <Card.Text>{home.address.number}, {home.address.street}, {home.address.city}, {home.address.state}, {home.address.zip}</Card.Text>
        </Card.Body>
      </Card>
    ))}
  </div>
  );
}

export default DisplayHomes;


//   // const addressToString = (address) => {
  //   let stringAddress = '';
  //   const addressValues = Object.values(address);

  //   addressValues.forEach((parcel) => {
  //     stringAddress = stringAddress + parcel + ',' + ' '; 
  //   });

  //   return stringAddress;
  // }