import React from "react";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-grow m-1 text-primary" role="status">
      </div>
      <div className="spinner-grow m-1 text-success" role="status">
      </div>
      <div className="spinner-grow m-1 text-danger" role="status">
      </div>
      <div className="spinner-grow m-1 text-warning" role="status">
      </div>
      <div className="spinner-grow m-1 text-info" role="status">
      </div>
      <div className="spinner-grow m-1 text-dark" role="status">
      </div>
    </div>
  )
};

export default Loading;