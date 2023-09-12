import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Form from 'react-bootstrap/Form';

import useUserRequests from "../hooks/user-requests";

const CreateProfile = () => {
  const { user } = useAuth0();
  const { addUser } = useUserRequests();
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    address: '',
    email: '',
    _id: ''
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      _id: user.sub
    }))
  }, [user])

  const handleState = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    addUser(formData)
    window.location.pathname = '/dashboard';
  }

  return (
    <div>
    <Form onSubmit={handleSubmit} className="form">
      <div className="row ps-2 mb-3">
        <div className="col-12">

          <div className="form-group my-3">
            <label>Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              name="name"
              value={formData.name}
              onChange={handleState}
              className="form-control"
            />
          </div>

          
          <div className="form-group my-3">
            <label>Designation</label>
            <input
              placeholder="e.g. Occupational Therapist"
              name="designation"
              value={formData.designation}
              onChange={handleState}
              className="form-control"
            />
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group my-3">
                <label>Address (optional)</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleState}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group my-3">
                <label>Email</label>
                <input
                  placeholder="example@email.com"
                  name="email"
                  value={formData.email}
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
              <button from className='btn-style' type="submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  </div>
  )

  
};

export default CreateProfile;