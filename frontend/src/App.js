import { useEffect, useState } from 'react';

import Home from './static/Home.js'
import Navbar from './components/Navbar.js'
import DisplayClients from './Features/display-clients.js';
import CreateClient from './Features/create-client.js';
import Calendar from './components/Calendar.js';
import LogoutButton from './auth/LogoutButton.js';
import Profile from './auth/Profile.js';
import Dashboard from './components/Dashboard.js';
import Loading from './pop-ups/loading.js';

import './App.css'

import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateProfile from './auth/CreateProfile.js';



function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const currentPath = window.location.path;

  if(isLoading) {
    return (
      <div className='container-fluid loading-page'>
        <Loading />
      </div>
    )
  }

  if(!isAuthenticated) {
    return (
      <div>
        <Home />
      </div>
    )
  }
  
  return (
    <div>
      <div>
        <Router>
          {currentPath !== '/create-profile' ? <div>
            <Navbar />
          </div> : null}
          
          <Switch>
            <Route exact path="/" component={Dashboard}></Route>
            <Route exact path="/create-profile" component={CreateProfile}></Route> 
            <Route exact path="/profile" component={Profile}></Route>
            <Route exact path="/logout" component={LogoutButton}></Route>
            <Route exact path="/create" component={CreateClient} ></Route>
            <Route exact path="/manage" component={DisplayClients} ></Route>
            <Route exact path="/scheduling" component={Calendar} ></Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;


    