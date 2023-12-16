import React from 'react';
import { useLocation } from 'react-router-dom';

import '../css/navbar.css'

const Navbar = () => {

  const location = useLocation();

  if(location.pathname === '/register') {
    return null;
  } 
   return (
    <div className="cont">
      <div className="row link-cont">
        <div className="col-3 d-flex justify-content-center align-items center">
          <div className="link"><a className="link" href="/">Home</a></div>
        </div>
        <div className="col-3 d-flex justify-content-center align-items center">
          <div className="link"><a className="link" href="/manage">Patients</a></div>
        </div>
        <div className="col-3 d-flex justify-content-center align-items center">
          <div className="link"><a className="link" href="/scheduling">Scheduling</a></div>
        </div>
        <div className="col-3 d-flex justify-content-center align-items center">
          <div className="link"><a className="link" href="/profile">Profile</a></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;



          
          