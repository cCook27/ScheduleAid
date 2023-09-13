import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './static/Home.js'
import Dashboard from './components/Dashboard.js';
import Loading from './pop-ups/loading.js';

import './App.css'

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
    <Router>
      <Switch>
        <Route component={Dashboard} /> {/* Default Dashboard Route */}
      </Switch>
    </Router>
  );
}

export default App;


// <div>
// //   <div>
// //     <Router>
// //       {currentPath !== '/create-profile' ? <div>
// //         <Navbar />
// //       </div> : null}
      
// //       <Switch>
// //         <Route exact path="/" component={Dashboard}></Route>
// //         <Route exact path="/create-profile" component={CreateProfile}></Route> 
// //         <Route exact path="/profile" component={Profile}></Route>
// //         <Route exact path="/logout" component={LogoutButton}></Route>
// //         <Route exact path="/create" component={CreateClient} ></Route>
// //         <Route exact path="/manage" component={DisplayClients} ></Route>
// //         <Route exact path="/scheduling" component={Calendar} ></Route>
// //       </Switch>
// //     </Router>
// //   </div>
// // </div>