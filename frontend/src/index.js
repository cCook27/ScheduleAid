import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "react-big-calendar/lib/css/react-big-calendar.css"

const queryClient = new QueryClient();
// const domain = "dev-uhybzq8zwt4f7tgf.us.auth0.com";
// const clientId = "fvh7p3Ch7dDMn2b0dr76IoE0WtWy79st";
// const redirectUri = "https://localhost:3000/home";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
        domain="dev-uhybzq8zwt4f7tgf.us.auth0.com"
        clientId="fvh7p3Ch7dDMn2b0dr76IoE0WtWy79st"
        authorizationParams={{
        redirect_uri: window.location.origin
        }}
    >
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  </Auth0Provider>,
    

);


reportWebVitals();
