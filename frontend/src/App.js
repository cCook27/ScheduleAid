import './App.css'

import Header from './components/header';
import Schedule from './components/schedule';
import DisplayHomes from './components/display-homes';
import CreateHomes from './components/create-homes';
import useRequestMaker from './hooks/request-maker';

function App() {
  useRequestMaker()

  return (
    <div className='container'>
      <Header />
      <Schedule />
      <div className="bottom">
        <DisplayHomes />
        <CreateHomes />
      </div>
      
    </div>
  );
}

export default App;
