import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Read config from environment. Vite injects import.meta.env.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Simple validator: ensure key fields are present and look valid
function isConfigValid(cfg: Record<string, unknown>) {
  return typeof cfg.apiKey === 'string' && cfg.apiKey.length > 0 && typeof cfg.projectId === 'string' && cfg.projectId.length > 0 && typeof cfg.appId === 'string' && cfg.appId.length > 0;
}

let firebaseEnabled = false;
let app: ReturnType<typeof initializeApp> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isConfigValid(firebaseConfig)) {
  try {
    // initializeApp expects a typed config; use unknown cast to avoid `any`
    app = initializeApp(firebaseConfig as unknown as Record<string, string>);
    dbInstance = getFirestore(app);
    authInstance = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    firebaseEnabled = true;
  } catch (err) {
    // initialization failed (invalid key or other); mark disabled and log for developer
    console.error('Firebase initialization failed:', err);
    firebaseEnabled = false;
  }
} else {
  console.warn('Firebase config missing or incomplete. Firebase features are disabled.');
}

// Export either real instances or safe fallbacks
export { firebaseEnabled };
export const db = dbInstance;
export const auth = authInstance;
export const googleAuthProvider = googleProvider;

export const signInWithGoogle = async () => {
  if (!firebaseEnabled || !authInstance || !googleProvider) {
    return Promise.reject(new Error('Firebase is not configured. Sign-in is disabled.'));
  }
  return signInWithPopup(authInstance, googleProvider);
};

export const signOutCurrentUser = async () => {
  if (!firebaseEnabled || !authInstance) {
    return Promise.resolve();
  }
  return signOut(authInstance);
};
