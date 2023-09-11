import React from 'react';
import { useEffect, useState } from 'react';
import useUserRequests from '../hooks/user-requests';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from '../pop-ups/loading';

const Dashboard = () => {

  const { getUser } = useUserRequests()
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [validUser, setValidUser] = useState(false);  
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      getUser(user.sub)
        .then((userData) => {
          if (userData.error) {
            setValidUser(false);
            window.location.pathname = '/create-profile';
          } else {
            setValidUser(true);
            setUserInfo(userData)
          }
        });
    }
  }, []);

  if(validUser) {
    console.log(userInfo)
    return (
      <div>
        <h1>Welcome {userInfo.name}!</h1>
      </div>
    );
  } else {
    return (
      <Loading />
    )
  }
  
};

export default Dashboard