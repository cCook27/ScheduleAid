import Home from './components/Home.js'
import Navbar from './components/Navbar.js'
import DisplayClients from './Features/display-clients.js';
import CreateClient from './Features/create-client.js';
import Calendar from './components/Calendar.js';
import useRequestMaker from './hooks/request-maker';
import { useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  const [addClass, setAddClass] = useState(false); 

  useRequestMaker()




  return (

    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/create" component={CreateClient} ></Route>
        <Route exact path="/manage" component={DisplayClients} ></Route>
        <Route exact path="/scheduling" component={Calendar} ></Route>
      </Switch>
    </Router>

  );
}

export default App;


    // <div className='container-fluid'>
    //   <div className="row">
    //     <div className="col">

    //       <div className="row header">
    //         <div className="col">
    //         <Header />
    //         </div>
    //       </div>

    //       <div className="row schedule/create">
    //         <div className="col">
    //         <DisplayHomes handleHomeDrop={handleHomeDrop} />
    //         </div>
    //       </div>

    //       <div className="row displayHomes py-4">
    //         <div className="col">
              
    //           <CreateHomes />
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    // </div>