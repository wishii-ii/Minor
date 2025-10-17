Firebase setup (quick steps)

1. Create a Firebase project at https://console.firebase.google.com/
2. In Project Settings -> Your apps, create a new Web app and copy the config values.
3. Enable Authentication -> Sign-in method -> Google (or other providers you want).
4. Create a Firestore database (Start in test mode for development).
5. Copy the config values into a local .env file using .env.example as a template.

Environment variables required (Vite expects VITE_ prefix):
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Run the dev server:
- npm install
- npm run dev
