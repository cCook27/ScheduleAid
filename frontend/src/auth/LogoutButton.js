import React from "react";

const LogoutButton = () => {
  const logout = async () => {

    const domain = "dev-uhybzq8zwt4f7tgf.us.auth0.com";
    const clientId = "fvh7p3Ch7dDMn2b0dr76IoE0WtWy79st";
    const returnTo = "http://localhost:3000";

    const response = await fetch(
      `https://${domain}/logout?` + 
      `clientId=${clientId}` +
      `returnTo=${returnTo}`, {
        redirect: "manual"
      }
    );

    window.location.replace(response.url);
    
  };
  return (
    <button className="btn btn-primary" onClick={() => logout()}>Log Out</button>
  )
};

export default LogoutButton;