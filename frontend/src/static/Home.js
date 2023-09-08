import React, {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import queryString from 'query-string';


const Home = ({ location }) => {

  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light" style={{background: 'pink'}}>
      <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item me-5 ">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" href="/about">
              About
            </a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" href="/scheduler">
              Scheduling
            </a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" href="/hippa">
             HIPPA
            </a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" onClick={() => loginWithRedirect()} href=''>
              Login
            </a>
          </li>
         
        </ul>
      </div>
    </nav>
     
    </div>
  )
};

export default Home;


