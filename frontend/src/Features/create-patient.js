import React, { useEffect } from 'react';
import '../css/create-patient.css'
import { useState, useContext } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { v4 as uuidv4 } from 'uuid';

import useHomeRequests from '../hooks/home-requests';
import {UserContext, AccessTokenContext} from '../context/context';
import { geocodeByAddress } from 'react-places-autocomplete';

function CreatePatient() {
  const {addNewHome} = useHomeRequests();
  const user = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

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
      noSeeDays: {sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false},
      active: true,
      frequency: null
    }
  );

  const handleInputChange = (event) => {
    const {name, value} = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddMore = () => {
    setAddMore(!addMore);
  };


  

  return (
    <div className="page-cont">
      <div className="row">
        <div className="col d-flex justify-content-center flex-column">
          <h4 className='sched-title'>Create a New Patient</h4>
        </div>
      </div>
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
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(event) => handleInputChange(event)}
                  />
                </div>
                <div className="npat-cont">
                  <label className='nPat-label my-2'>Address</label>
                  <input
                    className="form-control npat-input"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={(event) => handleInputChange(event)}
                  />
                </div>
              </div>
              <div className="col-6 d-flex justify-content-center flex-column">
                <div className="npat-cont">
                  <label className='nPat-label my-2'>Primary Number</label>
                  <input
                    type="number"
                    className="form-control npat-input"
                    id="primaryNumber"
                    name="primaryNumber"
                    value={formData.primaryNumber}
                    onChange={(event) => handleInputChange(event)}
                  />
                </div>
                <div className="npat-cont">
                  <label className='nPat-label my-2'>Secondary Number</label>
                  <input
                    type="number"
                    className="form-control npat-input"
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
          <button className="add-more" onClick={handleAddMore}>Add More Patient Info...</button>
        </div>
      </div>
      <div className={`${addMore ? 'row' : 'd-none'}`}>
        <div className="col-6">
          <div className="npat-cont">
            <div>More Stuff</div>
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default CreatePatient;


 


// function CreatePatient() {
//   const {addNewHome} = useHomeRequests();
//   const user = useContext(UserContext);
//   const accessToken = useContext(AccessTokenContext);
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     number: "",
//     email: "",
//     prefContact: "",
//     notes: "",
//     _id: "",
//     prefDays: {
//       sunday: false,
//       monday: false,
//       tuesday: false,
//       wednesday: false,
//       thursday: false,
//       friday: false,
//       saturday: false
//     },
//     active: true,
//     frequency: null
//   });

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       _id: uuidv4(),
//     }));
//   }, [])

//   const handleSelect = (value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       address: value,
//     }));
//   };

//   const handleAddressChange = (value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       address: value,
//     }));
//   };

//   const handleState = (event) => {
//     const {name, value} = event.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value
//     }));
//   };

//   const handleCheckboxChange = (event) => {
//     const { id, checked } = event.target;
  
//     setFormData((prevData) => ({
//       ...prevData,
//       prefDays: {
//         ...prevData.prefDays,
//         [id]: checked,
//       },
//     }));
//   };
  

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     addNewHome(formData, user._id, accessToken);

//     window.location.reload();
//   };
  

//   return (
//     <div className='Container'>
//       <Form onSubmit={handleSubmit} className="form">
//         <div className="row ps-2 mb-3">
//           <div className="col-12">

//             <div className="form-group my-3">
//               <label>Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleState}
//                 className="form-control"
//               />
//             </div>

//             <div className="form-group my-3">
//               <label>Address</label>
//               <PlacesAutocomplete
//                 value={formData.address}
//                 onChange={handleAddressChange}
//                 onSelect={handleSelect}
//               >

//                 {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//                   <div >
//                     <input
//                       {...getInputProps({
//                         placeholder: 'Search Address ...',
//                         className: 'location-search-input form-control',
//                       })}
//                     />
//                     <div className="autocomplete-dropdown-container">
//                       {loading && <div>Loading...</div>}
//                       {suggestions.map(suggestion => {
//                         const className = suggestion.active
//                           ? 'suggestion-item--active'
//                           : 'suggestion-item';
//                         const style = suggestion.active
//                           ? { backgroundColor: '#fafafa', cursor: 'pointer' }
//                           : { backgroundColor: '#ffffff', cursor: 'pointer' };
//                         return (
//                           <div
//                             key={suggestion.description}
//                             {...getSuggestionItemProps(suggestion, {
//                               className,
//                               style,
//                             })}
//                           >
//                             <span>{suggestion.description}</span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </PlacesAutocomplete> 
//             </div>

//             <div className="form-group my-3">
//               <label>Number</label>
//               <input
//                 placeholder="800-123-4567"
//                 name="number"
//                 type='text'
//                 value={formData.number}
//                 onChange={handleState}
//                 className="form-control"
//               />
//             </div>

//             <div className="form-group my-3">
//               <label>Email</label>
//               <input
//                 placeholder="patient@example.com"
//                 name="email"
//                 type='text'
//                 value={formData.email}
//                 onChange={handleState}
//                 className="form-control"
//               />
//             </div>

//             <div className="form-group my-3">
//               <label>Preferred Contact Method</label>
//               <input
//                 placeholder="Cell"
//                 name="prefContact"
//                 type='text'
//                 value={formData.prefContact}
//                 onChange={handleState}
//                 className="form-control"
//               />
//             </div>

//             <div className="form-group my-3">
//               <label>Patient Can Be Seen On:</label>
//               <br />
//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="sunday"
//                   onChange={handleCheckboxChange}
//                 />
//                 <label className="form-check-label" htmlFor="sunday">
//                   Sunday
//                 </label>
//               </div>

//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="monday"
//                   onChange={handleCheckboxChange}
//                 />
//                 <label className="form-check-label" htmlFor="monday">
//                   Monday
//                 </label>
//               </div>

//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="tuesday"
//                   onChange={handleCheckboxChange}
//                 />
//                 <label className="form-check-label" htmlFor="tuesday">
//                   Tuesday
//                 </label>
//               </div>

//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="wednesday"
//                   onChange={handleCheckboxChange}
//                 />
//                 <label className="form-check-label" htmlFor="wednesday">
//                   Wednesday
//                 </label>
//               </div>

//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="thursday"
//                   onChange={handleCheckboxChange}
//                 />
//                 <label className="form-check-label" htmlFor="thursday">
//                   Thursday
//                 </label>
//               </div>

//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="friday"
//                   onChange={handleCheckboxChange}
//                 />
//                 <label className="form-check-label" htmlFor="friday">
//                   Friday
//                 </label>
//               </div>

//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="saturday"
//                   onChange={handleCheckboxChange}
//                 />
//                 <label className="form-check-label" htmlFor="saturday">
//                   Saturday
//                 </label>
//               </div>
//             </div>

//             <div className="form-group my-3">
//               <label>Active</label>
//               <select 
//                 value={formData.active}
//                 onChange={handleState} 
//                 name="active" 
//                 id="active">
//                 <option value="yes">Yes</option>
//                 <option value="no">No</option>
//               </select>
//             </div>

//             <div className="form-group my-3">
//               <label>Frequency</label>
//               <input
//                 placeholder="2"
//                 name="frequency"
//                 type='text'
//                 value={formData.frequency}
//                 onChange={handleState}
//                 className="form-control"
//               />
//             </div>

//             <div className="form-group my-3">
//               <label>Notes</label>
//               <input
//                 placeholder="Patient can't be seen on Monday."
//                 name="notes"
//                 type='text'
//                 value={formData.notes}
//                 onChange={handleState}
//                 className="form-control"
//               />
//             </div>
//           </div>
//           <div className="row mt-3">
//             <div className="col pe-0">
//               <div className="btn-container">
//                 <button className='btn-style' type="submit">
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Form>
//     </div>
       
//   );
// }

// export default CreatePatient;


 