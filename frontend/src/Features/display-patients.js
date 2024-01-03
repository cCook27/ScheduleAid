import React, { useEffect, useState } from "react";

import Loading from "../pop-ups/loading";

import "../css/display-patients.css"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const DisplayPatients = ({ handleDragStart, homes, homeStatus, myEvents, start, end, handleAdditionalToggle }) => {

  const [remainingPatients, setRemainingPatients]=useState([]);
 
  useEffect(() => {

    if(homes) {
      const viewStart = new Date(start.setHours(0, 0, 0, 0)).getTime();
      const viewEnd = new Date(end.setHours(23, 59, 59, 999)).getTime();

      const activePatients = homes.filter((home) => home.active);
      
      const eventsUsed = myEvents.filter((event) => {
        const eventStart = new Date(event.start).getTime();
        return eventStart >= viewStart && eventStart <= viewEnd;
      });
  
      const patientsRemaining = activePatients.map((patient) => {
        const frequency = parseInt(patient.frequency);
      
        if(frequency !== eventsUsed.filter((event) => event.address === patient.address && event.title === `${patient.firstName} ${patient.lastName}`).length) {
          return patient;
        }
      });
  
      setRemainingPatients(patientsRemaining);
    }
  
  },[myEvents, start]);

  const toggleAdditionalVisits = () => {
    handleAdditionalToggle();
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click here to select specific patients that need to be seen outside of their normal weekly frequency.
    </Tooltip>
  );

  return (
    <div className="container">
      <div className="row mb-2">
        <div className="col d-flex justify-content-center align-items-center">
          <h4 className="title">Patients</h4>
        </div>
      </div>
      <div className="row patient-display">
        <div className="col-4 d-flex justify-content-center align-items-center patient-card">
          <button onClick={toggleAdditionalVisits} className="add-ex-cont btn d-flex align-items-center">
            <div className='me-1'>
              <span className="d-flex align-items-center">
                <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                >
                  
                  <svg width="20" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className='info-icon' fillRule="evenodd" clip-rule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM2 10C2 14.4183 5.58172 18 10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10ZM11 10.5C11 10.2239 10.7761 10 10.5 10H9.5C9.22386 10 9 10.2239 9 10.5V13.5C9 13.7761 9.22386 14 9.5 14H10.5C10.7761 14 11 13.7761 11 13.5V10.5ZM10.5 6C10.7761 6 11 6.22386 11 6.5V7.5C11 7.77614 10.7761 8 10.5 8H9.5C9.22386 8 9 7.77614 9 7.5V6.5C9 6.22386 9.22386 6 9.5 6H10.5Z" fill="#fff"/>
                  </svg>
              
                </OverlayTrigger>
              </span>
            </div>
            <div className="add-ex-des">Additional Visits</div>
          </button>
        </div>
      {homeStatus === 'loading' ? (
        <div><Loading /></div>
      ) : homeStatus === 'error' ? (
        <div>Error Loading Patients...</div>
      ) : !homes ? (
        <div className="col">
          <div>No Patients saved</div>     
        </div>
      ) : (
        remainingPatients.map((patient, index) => (
          patient ? 
              (
                <div key={patient._id} className="col-4 d-flex justify-content-center align-items-center flex-column patient-card" >
                  <div draggable onDragStart={() =>
                    handleDragStart(`${patient.firstName} ${patient.lastName}`, patient.address, patient.coordinates)} className="person-cont d-flex flex-column justify-content-center align-items-center">
                    <div className="name ellipsis-overflow"> <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span></div>
                    <div className="address ellipsis-overflow">{patient.address}</div>
                  </div>
                </div>
              ) : 
              (
                <div key={homes[index]._id} className="col-4 d-flex justify-content-center align-items-center flex-column patient-card" >
                  <div className="person-cont used d-flex flex-column justify-content-center align-items-center">
                    <div className="name ellipsis-overflow"><span className="me-1">{homes[index].firstName}</span> {homes[index].lastName}</div>
                    <div className="address ellipsis-overflow">{homes[index].address}</div>
                  </div>
                </div>
              )
              
              )
            )
          )
        }
      </div>
    </div>
    
  )
}

export default DisplayPatients




