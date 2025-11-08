import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_firebase_api_key' &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

if (!isFirebaseConfigured && process.env.NODE_ENV === 'development') {
  console.warn('Firebase is not fully configured. Phone OTP login will not work.');
}

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a mock auth object to prevent crashes
  auth = null;
}

// Initialize Firebase Authentication and get a reference to the service
export { auth };

// Helper function to initialize reCAPTCHA verifier
export const initializeRecaptcha = (containerId, size = 'normal') => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }
  
  // Use visible reCAPTCHA for better reliability
  return new RecaptchaVerifier(auth, containerId, {
    size: size, // 'normal' or 'invisible'
    callback: (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber
      console.log('reCAPTCHA solved:', response);
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
      // Optionally reload the page or reset
    }
  });
};

export default app;

