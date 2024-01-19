import React from "react";

const ErrorModal = ({closeModal}) => {

  return (
    <div className="card" style={{width: "18rem", height: "175px"}}>
      <div className="p-0 card-body text-center">
        <h2>OOPS!</h2>
        <p>
          It looks like we're ahving trouble testing your schedule. Try again later. We're on it.
        </p>
        <button className='m-2' onClick={closeModal}>Close</button>
      </div>
    </div>
  )
}

export default ErrorModal;