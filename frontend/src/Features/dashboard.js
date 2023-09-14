import React from "react";
import { UserContext, AccessTokenContext } from '../context/context.js';
import { useState, useContext } from 'react';

const Dashboard = () => {
  const user = useContext(UserContext);

  return (
    <h1>Welcome, {user.name}</h1>
  )
}

export default Dashboard;