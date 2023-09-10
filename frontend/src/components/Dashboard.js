import React from 'react';
import { useEffect, useState } from 'react';
import useUserRequests from '../hooks/user-requests';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from '../pop-ups/loading';

const Dashboard = () => {

  const { getUser } = useUserRequests()
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState(false);  

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (isAuthenticated && user) {
      getUser(user.sub)
        .then((userData) => {
          if (userData.error) {
            setUserInfo(false);
            window.location.pathname = '/create-profile';
          } else {
            setUserInfo(true);
          }
        });
    }
  }, []);

  if(userInfo) {
    return (
      <h1>Dashboard</h1>
    );
  } else {
    return (
      <Loading />
    )
  }
  
};

export default Dashboard