import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleOAuthWrapper = ({ children }) => {
  // Get the client ID from environment variable
  // In Create React App, env vars must start with REACT_APP_
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  
  // Check if Google OAuth is properly configured
  const isGoogleOAuthEnabled = googleClientId && 
    googleClientId.trim() !== '' && 
    googleClientId !== 'your_google_client_id_here' &&
    googleClientId.includes('googleusercontent.com');

  // Use the actual client ID if valid, otherwise use a placeholder
  // This ensures the provider always wraps the app so hooks can be used
  const clientIdToUse = isGoogleOAuthEnabled ? googleClientId : 'placeholder-client-id';

  // Always wrap with provider to prevent "must be used within provider" errors
  // The Login component will check if Google OAuth is enabled before showing the button
  return (
    <GoogleOAuthProvider clientId={clientIdToUse}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthWrapper;

