import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const TestLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        toast.error(result.error || 'Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',
    padding: '1rem',
    boxSizing: 'border-box',
    margin: '0',
    position: 'fixed',
    top: '0',
    left: '0'
  }

  const formContainerStyle = {
    maxWidth: '400px',
    width: '100%',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    margin: '1rem'
  }

  const logoStyle = {
    width: '48px',
    height: '48px',
    backgroundColor: '#4f46e5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 auto 1rem'
  }

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#1f2937'
  }

  const subtitleStyle = {
    fontSize: '14px',
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '2rem'
  }

  const inputGroupStyle = {
    marginBottom: '1rem'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  }

  const inputContainerStyle = {
    position: 'relative'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box'
  }

  const iconStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '20px',
    height: '20px'
  }

  const eyeIconStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    cursor: 'pointer',
    width: '20px',
    height: '20px',
    background: 'none',
    border: 'none',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none'
  }

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: loading ? '#9ca3af' : '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s',
    marginTop: '1.5rem'
  }

  const credentialsBoxStyle = {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  }

  const credentialsTitleStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  }

  const credentialsTextStyle = {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0.25rem 0'
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={logoStyle}>
          QR
        </div>
        <h2 style={titleStyle}>Faculty Login</h2>
        <p style={subtitleStyle}>
          Sign in to your QR Attendance account
        </p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email Address
            </label>
            <div style={inputContainerStyle}>
              <Mail style={iconStyle} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={inputStyle}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <div style={inputContainerStyle}>
              <Lock style={iconStyle} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                style={{...inputStyle, paddingRight: '3rem'}}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button
                type="button"
                style={eyeIconStyle}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#4338ca'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#4f46e5'
            }}
          >
            {loading ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              'Sign In'
            )}
          </button>

          <div style={credentialsBoxStyle}>
            <p style={credentialsTitleStyle}>Demo Credentials:</p>
            <p style={credentialsTextStyle}>Email: faculty@university.edu</p>
            <p style={credentialsTextStyle}>Password: password123</p>
          </div>
        </form>

        <style>
          {`
            /* Remove default browser margins and padding */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              height: 100vh;
              width: 100vw;
              overflow: hidden;
            }
            
            #root {
              margin: 0 !important;
              padding: 0 !important;
              height: 100vh;
              width: 100vw;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* Ensure eye icon button behaves properly */
            button:focus {
              outline: none;
            }
            
            button[type="button"]:hover {
              background: none !important;
            }
          `}
        </style>
      </div>
    </div>
  )
}

export default TestLogin