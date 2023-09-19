import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import Navbar from './Navbar.js'
import DisplayClients from '../Features/display-clients.js';
import CreateClient from '../Features/create-client.js';
import Dashboard from '../Features/dashboard.js';
import Calendar from './Calendar.js';
import LogoutButton from '../auth/LogoutButton.js';
import Profile from '../auth/Profile.js';
import Loading from '../pop-ups/loading.js';
import useUserRequests from '../hooks/user-requests.js';
import CreateProfile from '../auth/CreateProfile.js';
import { UserContext, AccessTokenContext } from '../context/context.js';

const DashboardHolder = () => {

  const { getUser } = useUserRequests();
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  
  const [validUser, setValidUser] = useState(false);  
  const [userInfo, setUserInfo] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (isAuthenticated) {
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
            retrieveToken()
          }
        });
    } else {
      console.log('skip')
    }
  }, []);

  const retrieveToken = async () => {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: `https://www.Home2Home-api.com`,
        scope: "read:current_user",
      },
    });

    setAccessToken(accessToken);
  }

  if(validUser) {
    return (
      <div>
        <div>
          <UserContext.Provider value={userInfo}>
            <AccessTokenContext.Provider value={accessToken}>
              <Router>
               {currentPath !== '/create-profile' ? <Navbar /> :
                null
               }
                
                <Switch> 
                  <Route exact path="/" component={Dashboard}></Route>
                  <Route exact path="/profile" component={Profile}></Route>
                  <Route exact path="/logout" component={LogoutButton}></Route>
                  <Route exact path="/create" component={CreateClient} ></Route>
                  <Route exact path="/manage" component={DisplayClients} ></Route>
                  <Route exact path="/scheduling" component={Calendar} ></Route>
                </Switch>
              </Router>
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
            <Router>                
              <Switch> 
                <Route exact path="/" component={Dashboard}></Route>
                <Route exact path="/profile" component={Profile}></Route>
                <Route exact path="/logout" component={LogoutButton}></Route>
                <Route exact path="/create" component={CreateClient} ></Route>
                <Route exact path="/manage" component={DisplayClients} ></Route>
                <Route exact path="/scheduling" component={Calendar} ></Route>
              </Switch>
            </Router>
          </AccessTokenContext.Provider>
        </UserContext.Provider>
      </div>
      
    )
  }
  
};

export default DashboardHolder;