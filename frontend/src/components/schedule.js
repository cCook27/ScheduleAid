import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useRequestMaker from '../hooks/request-maker';


import '../css/schedule.css'
import Button from 'react-bootstrap/Button';

function Schedule(props) {
  
 
  // const homes = props.homes;
  // const {getTimeDistances} = useRequestMaker();

  // const timeDistances = useSelector(state => state.currentSchedule);

  // useEffect(() => {
  //   console.log(timeDistances);
  //   if(timeDistances.length > 1) {
  //     const duration = timeDistances[0].rows[0].elements[0].duration.text;
  //     console.log(duration);
  //   }
    
  // },[timeDistances])

  // const sendTest = () => {
  //   getTimeDistances(homes);
  // };

  const generateTimeSlots = () => {
    let hours = [];
    let counter = 0
    let hourSlots = [];

    const start = new Date();
    start.setHours(8,0,0);

    const end = new Date()
    end.setHours(19,0,0);

    const increment = 15;

    while(start <= end) {
      if(counter < 4) {
        const timeString = start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        hourSlots.push(timeString);
        start.setTime(start.getTime() + increment * 60000);
        counter += 1;
       
      } else {
        counter = 0
        hours.push(hourSlots);
        hourSlots = [];
      }
      
    }

    console.log(hours)

    return hours;
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="row">

      <div className="col border-right">
        <div className="row">
          <div className="col ">
            Time
          </div>
        </div> 
        <div className="row">
          <div className="col p-0 p-0">
            <ul className="list-unstyled">
              {timeSlots.map((time, index) => (
                <li className='border-bottom' key={index}>{time[0]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="col border-right">
        <div className="row">
          <div className="col ">
            Monday
          </div>
        </div> 
        <div className="row">
          <div className="col p-0">
            {timeSlots.map((time, index) => (
              <div className="border-bottom">
                {time.map((slot, slotIndex) => (
                  <div className='time-element' key={slot}></div>
                ))}
              </div>
            ))} 
          </div>
        </div>
      </div>

      <div className="col border-right">
        <div className="row">
          <div className="col ">
            Tuesday
          </div>
        </div> 
        <div className="row">
          <div className="col p-0">
            {timeSlots.map((time, index) => (
              <div className="border-bottom">
                {time.map((slot, slotIndex) => (
                  <div className='time-element' key={slot}></div>
                ))}
              </div>
            ))} 
          </div>
        </div>
      </div>

      <div className="col border-right">
        <div className="row">
          <div className="col ">
            Wendesday
          </div>
        </div> 
        <div className="row">
          <div className="col p-0">
            {timeSlots.map((time, index) => (
              <div className="border-bottom">
                {time.map((slot, slotIndex) => (
                  <div className='time-element' key={slot}></div>
                ))}
              </div>
            ))} 
          </div>
        </div>
      </div>

      <div className="col border-right">
        <div className="row">
          <div className="col ">
            Thursday
          </div>
        </div> 
        <div className="row">
          <div className="col p-0">
            {timeSlots.map((time, index) => (
              <div className="border-bottom">
                {time.map((slot, slotIndex) => (
                  <div className='time-element' key={slot}></div>
                ))}
              </div>
            ))} 
          </div>
        </div>
      </div>

      <div className="col border-right">
        <div className="row">
          <div className="col ">
            Friday
          </div>
        </div> 
        <div className="row">
          <div className="col p-0">
            {timeSlots.map((time, index) => (
              <div className="border-bottom">
                {time.map((slot, slotIndex) => (
                  <div className='time-element' key={slot}></div>
                ))}
              </div>
            ))} 
          </div>
        </div>
      </div>

    </div>
  );
}

export default Schedule;