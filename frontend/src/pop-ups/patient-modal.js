import React from "react";
import { useEffect, useState } from "react";

const PatientModal = ({client, removeFromCal, closeModal}) => {

  const [groupNums, setGroupNums] = useState([]);

  // useEffect(() => {
  //   const patientMatches = groupManualChoices.filter((patient) => {
  //     return patient.id === client.id;
  //   });

  //   const patientNumbersAvailable = patientMatches.map((patient) => {
  //     return {
  //       id: patient.id,
  //       group: patient.group
  //     }
  //   });

  //   setGroupNums(patientNumbersAvailable);
  // }, [groupManualChoices]);

  return(
    <div className="card" style={{width: "18rem", height: "300px"}}>
    <div className="p-0 card-body text-center">
      <h2>{client.title}</h2>
      <h6 className='text-start ps-2 pt-2'>Choose the Group this Patient Belongs to:</h6>
        {
          groupNums.length > 0 ? (
            groupNums.map((num, index) => (
              <button key={index}>{num.group}</button>
            ))
          ): null
        }
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