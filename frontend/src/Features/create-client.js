import React from 'react';
import Form from 'react-bootstrap/Form';
import '../css/create-client.css'
import { useState, useContext } from 'react';

import useHomeRequests from '../hooks/home-requests';
import {UserContext, AccessTokenContext} from '../context/context';

function CreateClient() {
  const {addNewHome} = useHomeRequests();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleState = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    addNewHome(formData, user._id, accessToken);
  }

  return (
    <Form onSubmit={handleSubmit} className="form">
      <div className="row ps-2 mb-3">
        <div className="col-12">

          <div className="form-group my-3">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              value={formData.name}
              onChange={handleState}
              className="form-control"
            />
          </div>

          
          <div className="form-group my-3">
            <label>Address</label>
            <input
              placeholder="1234 Main St"
              name="street"
              value={formData.street}
              onChange={handleState}
              className="form-control"
            />
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group my-3">
                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleState}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group my-3">
                <label>State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleState}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group my-3">
                <label>Zip</label>
                <input
                  name="zip"
                  value={formData.zip}
                  onChange={handleState}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col pe-0">
            <div className="btn-container">
              <button className='btn-style' type="submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default CreateClient;

