# 🔥 Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `qr-attendance-system`
4. Enable Google Analytics (optional)
5. Wait for project creation

## Step 2: Enable Authentication

1. In Firebase console, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

## Step 3: Create Web App

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register app name: `qr-attendance-frontend`
5. Copy the Firebase config object

## Step 4: Update Environment Variables

1. Copy `.env.example` to `.env`
2. Replace the values in `.env` with your Firebase config:

```
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 5: Setup Firestore Database (Optional)

1. Go to **Firestore Database** → **Create database**
2. Start in **test mode** (for development)
3. Choose location (closest to your users)

## Step 6: Create Test User

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Email: `faculty@university.edu`
4. Password: `password123`

## Step 7: Test the Application

1. Restart your development server: `npm run dev`
2. Go to `http://localhost:5173`
3. Try logging in with the test credentials
4. Check browser console for any Firebase errors

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use Firebase security rules in production
- Enable App Check for additional security
- Set up proper user roles and permissions

## 📁 Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── firebase.js          # Firebase initialization
│   ├── services/
│   │   └── authService.js       # Authentication functions
│   ├── context/
│   │   └── AuthContext.jsx      # React auth context
│   └── ...
├── .env                         # Environment variables (not in git)
├── .env.example                 # Template for environment variables
└── ...
```