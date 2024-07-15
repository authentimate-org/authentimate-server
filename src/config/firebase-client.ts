import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default firebaseApp;
