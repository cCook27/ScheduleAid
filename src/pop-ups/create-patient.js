import React, { useEffect } from 'react';
import '../css/create-patient.css'
import { useState, useContext } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { v4 as uuidv4 } from 'uuid';

import usePatientRequests from '../hooks/patient-requests';
import Loading from './loading';

function CreatePatient({userId, accessToken, closeModal}) {
  const {addNewPatient} = usePatientRequests();

  const [addMore, setAddMore] = useState(false);
  const [formData, setFormData] = useState(
    {
      firstName: '',
      lastName: '',
      address: '',
      primaryNumber: '',
      secondaryNumber: '',
      email: '',
      _id: '',
      autoId: '',
      manualId: '',
      noSeeDays: {sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false},
      active: true,
      frequency: 1,
      notes: []
    }
  );
  const [stillFetching, setStillFetching] = useState(false);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      _id: uuidv4(),
      autoId: uuidv4(),
      manualId: uuidv4(),
    }));
  }, []);

  const handleInputChange = (event) => {
    const {name, value} = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddressChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      address: value,
    }));
  };

  const handleAddMore = () => {
    setAddMore(!addMore);
  };

  const handleNoSeeDays = (value) => {
    setFormData((prev) => ({
      ...prev,
      noSeeDays: {
        ...prev.noSeeDays,
        [value]: !prev.noSeeDays[value]
      }
    }));
  };

  const handleActive = () => {
    setFormData((prev) => ({
      ...prev,
      active: !prev.active
    }));
  };

  const handleClose = () => {
    closeModal();
  };

  const handleSave = async () => {
    await addNewPatient(formData, userId, accessToken);
    closeModal();
  };

  if(!stillFetching) {
    return (
      <div className="page-cont">
        <div className="row my-2">
          <div className="col d-flex justify-content-center flex-column">
            <h4 className='sched-title'>Create a New Patient</h4>
          </div>
          <div className="col">
            <div className='d-flex justify-content-end'>
              <button type="button" className="btn-close close-all close-all-custom btn-close-create" aria-label="Close"
              onClick={handleClose}></button>
            </div>
          </div>
        </div>
        <div className="overflow-cont">
          <div className="row">
            <div className="col d-flex justify-content-center flex-column">
              <form className='form-cont'>
                <div className="row">
                  <div className="col-6 d-flex justify-content-center flex-column">
                    <div className="npat-cont">
                      <label className='nPat-label my-2'>First Name</label>
                      <input
                        type="text"
                        className="form-control npat-input"
                        placeholder='e.g. Jane'
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(event) => handleInputChange(event)}
                      />
                    </div>
                    <div className="npat-cont">
                      <label className='nPat-label my-2'>Last Name</label>
                      <input
                        type="text"
                        className="form-control npat-input"
                        placeholder='e.g. Doe'
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(event) => handleInputChange(event)}
                      />
                    </div>
                    <div className="npat-cont">
                      <label className='nPat-label my-2'>Address</label>
                      
                      <PlacesAutocomplete
                        value={formData.address}
                        onChange={handleAddressChange}
                      >
  
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                          <div >
                            <input
                              {...getInputProps({
                                placeholder: 'Search Address ...',
                              })}
                              className={`${suggestions.length > 0 ? 'location-search-input-bot form-control npat-input' : 'location-search-input form-control npat-input'}`}
                            />
                            <div className={`${suggestions.length > 0 ? 'autocomplete-dropdown-container' : 'autocomplete-dropdown-container-none'}`}>
                              {loading && <div>Loading...</div>}
                              {suggestions.map(suggestion => {
                                const className = suggestion.active
                                  ? 'suggestion-item--active'
                                  : 'suggestion-item';
                                const style = suggestion.active
                                  ? { backgroundColor: '#6a9f6d', cursor: 'pointer' }
                                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                  <div
                                    key={suggestion.description}
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style,
                                    })}
                                  >
                                    <span>{suggestion.description}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete> 
  
                    </div>
                  </div>
                  <div className="col-6 d-flex justify-content-center flex-column">
                    <div className="npat-cont">
                      <label className='nPat-label my-2'>Primary Number</label>
                      <input
                        type="tel"
                        className="form-control npat-input"
                        placeholder='e.g. 480-123-456'
                        id="primaryNumber"
                        name="primaryNumber"
                        value={formData.primaryNumber}
                        onChange={(event) => handleInputChange(event)}
                      />
                    </div>
                    <div className="npat-cont">
                      <label className='nPat-label my-2'>Secondary Number</label>
                      <input
                        type="tel"
                        className="form-control npat-input"
                        placeholder='e.g. 928-789-1234'
                        id="secondaryNumber"
                        name="secondaryNumber"
                        value={formData.secondaryNumber}
                        onChange={(event) => handleInputChange(event)}
                      />
                    </div>
                    <div className="npat-cont">
                      <label className='nPat-label my-2'>Email</label>
                      <input
                        className="form-control npat-input"
                        placeholder='e.g. janedoe@example.com'
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(event) => handleInputChange(event)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row py-2">
            <div className="col d-flex justify-content-end">
              <button className={!addMore ? "add-more" : "d-none"} onClick={handleAddMore}>Add More Patient Info...</button>
              <button className={addMore ? "add-more" : "d-none"} onClick={handleAddMore}>Show Less Patient Info...</button>
            </div>
          </div>
          <div className={`pb-3 ${addMore ? 'row' : 'd-none'}`}>
            <div className="col-6">
              <div className="npat-cont ps-2">
                <label className='nPat-label my-2'>Patient CANNOT be Seen On:</label>
                <select className="form-select pat-select npat-input nsd-select" name="noseeDays" id="noSeeDays" 
                onChange={(event) => handleNoSeeDays(event.target.value)}
                >
                  <option disabled selected value="">Select Days</option>
                  <option className={`${formData.noSeeDays.sunday ? 'd-none' : null}`} value="sunday">
                    Sunday
                  </option>
                  <option className={`${formData.noSeeDays.monday ? 'd-none' : null}`} value="monday">
                    Monday
                  </option>
                  <option className={`${formData.noSeeDays.tuesday ? 'd-none' : null}`} value="tuesday">
                    Tuesday
                  </option>
                  <option className={`${formData.noSeeDays.wednesday ? 'd-none' : null}`} value="wednesday">
                    Wednesday
                  </option>
                  <option className={`${formData.noSeeDays.thursday ? 'd-none' : null}`} value="thursday">
                    Thursday
                  </option>
                  <option className={`${formData.noSeeDays.friday ? 'd-none' : null}`} value="friday">
                    Friday
                  </option>
                  <option className={`${formData.noSeeDays.saturday ? 'd-none' : null}`} value="saturday">
                    Saturday
                  </option>
                </select>
                <div className="d-flex row nsd-cont my-2">
                  {Object.entries(formData.noSeeDays).map(([propertyName, propertyValue]) => (
                    propertyValue && (
                      <div className="col-6" key={propertyName}>
                        <span className="badge">{propertyName}
                          <button className='btn-close' onClick={() => handleNoSeeDays(propertyName)}></button>
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="npat-cont">
                <label className='nPat-label my-2'>Frequency</label>
                <input
                  type="number"
                  className="form-control npat-input frequency"
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={(event) => handleInputChange(event)}
                />
              </div>
              <div className="npat-cont my-3">
              <div className="form-check form-switch">
                <input className="form-check-input npat-input" type="checkbox" role="switch" id="active" onChange={handleActive} 
                checked={formData.active} />
                <label className="form-check-label nPat-label" for="active">
                  Active
                </label>
              </div>
              </div>
            </div>      
          </div>
        </div>
        <div className="row my-2 pe-3">
          <div className="col d-flex justify-content-end align-items-center">
            <button disabled={formData.address === '' || formData.firstName === '' || formData.lastName === ''} onClick={handleSave} className="add-btn btn save">Save</button>
          </div>
        </div>
      </div>
    );
  };

  if(stillFetching) {
    return (
      <div className='container'>
        <Loading />
      </div>
    )
  }
  
}

export default CreatePatient;


 
