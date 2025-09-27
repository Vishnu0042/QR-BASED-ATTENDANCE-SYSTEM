import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

// Sign in with email and password
export const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Get additional user data from Firestore
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || userData.name,
          role: userData.role || 'faculty',
          ...userData
        }
      }
    } else {
      // If no user document exists, create one
      const defaultUserData = {
        name: user.displayName || 'Faculty Member',
        email: user.email,
        role: 'faculty',
        createdAt: new Date().toISOString()
      }
      
      await setDoc(userDocRef, defaultUserData)
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: defaultUserData.name,
          role: defaultUserData.role,
          ...defaultUserData
        }
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Create new user account
export const registerWithEmailPassword = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Update user profile
    await updateProfile(user, {
      displayName: userData.name
    })
    
    // Save additional user data to Firestore
    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(userDocRef, {
      name: userData.name,
      email: user.email,
      role: userData.role || 'faculty',
      department: userData.department || '',
      createdAt: new Date().toISOString()
    })
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData.name,
        role: userData.role || 'faculty'
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    default:
      return 'An error occurred. Please try again.'
  }
}