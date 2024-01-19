import React, {useState, useEffect} from "react";

import Loading from "../../pop-ups/loading";
import "../../css/display-groups.css"

import useComparisonRequests from "../../hooks/comparison-requests";


const GeoGroups = ({ handleDragStart, patientGroups, homes, myEvents, start, end, handleEventsUpdate, handleUpdatedGroups }) => {


  return (
    <div className="container">
      <div className="row d-flex justify-content-center align-items-center">
        {!homes ? 
          (
            <div className="col">
              <div>No Patients saved</div>     
            </div>
          ) : 
          
          !patientGroups ? 
            (
              <div><Loading /></div>
            ) : 
          
            patientGroups.geoGroups.geos.length >= 1 && 
            patientGroups.geoGroups.geos.length <= 7 ? 
            (
              patientGroups.geoGroups.geos.map((group, index) => (
                <div className="col-3 d-flex flex-column group mx-3 my-2">
                  <div className="group-number">Group {index + 1}</div>
                  <div className="d-flex justify-content-center align-items-center row">

                {
                  group.map((patient) => (
                    patient.scheduled === true ? 

                    (
                      <div className="col-6 d-flex patient-cont used" key={patient._id} >
                        <div className="patient-name ellipsis-overflow">
                          <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span>
                        </div>
                      </div>
                    ) : 

                    (
                      <div className="col-6 d-flex patient-cont" key={patient._id} draggable onDragStart={() => handleDragStart(`${patient.firstName} ${patient.lastName}`, patient.address, patient.coordinates, index)}>
                        <div className="patient-name ellipsis-overflow">
                          <span className="me-1">{patient.firstName}</span> <span>{patient.lastName}</span>
                        </div>
                      </div>
                    ) 

                  ))
                }

                  </div>
                </div>
              ))
            ) :

            (
              <div>contrary</div>
            )
        }
      </div>
    </div>
  )
}

export default GeoGroups;