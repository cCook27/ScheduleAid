import React from 'react';
import { useLocation } from 'react-router-dom';

import '../css/navbar.css'

const Navbar = () => {

  const location = useLocation();

  if(location.pathname === '/register') {
    return null;
  } 
   return (
    <div className="container">
      <div className="row">
        <div className="col d-flex justify-content-center align-items center">
          <div><a className="nav-link" href="/">Home</a></div>
        </div>
        <div className="col d-flex justify-content-center align-items center">
          <div><a className="nav-link" href="/manage">Patients</a></div>
        </div>
        <div className="col d-flex justify-content-center align-items center">
          <div><a className="nav-link" href="/scheduling">Scheduling</a></div>
        </div>
        <div className="col d-flex justify-content-center align-items center">
          <div><a className="nav-link" href="/profile">Profile</a></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;



          
          