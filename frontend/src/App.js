import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

import Home from './static/Home.js'
import Loading from './pop-ups/loading.js';

import Navbar from './components/Navbar.js'
import DisplayClients from './Features/display-clients.js';
import Dashboard from './Features/dashboard.js';
import Calendar from './components/Calendar.js';
import LogoutButton from './auth/LogoutButton.js';
import Profile from './auth/Profile.js';
import useUserRequests from './hooks/user-requests.js';
import CreateProfile from './auth/CreateProfile.js';
import { UserContext, AccessTokenContext, GroupsContext } from './context/context.js';

import './App.css'


function App() {
  const { getUser } = useUserRequests();
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  
  const [validUser, setValidUser] = useState(false);  
  const [userInfo, setUserInfo] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [groups, setGroups] = useState(undefined);

  const currentPath = window.location.pathname;

  if(isLoading) {
    return (
      <div className="conent-container loading-page">
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

  if (isAuthenticated  && !validUser) {
    getUser(user.sub)
      .then((userData) => {
        if (userData.error) {
          if(currentPath !== '/create-profile') {
            setValidUser(false);
            window.location.pathname = '/create-profile'
          } else {
            console.log('checked')
          }
          
        } else {
          setValidUser(true);
          setUserInfo(userData)
          retrieveToken();
        }
      });
  } else {
    console.log('skip');
  }

  const retrieveToken = async () => {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: `https://www.Home2Home-api.com`,
        scope: "read:current_user",
      },
    });
    setAccessToken(accessToken);
  };

  const updateGroups = (newGroup) => {
    setGroups(newGroup);
  };
  
  
  if(validUser) {
    return (
      <div className='overall'>
        <div>
          <UserContext.Provider value={userInfo}>
            <AccessTokenContext.Provider value={accessToken}>
              <GroupsContext.Provider value={{ groups, updateGroups }}>
                <Router>
                {currentPath !== '/create-profile' ? <Navbar /> :
                  null
                }
                  
                  <Switch> 
                    <Route exact path="/" component={Dashboard}></Route>
                    <Route exact path="/profile" component={Profile}></Route>
                    <Route exact path="/logout" component={LogoutButton}></Route>
                    <Route exact path="/manage" component={DisplayClients} ></Route>
                    <Route exact path="/scheduling" component={Calendar} ></Route>
                  </Switch>
                </Router>
               </GroupsContext.Provider>
            </AccessTokenContext.Provider>
          </UserContext.Provider>
        </div>
      </div>
    );
  } else if(isLoading) {
    return (
      <Loading />
    )
  } else if(currentPath === '/create-profile') {
    return (
      <div>
        <CreateProfile />

        <UserContext.Provider value={userInfo}>
          <AccessTokenContext.Provider value={accessToken}>
            <GroupsContext.Provider value={{groups, updateGroups}}>
              <Router>                
                <Switch> 
                  <Route exact path="/" component={Dashboard}></Route>
                  <Route exact path="/profile" component={Profile}></Route>
                  <Route exact path="/logout" component={LogoutButton}></Route>
                  <Route exact path="/manage" component={DisplayClients} ></Route>
                  <Route exact path="/scheduling" component={Calendar} ></Route>
                </Switch>
              </Router>
            </GroupsContext.Provider>
          </AccessTokenContext.Provider>
        </UserContext.Provider>
      </div>
      
    )
  }
}

export default App;


