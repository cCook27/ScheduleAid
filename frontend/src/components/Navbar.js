import React from 'react';

const Navbar = () => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{background: '#e3f2fd'}}>
      <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item me-5 ">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" href="/manage">
              Add Clients
            </a>
          </li>
          <li className="nav-item me-5 dropdown">
            <a className="nav-link" href="/scheduling">
              Scheduling
            </a>
          </li>
         
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;