import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "react-big-calendar/lib/css/react-big-calendar.css"

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
        domain="dev-inretjsuzauvwd5e.us.auth0.com"
        clientId="FcB7YlOin80xMUjUExsyRoOfdO4syMk6"
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
