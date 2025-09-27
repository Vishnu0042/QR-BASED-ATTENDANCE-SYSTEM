import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { loginWithEmailPassword, logoutUser } from '../services/authService'
import { getUserById } from '../services/dataService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from your users collection
          // Use email to find the user since Firebase UID might be different
          const userData = await getUserById(firebaseUser.uid)
          
          if (userData.success) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData.data
            })
          } else {
            // Fallback to basic Firebase user data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: 'faculty' // Default role
            })
          }
        } catch (error) {
          console.error('Error loading user data:', error)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: 'faculty'
          })
        }
      } else {
        // User is signed out
        setUser(null)
      }
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await loginWithEmailPassword(email, password)
      
      if (result.success) {
        // User state will be updated automatically by onAuthStateChanged
        // Set additional user data if available
        setUser(prevUser => ({
          ...prevUser,
          ...result.user
        }))
      }
      
      return result
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await logoutUser()
      // User state will be updated automatically by onAuthStateChanged
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider