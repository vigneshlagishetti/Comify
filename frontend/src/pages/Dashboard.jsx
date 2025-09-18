import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { LogOut, Building, User, Settings, Upload } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { auth, db } from '@/lib/supabase'
import { logout } from '@/store/authSlice'
import { setProfile, clearProfile } from '@/store/companySlice'
import CompanyRegistrationForm from '@/components/CompanyRegistrationForm'
import CompanyProfile from '@/components/CompanyProfile'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { profile } = useSelector((state) => state.company)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    checkCompanyProfile()
  }, [user, navigate])

  const checkCompanyProfile = async () => {
    try {
      const { data, error } = await db.companies.getByOwnerId(user.id)
      
      if (data && !error) {
        setHasCompanyProfile(true)
        dispatch(setProfile(data))
      } else {
        setHasCompanyProfile(false)
      }
    } catch (error) {
      console.error('Error checking company profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      dispatch(logout())
      dispatch(clearProfile())
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleCompanyRegistered = (companyData) => {
    setHasCompanyProfile(true)
    dispatch(setProfile(companyData))
    setActiveTab('profile')
    toast.success('Company registered successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">HireNext</h1>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Company Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!hasCompanyProfile && (
                  <Button
                    variant={activeTab === 'register' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('register')}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Register Company
                  </Button>
                )}
                
                {hasCompanyProfile && (
                  <>
                    <Button
                      variant={activeTab === 'profile' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    
                    <Button
                      variant={activeTab === 'settings' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!hasCompanyProfile && (
              <div className="text-center py-12">
                <Building className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Welcome to HireNext!</h2>
                <p className="text-muted-foreground mb-6">
                  Complete your company registration to access all features
                </p>
                <Button onClick={() => setActiveTab('register')}>
                  Register Your Company
                </Button>
              </div>
            )}

            {activeTab === 'register' && !hasCompanyProfile && (
              <CompanyRegistrationForm onSuccess={handleCompanyRegistered} />
            )}

            {activeTab === 'profile' && hasCompanyProfile && (
              <CompanyProfile />
            )}

            {activeTab === 'settings' && hasCompanyProfile && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Settings and profile management coming soon...
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard