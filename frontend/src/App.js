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
      <DisplayHomes className="bottom" />
      <CreateHomes />
    </div>
  );
}

export default App;
