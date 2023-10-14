import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './static/Home.js'
import Dashboard from './components/Dashboard.js';
import Loading from './pop-ups/loading.js';

import './App.css'
import DashboardHolder from "./components/Dashboard.js";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  

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
    <DashboardHolder />
  );
}

export default App;


