import React from 'react';

import { momentLocalizer, Calendar as BigCalendar } from 'react-big-calendar';
import moment from "moment";
import { useSelector } from 'react-redux';


const localizer = momentLocalizer(moment);

function Calendar(props) {
  
  const homes = useSelector(state => state.homes);
  return (
    <div className='row my-5'>
      <div className='col-8 ms-3 d-flex justify-content-start'>
        <div style={{height: '80vh', width: '100%'}}>
          <BigCalendar {...props} localizer={localizer} />
        </div>
      </div>
      <div className="col-3 d-flex justify-content-center">
        <div className="row">
          {homes.map(home => (
            <div key={home._id} className="col-6">
              <div className="card my-3" style={{width: "10rem"}}>
                <div className="card-body">
                  <h6 className="card-title">{home.name}</h6>
                  <p className="card-text">{home.address.city}, {home.address.zip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     
    </div>
    
  ) 
}

export default Calendar;



























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