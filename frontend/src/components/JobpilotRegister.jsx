import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Building2, 
  Users, 
  Globe, 
  Phone, 
  Mail, 
  MapPin,
  Camera,
  Upload,
  Calendar,
  Briefcase,
  Target,
  Award,
  ChevronRight,
  CheckCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Eye,
  EyeOff
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageUpload } from '@/components/ui/file-upload'

// Enhanced schema for Jobpilot-style registration
const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyType: z.string().min(1, 'Company type is required'),
  companySize: z.string().min(1, 'Company size is required'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  logo: z.any().optional(),
  banner: z.any().optional(),
})

const foundingInfoSchema = z.object({
  foundedYear: z.string().min(4, 'Please enter a valid year'),
  founders: z.string().min(1, 'Founders information is required'),
  headquarters: z.string().min(1, 'Headquarters location is required'),
  employeeCount: z.string().min(1, 'Employee count is required'),
  revenue: z.string().optional(),
  funding: z.string().optional(),
})

const socialMediaSchema = z.object({
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
  facebook: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
  instagram: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
  youtube: z.string().url('Please enter a valid YouTube URL').optional().or(z.literal('')),
})

const contactSchema = z.object({
  contactPerson: z.string().min(1, 'Contact person name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
})

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
  'Manufacturing', 'Real Estate', 'Marketing', 'Consulting',
  'Non-profit', 'Government', 'Entertainment', 'Transportation',
  'Energy', 'Agriculture', 'Construction', 'Hospitality', 'Other'
]

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees', 
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
]

const COMPANY_TYPES = [
  'Startup',
  'Private Company',
  'Public Company',
  'Non-profit',
  'Government',
  'Agency',
  'Freelance',
  'Other'
]

