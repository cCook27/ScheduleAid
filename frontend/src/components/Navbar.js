import React from 'react';
import { useEffect } from 'react';
import useRequestMaker from '../hooks/request-maker';

const Navbar = () => {

  const {getHomes} = useRequestMaker();
  useEffect(() => {
    getHomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{background: '#e3f2fd'}}>
      <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item me-5 ">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item me-5">
            <a className="nav-link" href="/create">Create Client</a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" href="/manage">
              Manage Clients
            </a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" href="/scheduling">
              Scheduling
            </a>
          </li>
          <li className="nav-item me-5">
            <a className="nav-link" href="#">Tutorial</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;