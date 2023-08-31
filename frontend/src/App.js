import Home from './components/Home.js'
import Navbar from './components/Navbar.js'
import DisplayClients from './Features/display-clients.js';
import CreateClient from './Features/create-client.js';
import Calendar from './components/Calendar.js';
import LoginButton from './auth/LoginButton.js';
import LogoutButton from './auth/LogoutButton.js';

import useHomeRequests from './hooks/home-requests.js';
import useScheduleRequests from './hooks/schedule-requests.js';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';




function App() {
  useHomeRequests();
  useScheduleRequests();
  return (
    <div>
      <div>
        <header>
          <h1>Dashboard</h1>
        </header>
        <div>
          <LoginButton />
          <LogoutButton />
        </div>
      </div>


      <div>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/home" component={Home}></Route>
          <Route exact path="/create" component={CreateClient} ></Route>
          <Route exact path="/manage" component={DisplayClients} ></Route>
          <Route exact path="/scheduling" component={Calendar} ></Route>
        </Switch>
      </Router>
    </div>
    </div>

    

    

  );
}

export default App;


    