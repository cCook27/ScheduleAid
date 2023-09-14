import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import LogoutButton from "./LogoutButton";
import { UserContext } from '../context/context';

const Profile = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const user = useContext(UserContext);

  

  return (
    <div>
      <div>
        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>{user.designation}</p>
      </div>
      <LogoutButton />
    </div>
   
  );
};

export default Profile;
