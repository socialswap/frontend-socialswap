import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GoogleOAuthWrapper from './Components/GoogleOAuthWrapper';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthWrapper>
        <App />
      </GoogleOAuthWrapper>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