export default function JobpilotRegister() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('company-info')
  const [completedTabs, setCompletedTabs] = useState(new Set())
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Forms for each tab
  const companyForm = useForm({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: formData.companyInfo || {}
  })

  const foundingForm = useForm({
    resolver: zodResolver(foundingInfoSchema),
    defaultValues: formData.foundingInfo || {}
  })

  const socialForm = useForm({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: formData.socialMedia || {}
  })

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: formData.contact || {}
  })

  const tabs = [
    {
      id: 'company-info',
      title: 'Company Info',
      icon: Building2,
      description: 'Basic company information',
      form: companyForm,
      schema: companyInfoSchema
    },
    {
      id: 'founding-info',
      title: 'Founding Info',
      icon: Calendar,
      description: 'Company founding details',
      form: foundingForm,
      schema: foundingInfoSchema
    },
    {
      id: 'social-media',
      title: 'Social Media',
      icon: Globe,
      description: 'Social media profiles',
      form: socialForm,
      schema: socialMediaSchema
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: Phone,
      description: 'Contact information',
      form: contactForm,
      schema: contactSchema
    }
  ]

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab)
  const isLastTab = currentTabIndex === tabs.length - 1

  const handleNext = async () => {
    const currentTab = tabs[currentTabIndex]
    const isValid = await currentTab.form.trigger()
    
    if (isValid) {
      const tabData = currentTab.form.getValues()
      setFormData(prev => ({
        ...prev,
        [currentTab.id.replace('-', '')]: tabData
      }))
      
      setCompletedTabs(prev => new Set([...prev, activeTab]))
      
      if (!isLastTab) {
        setActiveTab(tabs[currentTabIndex + 1].id)
      }
    }
  }

  const handleSubmit = async () => {
    const isValid = await contactForm.trigger()
    if (!isValid) return

    setIsSubmitting(true)
    
    try {
      const finalData = {
        ...formData,
        contact: contactForm.getValues()
      }

      // Add automatic VINSA branding
      const combinedData = {
        ...finalData.companyinfo,
        ...finalData.foundinginfo,
        ...finalData.socialmedia,
        ...finalData.contact,
        company_name: finalData.companyinfo?.companyName || `${user?.firstName || 'User'}'s Company`,
        brand_name: 'VINSA',
        user_id: user?.id
      }

      const response = await fetch('http://localhost:5000/api/register-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      })

      if (response.ok) {
        alert('Company registered successfully with VINSA branding!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Company Profile
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Set up your company profile to start posting jobs and connecting with top talent. 
            Complete all sections to maximize your visibility.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const isCompleted = completedTabs.has(tab.id)
              const isPast = tabs.findIndex(t => t.id === activeTab) > index

              return (
                <div key={tab.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isActive 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' 
                          : isCompleted || isPast
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }
                      `}
                    >
                      {isCompleted || isPast ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {tab.title}
                      </p>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        {tab.description}
                      </p>
                    </div>
                  </div>
                  {index < tabs.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4 mt-6">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isPast || isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden" />
            
            {/* Company Info Tab */}
            <TabsContent value="company-info">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Company Information</CardTitle>
                  <CardDescription>
                    Tell us about your company and what makes it special
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...companyForm}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Company Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your company name" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Company Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                                  <SelectValue placeholder="Select company type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COMPANY_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Industry *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                                  <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INDUSTRIES.map((industry) => (
                                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Company Size *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COMPANY_SIZES.map((size) => (
                                  <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={companyForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Website</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://www.yourcompany.com" 
                                  className="h-12 border-2 focus:border-blue-500"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={companyForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Company Description *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your company, its mission, values, and what makes it unique..."
                                  className="min-h-[120px] border-2 focus:border-blue-500 resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                              Company Logo
                            </label>
                            <ImageUpload
                              onImageSelect={(file) => companyForm.setValue('logo', file)}
                              className="h-32"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                              Company Banner
                            </label>
                            <ImageUpload
                              onImageSelect={(file) => companyForm.setValue('banner', file)}
                              className="h-32"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Founding Info Tab */}
            <TabsContent value="founding-info">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Founding Information</CardTitle>
                  <CardDescription>
                    Share your company's history and founding story
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...foundingForm}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={foundingForm.control}
                        name="foundedYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Founded Year *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="2020" 
                                type="number"
                                min="1800"
                                max={new Date().getFullYear()}
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={foundingForm.control}
                        name="employeeCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Current Employee Count *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="25" 
                                type="number"
                                min="1"
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={foundingForm.control}
                          name="founders"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Founders *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about the founders and their background..."
                                  className="min-h-[100px] border-2 focus:border-blue-500 resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={foundingForm.control}
                        name="headquarters"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Headquarters *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="San Francisco, CA" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={foundingForm.control}
                        name="revenue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Annual Revenue (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="$1M - $10M" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={foundingForm.control}
                          name="funding"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Funding Information (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Details about funding rounds, investors, etc..."
                                  className="min-h-[100px] border-2 focus:border-blue-500 resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social-media">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Social Media Profiles</CardTitle>
                  <CardDescription>
                    Connect your social media accounts to boost your company's online presence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...socialForm}>
                    <div className="space-y-4">
                      {[
                        { name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
                        { name: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/yourcompany' },
                        { name: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourcompany' },
                        { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourcompany' },
                        { name: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/c/yourcompany' },
                      ].map((social) => (
                        <FormField
                          key={social.name}
                          control={socialForm.control}
                          name={social.name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">{social.label}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={social.placeholder}
                                  className="h-12 border-2 focus:border-blue-500"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                  <CardDescription>
                    Provide contact details for your company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...contactForm}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={contactForm.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Contact Person *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="contact@yourcompany.com" 
                                type="email"
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Phone Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+1 (555) 123-4567" 
                                type="tel"
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Country *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="United States" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={contactForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Street Address *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="123 Business Street" 
                                  className="h-12 border-2 focus:border-blue-500"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={contactForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">City *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="San Francisco" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">State/Province *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="California" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">ZIP/Postal Code *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="94105" 
                                className="h-12 border-2 focus:border-blue-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentTabIndex > 0) {
                  setActiveTab(tabs[currentTabIndex - 1].id)
                }
              }}
              disabled={currentTabIndex === 0}
              className="h-12 px-8 border-2 hover:bg-gray-50"
            >
              Previous
            </Button>
            
            {isLastTab ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}