import React, {useContext} from "react";
import { useQuery } from 'react-query';
import { useAuth0 } from "@auth0/auth0-react";

import useDistanceRequests from "../hooks/distance-request";
import useHomeRequests from "../hooks/home-requests";
import {UserContext, AccessTokenContext} from '../context/context';
import "../css/create-schedule.css"

const CreateSchedule = () => {
  const { getRoutes } = useDistanceRequests();
  const { getHomes } = useHomeRequests();
  const { isLoading } = useAuth0();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const { data: homes, status } = useQuery('homes', 
    () => getHomes(user._id, accessToken)
  );

  const handleRoutes = () => {
    getRoutes(user._id, accessToken)
  }

  return(
    <div>
      <div className="row">
        <div className="col day">
          <h6>Sunday</h6>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="Sunday" />
          </div>
        </div>
        <div className="col day">
          <h6>Monday</h6>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="Monday" />
          </div>
        </div>
        <div className="col day">
          <h6>Tuesday</h6>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="Tuesday" />
          </div>
        </div>
        <div className="col day">
          <h6>Wednesday</h6>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="Wednesday" />
          </div>
        </div>
        <div className="col day">
          <h6>Thursday</h6>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="Thursday" />
          </div>
        </div>
        <div className="col day">
          <h6>Friday</h6>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="Friday" />
          </div>
        </div>
        <div className="col day">
          <h6>Saturday</h6>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="Saturday" />
          </div>
        </div>
      </div>
      
      <button onClick={handleRoutes}>Routes</button>
    </div>
  )
}

export default CreateSchedule

{/* <div className="row">
      <div className="col pt-4">
            <div className="row">
              {isLoading ? (
                <div className="col">
                  <div>Loading...</div>     
                </div>
              ) : status === 'error' ? (
                <div className="col">
                  <div>Error loading Patients</div>
                </div>
              ) : !homes ? (
                <div className="col">
                  <div>No Current Patients</div>     
                </div>
              ): (
                homes.map(home => (
                  <div  key={home._id} className="col d-flex justify-content-center align-items-center">
                    <div className="card m-2 shadow-lg">
                      <div className="card-body p-2">
                        <div className='text-center name'>{home.name}</div>
                        <div className='text-center'>
                          <p>{home.address}</p>
                          <p>{home.number}</p>
                          {home.active ? <p>{home.active}</p> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
      </div> */}