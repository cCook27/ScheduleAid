import React from "react";

const LoginButton = () => {
  const login = async () => {
    const domain = "dev-uhybzq8zwt4f7tgf.us.auth0.com";
    const audience = "https://www.home2home-api.com";
    const scope = 'read:authorized';
    const clientId = "fvh7p3Ch7dDMn2b0dr76IoE0WtWy79st";
    const responseType = "code";
    const redirectUri = "https://localhost:3000/home";

    // Apply the rest as query params
    const response = fetch(
      `https://${domain}/authorize?` + 
      `audience=${audience}` +
      `scope=${scope}` +
      `clientId=${clientId}` +
      `responseType=${responseType}` +
      `redirectUri=${redirectUri}`, {
        redirect: "manual"
      }
    );
    
    // Manually changing the window once we get a response
    // It will have the code we need in the home url once redirected
    window.location.replace(response.url);
  };

  return (
    <button className="btn btn-primary" onClick={() => login()}>Login</button>
  )
};

export default LoginButton;