import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "react-big-calendar/lib/css/react-big-calendar.css"


const queryClient = new QueryClient();
const apiKey = process.env.GOOGLE_MAPS_API_KEY

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
        domain="dev-uhybzq8zwt4f7tgf.us.auth0.com"
        clientId="fvh7p3Ch7dDMn2b0dr76IoE0WtWy79st"
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://www.Home2Home-api.com",
            scope: "read:current_user update:current_user_metadata"
          }}
    >
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </Auth0Provider>,


);


reportWebVitals();
