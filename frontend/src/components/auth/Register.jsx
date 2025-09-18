import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft, ArrowRight, Building, MapPin, Users, FileText } from 'lucide-react'

import { db } from '@/lib/supabase'

// Validation schemas for each step
const step1Schema = z.object({
  mobile_no: z.string().min(10, 'Mobile number must be at least 10 digits'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender'
  })
})

const step2Schema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  company_type: z.enum(['private_limited', 'public_limited', 'partnership', 'sole_proprietorship', 'llp'], {
    required_error: 'Please select company type'
  }),
  industry: z.string().min(2, 'Please specify your industry'),
  employee_count: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    required_error: 'Please select employee count'
  })
})

const step3Schema = z.object({
  address: z.string().min(10, 'Please provide a detailed address'),
  city: z.string().min(2, 'City name is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  company_description: z.string().min(50, 'Description must be at least 50 characters'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal(''))
})

const steps = [
  { id: 1, title: 'Personal Info', subtitle: 'Basic personal details', icon: Users, schema: step1Schema },
  { id: 2, title: 'Company Details', subtitle: 'Business information', icon: Building, schema: step2Schema },
  { id: 3, title: 'Address & Profile', subtitle: 'Location and description', icon: MapPin, schema: step3Schema }
]

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

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  // Store form data across steps
  const [formData, setFormData] = useState({
    mobile_no: '',
    gender: '',
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
  })

  const form = useForm({
    resolver: zodResolver(
      currentStep === 1 ? step1Schema :
      currentStep === 2 ? step2Schema : 
      step3Schema
    ),
    defaultValues: formData
  })

  // Update form values when formData changes
  useEffect(() => {
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        form.setValue(key, formData[key])
      }
    })
  }, [formData, form])

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      toast.error('Please sign in to continue with company registration')
      navigate('/sign-in')
      return
    }

    // Check if user already has a company profile
    checkExistingProfile()
  }, [user, isLoaded, navigate])

  const checkExistingProfile = async () => {
    if (!user) return

    try {
      const { data: company, error } = await db.companies.getByOwnerClerkId(user.id)
      
      if (company && !error) {
        toast.info('You already have a company profile')
        navigate('/dashboard')
        return
      }
    } catch (error) {
      console.error('Error checking existing profile:', error)
    }
  }

  const validateCurrentStep = async () => {
    const currentSchema = steps.find(s => s.id === currentStep)?.schema
    if (!currentSchema) return false

    try {
      const formData = form.getValues()
      await currentSchema.parseAsync(formData)
      return true
    } catch (error) {
      console.error('Validation error:', error)
      return false
    }
  }

  const handleNext = async () => {
    const isValid = await form.trigger()
    
    if (isValid && currentStep < 3) {
      // Save current form data before moving to next step
      const currentValues = form.getValues()
      setFormData(prev => ({ ...prev, ...currentValues }))
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Save current form data before moving to previous step
      const currentValues = form.getValues()
      setFormData(prev => ({ ...prev, ...currentValues }))
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Authentication required')
      return
    }

    // Combine current form data with stored data
    const currentValues = form.getValues()
    const combinedData = { ...formData, ...currentValues }

    console.log('=== FORM SUBMISSION DEBUG ===')
    console.log('Current form data:', currentValues)
    console.log('Stored form data:', formData)
    console.log('Combined form data:', combinedData)
    console.log('Company type value:', combinedData.company_type)
    console.log('Company type type:', typeof combinedData.company_type)
    console.log('All form values:', Object.keys(combinedData).map(key => ({ key, value: combinedData[key], type: typeof combinedData[key] })))

    // Validate required fields before proceeding
    const requiredFields = ['company_name', 'company_type', 'industry', 'employee_count', 'address', 'city', 'state', 'pincode', 'company_description']
    const missingFields = requiredFields.filter(field => !combinedData[field] || combinedData[field].trim() === '')
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      // First, get or create user in our database
      console.log('Attempting to get user with Clerk ID:', user.id)
      let { data: dbUser, error: userError } = await db.users.getByClerkId(user.id)
      
      console.log('User lookup result:', { dbUser, userError })
      
      if (userError || !dbUser) {
        // Create user if doesn't exist or there was an error
        console.log('Creating new user in database')
        const userData = {
          clerk_id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          mobile_no: combinedData.mobile_no,
          gender: combinedData.gender,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('User data to create:', userData)

        const { data: newUser, error: createUserError } = await db.users.create(userData)
        
        if (createUserError) {
          console.error('Error creating user:', createUserError)
          throw new Error(`Failed to create user profile: ${createUserError.message}`)
        }
        
        console.log('User created successfully:', newUser)
        dbUser = newUser[0]
        
        if (!dbUser || !dbUser.id) {
          console.error('Invalid user object after creation:', dbUser)
          throw new Error('Failed to create user profile - invalid user data returned')
        }
      } else {
        // Update existing user with mobile and gender
        console.log('Updating existing user')
        const updateData = {
          mobile_no: combinedData.mobile_no,
          gender: combinedData.gender,
          updated_at: new Date().toISOString()
        }

        const { error: updateError } = await db.users.updateByClerkId(user.id, updateData)
        
        if (updateError) {
          console.error('Failed to update user profile:', updateError)
        }
      }

      // Final check that we have a valid user
      if (!dbUser || !dbUser.id) {
        console.error('No valid user found for company creation:', dbUser)
        throw new Error('User profile is required for company registration')
      }

      // Create company profile with VINSA branding
      const companyNameWithBranding = `${combinedData.company_name} - made by VINSA`
      
      console.log('Database user for company creation:', dbUser)
      console.log('User ID for company owner:', dbUser?.id)
      
      const companyData = {
        owner_id: dbUser.id,
        company_name: companyNameWithBranding,
        company_type: combinedData.company_type,
        industry: combinedData.industry,
        employee_count: combinedData.employee_count,
        address: combinedData.address,
        city: combinedData.city,
        state: combinedData.state,
        pincode: combinedData.pincode,
        company_description: combinedData.company_description,
        website: combinedData.website || null,
        verification_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Company data to create:', companyData)

      const { data: createdCompany, error: companyError } = await db.companies.create(companyData)

      console.log('Company creation result:', { createdCompany, companyError })

      if (companyError) {
        console.error('Company creation error details:', companyError)
        throw new Error(`Failed to create company profile: ${companyError.message || companyError}`)
      }

      toast.success('Company registration completed successfully!')
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const progress = (currentStep / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-4">
            <Building className="w-4 h-4" />
            Company Registration
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Let's Setup Your Company Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your company information in just 3 simple steps to get started with your business profile
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Setup Progress</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</span>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
          </div>
          <Progress value={progress} className="w-full h-2 mb-6" />
          
          {/* Step Navigation Tabs */}
          <div className="grid grid-cols-3 gap-4">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div 
                  key={step.id} 
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${isActive ? 'border-blue-500 bg-blue-50' : 
                      isCompleted ? 'border-green-500 bg-green-50' : 
                      'border-gray-200 bg-gray-50 hover:bg-gray-100'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isActive ? 'bg-blue-500 text-white' : 
                        isCompleted ? 'bg-green-500 text-white' : 
                        'bg-gray-300 text-gray-600'}
                    `}>
                      {isCompleted ? (
                        <Badge className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${
                        isActive ? 'text-blue-700' : 
                        isCompleted ? 'text-green-700' : 
                        'text-gray-600'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {React.createElement(steps[currentStep - 1].icon, { 
                  className: "w-6 h-6 text-blue-600" 
                })}
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {steps[currentStep - 1].title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    {currentStep === 1 && "Let's start with your personal information"}
                    {currentStep === 2 && "Tell us about your company and business details"}
                    {currentStep === 3 && "Final step - address and company description"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border">
                <span className="text-sm font-medium text-gray-600">Step</span>
                <span className="text-sm font-bold text-blue-600">{currentStep}</span>
                <span className="text-sm text-gray-400">of</span>
                <span className="text-sm font-medium text-gray-600">3</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Email</Label>
                        <Input 
                          value={user?.emailAddresses[0]?.emailAddress || ''} 
                          disabled 
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="mobile_no"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your mobile number" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              value={field.value || ''} 
                              onValueChange={field.onChange}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">Male</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Female</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other">Other</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Company Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                )}

                {/* Step 3: Address & Description */}
                {currentStep === 3 && (
                  <div className="space-y-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 min-w-[180px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Progress Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Pending</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            🔒 Secure registration powered by Clerk Authentication
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register