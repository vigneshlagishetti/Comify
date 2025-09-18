import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Calendar,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'

import { ClerkUserButton } from '@/components/auth/ClerkAuth'
import { db } from '@/lib/supabase'

const Dashboard = () => {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()
  const [dbUser, setDbUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
    }
  }, [isLoaded, user])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)

      // Get user from our database
      const { data: userData, error: userError } = await db.users.getByClerkId(user.id)
      
      if (userError) {
        console.error('Error fetching user:', userError)
        // If user doesn't exist in our DB, redirect to registration
        if (userError.details?.includes('No rows')) {
          toast.info('Please complete your company registration')
          navigate('/register')
          return
        }
      } else {
        setDbUser(userData)

        // Get company profile
        const { data: companyData, error: companyError } = await db.companies.getByOwnerId(userData.id)
        
        if (companyError) {
          if (companyError.details?.includes('No rows')) {
            toast.info('Please complete your company registration')
            navigate('/register')
            return
          } else {
            console.error('Error fetching company:', companyError)
          }
        } else {
          setCompany(companyData)
        }
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const getVerificationStatusConfig = (status) => {
    switch (status) {
      case 'verified':
        return {
          label: 'Verified',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          description: 'Your company has been successfully verified'
        }
      case 'pending':
        return {
          label: 'Pending Verification',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          description: 'Verification is in progress. This usually takes 1-2 business days.'
        }
      case 'rejected':
        return {
          label: 'Verification Failed',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          description: 'Please review and update your company information'
        }
      default:
        return {
          label: 'Unknown Status',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          description: 'Please contact support for assistance'
        }
    }
  }

  const formatCompanyType = (type) => {
    const typeMap = {
      'private_limited': 'Private Limited Company',
      'public_limited': 'Public Limited Company',
      'partnership': 'Partnership',
      'sole_proprietorship': 'Sole Proprietorship',
      'llp': 'Limited Liability Partnership'
    }
    return typeMap[type] || type
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    navigate('/sign-in')
    return null
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Complete Your Registration</CardTitle>
            <CardDescription>
              Please complete your company registration to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/register')} 
              className="w-full"
            >
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const verificationStatus = getVerificationStatusConfig(company.verification_status)
  const StatusIcon = verificationStatus.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Comify</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <ClerkUserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Company Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your company profile and track verification status
          </p>
        </div>

        {/* Verification Status Alert */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIcon className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">Company Verification Status</CardTitle>
                  <CardDescription>{verificationStatus.description}</CardDescription>
                </div>
              </div>
              <Badge className={verificationStatus.color}>
                {verificationStatus.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Company Information</span>
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/company-profile')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Company Name</h3>
                    <p className="text-lg font-semibold text-gray-900">{company.company_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Company Type</h3>
                    <p className="text-gray-900">{formatCompanyType(company.company_type)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Industry</h3>
                    <p className="text-gray-900">{company.industry}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Employee Count</h3>
                    <p className="text-gray-900">{company.employee_count} employees</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Company Address</h3>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-900">{company.address}</p>
                      <p className="text-gray-600">
                        {company.city}, {company.state} - {company.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {company.website && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Website</h3>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Company Description</h3>
                  <p className="text-gray-900 leading-relaxed">{company.company_description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Owner Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                  <p className="text-gray-900">{dbUser?.full_name || 'Not provided'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{dbUser?.email}</p>
                </div>
                {dbUser?.mobile_no && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{dbUser.mobile_no}</p>
                  </div>
                )}
                {dbUser?.gender && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Gender</h3>
                    <p className="text-gray-900 capitalize">{dbUser.gender}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Registration Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Registration Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Registered On</h3>
                  <p className="text-gray-900">
                    {new Date(company.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                  <p className="text-gray-900">
                    {new Date(company.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/company-profile')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Company Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled
                >
                  <Building className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard