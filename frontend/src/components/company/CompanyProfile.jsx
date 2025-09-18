import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { 
  Building, 
  ArrowLeft, 
  Save,
  Loader2
} from 'lucide-react'

import { ClerkUserButton } from '@/components/auth/ClerkAuth'
import { db } from '@/lib/supabase'

const companySchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  company_type: z.enum(['private_limited', 'public_limited', 'partnership', 'sole_proprietorship', 'llp'], {
    required_error: 'Please select company type'
  }),
  industry: z.string().min(2, 'Please specify your industry'),
  employee_count: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    required_error: 'Please select employee count'
  }),
  address: z.string().min(10, 'Please provide a detailed address'),
  city: z.string().min(2, 'City name is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  company_description: z.string().min(50, 'Description must be at least 50 characters'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal(''))
})

const companyTypes = [
  { value: 'private_limited', label: 'Private Limited Company' },
  { value: 'public_limited', label: 'Public Limited Company' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'llp', label: 'Limited Liability Partnership' }
]

const employeeCounts = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' }
]

const CompanyProfile = () => {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [company, setCompany] = useState(null)

  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_name: '',
      company_type: '',
      industry: '',
      employee_count: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      company_description: '',
      website: ''
    }
  })

  useEffect(() => {
    if (isLoaded && user) {
      fetchCompanyData()
    }
  }, [isLoaded, user])

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true)

      // Get user from our database
      const { data: userData, error: userError } = await db.users.getByClerkId(user.id)
      
      if (userError) {
        console.error('Error fetching user:', userError)
        toast.error('Failed to load user data')
        navigate('/dashboard')
        return
      }

      // Get company profile
      const { data: companyData, error: companyError } = await db.companies.getByOwnerId(userData.id)
      
      if (companyError) {
        console.error('Error fetching company:', companyError)
        toast.error('Failed to load company data')
        navigate('/dashboard')
        return
      }

      setCompany(companyData)
      
      // Populate form with existing data
      form.reset({
        company_name: companyData.company_name || '',
        company_type: companyData.company_type || '',
        industry: companyData.industry || '',
        employee_count: companyData.employee_count || '',
        address: companyData.address || '',
        city: companyData.city || '',
        state: companyData.state || '',
        pincode: companyData.pincode || '',
        company_description: companyData.company_description || '',
        website: companyData.website || ''
      })

    } catch (error) {
      console.error('Error in fetchCompanyData:', error)
      toast.error('Failed to load company profile')
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    if (!company) return

    setIsSaving(true)

    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      }

      const { error } = await db.companies.update(company.id, updateData)

      if (error) {
        throw new Error('Failed to update company profile')
      }

      toast.success('Company profile updated successfully!')
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error.message || 'Failed to update company profile')
    } finally {
      setIsSaving(false)
    }
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
            <CardTitle>Company Not Found</CardTitle>
            <CardDescription>
              Unable to load company profile. Please return to dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Edit Company Profile</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <ClerkUserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details. Changes will be reflected on your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Company Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companyTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employee_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Employees *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employee count" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employeeCounts.map((count) => (
                                <SelectItem key={count.value} value={count.value}>
                                  {count.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Technology, Manufacturing, Healthcare" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Address Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Address *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your complete company address"
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode *</FormLabel>
                          <FormControl>
                            <Input placeholder="000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourcompany.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your company, its services, and mission (minimum 50 characters)"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompanyProfile