import './App.css'

import Header from './components/header';
import Schedule from './components/schedule';
import DisplayHomes from './components/display-homes';
import CreateHomes from './components/create-homes';
import useRequestMaker from './hooks/request-maker';

function App() {
  useRequestMaker()

  return (
    <div className='container-fluid'>
      <div className="row">
        <div className="col">

          <div className="row header">
            <div className="col">
            <Header />
            </div>
          </div>

          <div className="row schedule/create">
            <div className="col-8">
              <Schedule />
            </div>
            <div className="col-4">
              <CreateHomes />
            </div>
          </div>

          <div className="row displayHomes py-4">
            <div className="col">
              <DisplayHomes />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
