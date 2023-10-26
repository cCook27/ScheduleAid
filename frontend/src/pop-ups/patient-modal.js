import React from "react";

const PatientModal = ({client, setClientRepeat, removeFromCal, closeModal}) => {

  return(
    <div className="card" style={{width: "18rem", height: "300px"}}>
    <div className="p-0 card-body text-center">
      <h2>{client.title}</h2>
      <h6 className='text-start ps-2 pt-2'>Repeat:</h6>
      <div className='row pb-4'>
        <div className="col">
          <button className={`repeat ${client.repeat === 'weekly' ? 'repeat-selected' : ''}`} onClick={() => setClientRepeat(client.id, 'weekly')}>Weekly</button>
        </div>
        <div className="col">
        <button className={`repeat ${client.repeat === 'monthly' ? 'repeat-selected' : ''}`} onClick={() => setClientRepeat(client.id, 'monthly')}>Monthly</button>
        </div>
        <div className="col">
        <button className={`repeat ${client.repeat === 'never' ? 'repeat-selected' : ''}`} onClick={() => setClientRepeat(client.id, 'never')}>Never</button>
        </div>
      </div>
      <p>
        Would you like to remove this client from {client.start}
      </p>
      <button className='m-2 remove' onClick={() => removeFromCal(client.id)}>Remove</button>
      <button className='m-2' onClick={closeModal}>Close</button>
    </div>
  </div>
  )
}

export default PatientModal;