import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";


const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-uhybzq8zwt4f7tgf.us.auth0.com";
  
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });
  
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const { user_metadata } = await metadataResponse.json();

        setUserMetadata(user_metadata);
        console.log(userMetadata)
      } catch (e) {
        console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);


  const handleState = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    
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

      <div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Profile;


// Once we have logged in the isAuthenticated method will turn from false to true. This will cause the useEffect to run once the Profile is rendered. We will request an access token from the auth0 management api. Once we have the token we will then fetch the user information using this url  const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}` and the access token we have just received. we parse it into json and set it as the userMetaData. the jsx will then render what we have just done as part of the partial re render

// isAuthenticated && (
//   <div>
//     <h1>User Profile</h1>
//     <img src={user.picture} alt={user.name} />
//     <h2>{user.name}</h2>
//     <p>{user.email}</p>
//     <h3>User Metadata</h3>
//     {userMetadata ? (
//       <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
//     ) : (
//       "No user metadata defined"
//     )}

    
//   </div>
// )