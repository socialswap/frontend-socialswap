import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GoogleOAuthWrapper from './Components/GoogleOAuthWrapper';
import { HelmetProvider } from 'react-helmet-async';

import { StyleProvider } from '@ant-design/cssinjs';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <StyleProvider layer>
      <HelmetProvider>
        <GoogleOAuthWrapper>
          <App />
        </GoogleOAuthWrapper>
      </HelmetProvider>
    </StyleProvider>
  </React.StrictMode>
);

reportWebVitals();
