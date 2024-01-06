import React from "react";
import { UserContext, AccessTokenContext } from '../context/context.js';
import { useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';

import useScheduleRequests from "../hooks/schedule-requests.js";

const Dashboard = () => {
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const { getUserSchedule } = useScheduleRequests();
  const { data: dbSchedule, dbScheduleStatus } = useQuery(["schedule"], 
    () => getUserSchedule(user._id, accessToken), {
      onSuccess: (data) => {
        findTodayVisits(data); 
      },
    }
  );  

  const [schedule, setSchedule] = useState(undefined);

  const dateUniformer = (timeStamp) => {
    const date = timeStamp ? new Date(timeStamp) : new Date();
    const dateValues = {
      dateYear: date.getFullYear(),
      dateMonth: date.getMonth() + 1, 
      dateDay: date.getDate(),
    };

    return dateValues;
  };
  
  const findTodayVisits = (data) => {
    const today = dateUniformer(undefined);
    
    const currentEvents = data.filter((event) => {
      const eventDate = dateUniformer(event.start);
      return today.dateYear === eventDate.dateYear && today.dateMonth === eventDate.dateMonth && today.dateDay === eventDate.dateDay;
    });

    setSchedule(currentEvents);
  };

  useEffect(() => {
    console.log(schedule)
  },[schedule])

  return (
    <div className="container">
      {
        schedule ? 
        (
          
          schedule.map((event) => (
            <div className="row">
              <div className="col">{event.title}</div>
            </div>
          ))
          
        ) : null
      }
    </div>
  )
};

export default Dashboard;