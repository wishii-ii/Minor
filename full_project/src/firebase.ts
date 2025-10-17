import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

// --- Firebase Config (from Vite env vars) ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// --- Validation Helper ---
function isConfigValid(cfg: Record<string, unknown>) {
  return (
    typeof cfg.apiKey === 'string' &&
    cfg.apiKey.length > 0 &&
    typeof cfg.projectId === 'string' &&
    cfg.projectId.length > 0 &&
    typeof cfg.appId === 'string' &&
    cfg.appId.length > 0
  );
}

// --- Initialize Firebase Safely ---
let firebaseEnabled = false;
let app: FirebaseApp | null = null;
let db: Firestore;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

try {
  if (!getApps().length && isConfigValid(firebaseConfig)) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app!);
  auth = getAuth(app!);
  googleProvider = new GoogleAuthProvider();
  firebaseEnabled = true;
} catch (err) {
  console.error('⚠️ Firebase initialization failed:', err);
  firebaseEnabled = false;
  // fallback dummy objects so imports won't break other files
  db = {} as Firestore;
  auth = {} as Auth;
  googleProvider = new GoogleAuthProvider();
}

// --- Auth helpers ---
export const signInWithGoogle = async () => {
  if (!firebaseEnabled) {
    throw new Error('Firebase not configured. Sign-in disabled.');
  }
  return signInWithPopup(auth, googleProvider);
};

export const signOutCurrentUser = async () => {
  if (!firebaseEnabled) return;
  await signOut(auth);
};

// --- Exports ---
export { firebaseEnabled, db, auth, googleProvider, app };
