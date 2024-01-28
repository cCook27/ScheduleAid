import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

import Home from './static/Home.js'
import Loading from './pop-ups/loading.js';

import Navbar from './components/Navbar.js'
import DisplayClients from './Features/display-clients.js';
import Dashboard from './Features/dashboard.js';
import Calendar from './components/Calendar.js';
import LogoutButton from './auth/LogoutButton.js';
import Profile from './auth/Profile.js';
import CreateProfile from './auth/CreateProfile.js';
import ViewPatient from './Features/view-patient.js';
import ModalWrapper from './components/Modal-Wrapper.js';

import { UserContext, AccessTokenContext, GroupsContext } from './context/context.js';
import useUserRequests from './hooks/user-requests.js';
import useModalInfo from './hooks/modal-info.js';

import './App.css'

function App() {
  const { getUser } = useUserRequests();
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { isOpen, modalType, modalProps, openModal, closeModal } = useModalInfo();
  
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
          <Router>  
            {currentPath !== '/create-profile' ? <Navbar /> : null}
            <UserContext.Provider value={userInfo}>
              <AccessTokenContext.Provider value={accessToken}>
                <GroupsContext.Provider value={{ groups, updateGroups }}>
                  <Routes> 
                    <Route exact path="/" element={<Dashboard/>} />
                    <Route exact path="/profile" element={<Profile/>} />
                    <Route exact path="/logout" element={<LogoutButton/>} />
                    <Route exact path="/manage" element={<DisplayClients/>}  />
                    <Route path="/manage/:id" element={<ViewPatient openModal={openModal}/>} />
                    <Route exact path="/scheduling" element={<Calendar />} />
                  </Routes>
                </GroupsContext.Provider>
              </AccessTokenContext.Provider>
            </UserContext.Provider>
          </Router>
        </div>
        {isOpen ? <ModalWrapper userId={userInfo._id} accessToken={accessToken} modalType={modalType} modalProps={modalProps} closeModal={closeModal} /> : null}
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
                <Routes> 
                  <Route exact path="/" element={<Dashboard/>} />
                  <Route exact path="/profile" element={<Profile/>} />
                  <Route exact path="/logout" element={<LogoutButton/>} />
                  <Route exact path="/manage" element={<DisplayClients/>}  />
                  <Route path="/manage/:id" element={<ViewPatient />} />
                  <Route exact path="/scheduling" element={<Calendar/>}  />
                </Routes>
              </Router>
            </GroupsContext.Provider>
          </AccessTokenContext.Provider>
        </UserContext.Provider>
      </div>
      
    )
  }
}

export default App;


