import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import LogoutButton from "./LogoutButton";


import { UserContext } from '../context/context';
import { AccessTokenContext } from "../context/context";
import useUserRequests from "../hooks/user-requests";

const Profile = () => {
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const { updateUser } = useUserRequests();

  const [therapistParameters, setTherapistParameters] = useState({
    workingDays: null,
  });

  useEffect(() => {
    setTherapistParameters((prev) => ({
      ...prev,
      workingDays: user.workingDays
    }));
  }, [])

  const handleTherapistParameters = (event) => {
    const {name, value} = event.target;
    setTherapistParameters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const savePreferences = async () => {
    await updateUser(user._id, accessToken, therapistParameters);
  }

  return (
    <div>
      <div>
        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>{user.designation}</p>
      </div>
      <div>
        <label for="workingDays">Working Days:</label>
        <input onChange={handleTherapistParameters} type="number" id="workingDays" value={therapistParameters.workingDays} name="workingDays" min="1" max="7" />
        <button onClick={savePreferences}>Save</button>
      </div>
      <LogoutButton />
    </div>
   
  );
};

export default Profile;
