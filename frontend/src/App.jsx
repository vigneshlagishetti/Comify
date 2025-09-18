import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from './store/store'

// Components
import Register from './components/auth/Register'
import JobpilotRegister from './components/JobpilotRegister'
import JobpilotComplete from './components/JobpilotComplete'
import JobpilotDashboard from './components/JobpilotDashboard'
import About from './components/About'
import Contact from './components/Contact'
import Services from './components/Services'
import { ClerkSignIn, ClerkSignUp, ClerkProtectedRoute } from './components/auth/ClerkAuth'
import Dashboard from './components/dashboard/Dashboard'
import CompanyProfile from './components/company/CompanyProfile'
import LandingPage from './components/LandingPage'

// Get Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key')
}

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/sign-in" element={<ClerkSignIn />} />
                <Route path="/sign-up" element={<ClerkSignUp />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/register" 
                  element={
                    <ClerkProtectedRoute>
                      <Register />
                    </ClerkProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobpilot-register" 
                  element={
                    <ClerkProtectedRoute>
                      <JobpilotRegister />
                    </ClerkProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobpilot-complete" 
                  element={
                    <ClerkProtectedRoute>
                      <JobpilotComplete />
                    </ClerkProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobpilot-dashboard" 
                  element={
                    <ClerkProtectedRoute>
                      <JobpilotDashboard />
                    </ClerkProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ClerkProtectedRoute>
                      <Dashboard />
                    </ClerkProtectedRoute>
                  } 
                />
                <Route 
                  path="/company-profile" 
                  element={
                    <ClerkProtectedRoute>
                      <CompanyProfile />
                    </ClerkProtectedRoute>
                  } 
                />
                
                {/* Legacy redirects */}
                <Route path="/login" element={<Navigate to="/sign-in" replace />} />
                
                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Router>
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
  )
}

export default App