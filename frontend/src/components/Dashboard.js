import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import Navbar from './Navbar.js'
import DisplayClients from '../Features/display-clients.js';
import CreateClient from '../Features/create-client.js';
import Calendar from './Calendar.js';
import LogoutButton from '../auth/LogoutButton.js';
import Profile from '../auth/Profile.js';
import Loading from '../pop-ups/loading.js';
import useUserRequests from '../hooks/user-requests';
import CreateProfile from '../auth/CreateProfile.js';
import { UserContext, AccessTokenContext } from '../context/context.js';

const Dashboard = () => {

  const { getUser } = useUserRequests()
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  
  const [validUser, setValidUser] = useState(false);  
  const [userInfo, setUserInfo] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (isAuthenticated && user) {
      retrieveToken()
      getUser(user.sub)
        .then((userData) => {
          if (userData.error) {
            setValidUser(false);
          } else {
            setValidUser(true);
            setUserInfo(userData)
          }
        });
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
               <Navbar />
               
                {currentPath === '/' ? 
                  <div>
                    <h1>Welcome {userInfo.name}!</h1>
                  </div> : null
                }
                
                <Switch> 
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
  } else {
    return (
      <CreateProfile />
    )
  }
  
};

export default Dashboard