import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Navbar from './Navbar'
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
  EyeOff,
  Settings,
  User,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Bookmark,
  BarChart3,
  FileText,
  PlusCircle,
  Edit3,
  Trash2
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

// Schemas for each section
const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyType: z.string().min(1, 'Company type is required'),
  companySize: z.string().min(1, 'Company size is required'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  logo: z.any().optional(),
  banner: z.any().optional(),
  establishedDate: z.string().min(1, 'Established date is required'),
  teamSize: z.string().min(1, 'Team size is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
})

const foundingInfoSchema = z.object({
  foundedYear: z.string().min(4, 'Please enter a valid year'),
  founders: z.string().min(1, 'Founders information is required'),
  headquarters: z.string().min(1, 'Headquarters location is required'),
  employeeCount: z.string().min(1, 'Employee count is required'),
  revenue: z.string().optional(),
  funding: z.string().optional(),
  vision: z.string().min(1, 'Company vision is required'),
  mission: z.string().min(1, 'Company mission is required'),
  organizationType: z.string().min(1, 'Organization type is required'),
})

const socialMediaSchema = z.object({
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
  facebook: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
  instagram: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
  youtube: z.string().url('Please enter a valid YouTube URL').optional().or(z.literal('')),
})

const accountSettingSchema = z.object({
  contactPerson: z.string().min(1, 'Contact person name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  mapLocation: z.string().optional(),
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

const ORGANIZATION_TYPES = [
  'Corporation',
  'LLC',
  'Partnership',
  'Sole Proprietorship',
  'Non-profit',
  'Government',
  'Other'
]

const TEAM_SIZES = [
  'Only me',
  '2-5 members',
  '6-10 members',
  '11-20 members',
  '21-50 members',
  '50+ members'
]

const CATEGORIES = [
  'Web Development',
  'Mobile App Development',
  'E-commerce',
  'Digital Marketing',
  'UI/UX Design',
  'Software Development',
  'Consulting',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Technology',
  'Manufacturing',
  'Retail',
  'Other'
]

export default function JobpilotComplete() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('company-info')
  const [completedTabs, setCompletedTabs] = useState(new Set())
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Forms for each tab
  const companyForm = useForm({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: formData.companyInfo || {
      categories: []
    }
  })

  const foundingForm = useForm({
    resolver: zodResolver(foundingInfoSchema),
    defaultValues: formData.foundingInfo || {}
  })

  const socialForm = useForm({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: formData.socialMedia || {}
  })

  const accountForm = useForm({
    resolver: zodResolver(accountSettingSchema),
    defaultValues: formData.accountSetting || {}
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
      title: 'Social Media Profile',
      icon: Globe,
      description: 'Social media profiles',
      form: socialForm,
      schema: socialMediaSchema
    },
    {
      id: 'account-setting',
      title: 'Account Setting',
      icon: Settings,
      description: 'Contact & account information',
      form: accountForm,
      schema: accountSettingSchema
    }
  ]

  const handleTabChange = async (tabId) => {
    const currentTab = tabs.find(t => t.id === activeTab)
    if (currentTab) {
      const isValid = await currentTab.form.trigger()
      if (isValid) {
        const tabData = currentTab.form.getValues()
        setFormData(prev => ({
          ...prev,
          [currentTab.id.replace('-', '')]: tabData
        }))
        setCompletedTabs(prev => new Set([...prev, activeTab]))
      }
    }
    setActiveTab(tabId)
  }

  const handleSubmit = async () => {
    const isValid = await accountForm.trigger()
    if (!isValid) return

    setIsSubmitting(true)
    
    try {
      const finalData = {
        ...formData,
        accountsetting: accountForm.getValues()
      }

      // Add automatic VINSA branding
      const combinedData = {
        ...finalData.companyinfo,
        ...finalData.foundinginfo,
        ...finalData.socialmedia,
        ...finalData.accountsetting,
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
        // Redirect to dashboard after successful registration
        navigate('/jobpilot-dashboard')
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
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="dashboard" />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Jobpilot Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  EMPLOYERS DASHBOARD
                </h3>
              </div>
              <nav className="p-2">
                <div className="space-y-1">
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Overview
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <User className="h-4 w-4 mr-3" />
                    Employers Profile
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <PlusCircle className="h-4 w-4 mr-3" />
                    Post a Job
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <FileText className="h-4 w-4 mr-3" />
                    My Jobs
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <Bookmark className="h-4 w-4 mr-3" />
                    Saved Candidate
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Plans & Billing
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <Users className="h-4 w-4 mr-3" />
                    All Companies
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </a>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Settings Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="border-b border-gray-200">
                  <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      const isCompleted = completedTabs.has(tab.id)
                      const isActive = activeTab === tab.id
                      
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className={`
                            flex items-center gap-2 px-6 py-4 text-sm font-medium rounded-none border-b-2 transition-all
                            ${isActive 
                              ? 'text-blue-600 border-blue-600 bg-blue-50/30' 
                              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                            }
                            ${isCompleted ? 'text-green-600' : ''}
                          `}
                        >
                          <Icon className="h-4 w-4" />
                          {tab.title}
                          {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>

                {/* Company Info Tab */}
                <TabsContent value="company-info" className="p-6 space-y-6">
                  <Form {...companyForm}>
                    <div className="space-y-6">
                      {/* Logo Upload */}
                      <div>
                        <FormLabel className="text-base font-medium text-gray-900">Company Logo</FormLabel>
                        <div className="mt-2">
                          <ImageUpload
                            onImageSelect={(file) => companyForm.setValue('logo', file)}
                            className="h-32"
                          />
                        </div>
                      </div>

                      {/* Banner Upload */}
                      <div>
                        <FormLabel className="text-base font-medium text-gray-900">Company Banner</FormLabel>
                        <div className="mt-2">
                          <ImageUpload
                            onImageSelect={(file) => companyForm.setValue('banner', file)}
                            className="h-40"
                          />
                        </div>
                      </div>

                      {/* Company Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={companyForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Company Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Company name" 
                                  className="mt-1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={companyForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Website</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Website link" 
                                  className="mt-1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={companyForm.control}
                          name="establishedDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Established Date *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date"
                                  className="mt-1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={companyForm.control}
                          name="teamSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Team Size *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select team size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TEAM_SIZES.map((size) => (
                                    <SelectItem key={size} value={size}>{size}</SelectItem>
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
                              <FormLabel className="text-sm font-medium text-gray-700">Industry Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select industry" />
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
                          name="companyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Company Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="mt-1">
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
                      </div>

                      {/* Categories */}
                      <div>
                        <FormLabel className="text-sm font-medium text-gray-700">Categories *</FormLabel>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {CATEGORIES.map((category) => (
                            <label key={category} className="flex items-center space-x-2 text-sm">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                onChange={(e) => {
                                  const currentCategories = companyForm.getValues('categories') || []
                                  if (e.target.checked) {
                                    companyForm.setValue('categories', [...currentCategories, category])
                                  } else {
                                    companyForm.setValue('categories', currentCategories.filter(c => c !== category))
                                  }
                                }}
                              />
                              <span className="text-gray-700">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <FormField
                        control={companyForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Company Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Write down about your company here. Let the candidate know who we are..."
                                className="mt-1 min-h-[120px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </TabsContent>

                {/* Founding Info Tab */}
                <TabsContent value="founding-info" className="p-6 space-y-6">
                  <Form {...foundingForm}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={foundingForm.control}
                          name="organizationType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Organization Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select organization type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ORGANIZATION_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={foundingForm.control}
                          name="foundedYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Founded Year *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="2020" 
                                  type="number"
                                  min="1800"
                                  max={new Date().getFullYear()}
                                  className="mt-1"
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
                              <FormLabel className="text-sm font-medium text-gray-700">Employee Count *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="25" 
                                  type="number"
                                  min="1"
                                  className="mt-1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={foundingForm.control}
                          name="headquarters"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Headquarters *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="San Francisco, CA" 
                                  className="mt-1"
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
                              <FormLabel className="text-sm font-medium text-gray-700">Annual Revenue</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="$1M - $10M" 
                                  className="mt-1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={foundingForm.control}
                          name="funding"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Funding</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Series A, $5M" 
                                  className="mt-1"
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
                        name="founders"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Founders *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about the founders and their background..."
                                className="mt-1 min-h-[100px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={foundingForm.control}
                        name="vision"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Company Vision *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What is your company's vision for the future?"
                                className="mt-1 min-h-[100px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={foundingForm.control}
                        name="mission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Company Mission *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What is your company's mission statement?"
                                className="mt-1 min-h-[100px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social-media" className="p-6 space-y-6">
                  <Form {...socialForm}>
                    <div className="space-y-6">
                      {[
                        { name: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/company/yourcompany', icon: Linkedin },
                        { name: 'twitter', label: 'Twitter Profile', placeholder: 'https://twitter.com/yourcompany', icon: Twitter },
                        { name: 'facebook', label: 'Facebook Profile', placeholder: 'https://facebook.com/yourcompany', icon: Facebook },
                        { name: 'instagram', label: 'Instagram Profile', placeholder: 'https://instagram.com/yourcompany', icon: Instagram },
                        { name: 'youtube', label: 'YouTube Profile', placeholder: 'https://youtube.com/c/yourcompany', icon: Youtube },
                      ].map((social) => {
                        const Icon = social.icon
                        return (
                          <FormField
                            key={social.name}
                            control={socialForm.control}
                            name={social.name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {social.label}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={social.placeholder}
                                    className="mt-1"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )
                      })}
                    </div>
                  </Form>
                </TabsContent>

                {/* Account Setting Tab */}
                <TabsContent value="account-setting" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <Form {...accountForm}>
                      <div className="space-y-6">
                        {/* Map Location */}
                        <div>
                          <FormLabel className="text-sm font-medium text-gray-700">Map Location</FormLabel>
                          <div className="mt-2 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Click to set map location</p>
                            </div>
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <FormLabel className="text-sm font-medium text-gray-700">Phone</FormLabel>
                          <div className="mt-2 flex">
                            <select className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              <option>🇧🇩 +880</option>
                              <option>🇺🇸 +1</option>
                              <option>🇬🇧 +44</option>
                            </select>
                            <FormField
                              control={accountForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormControl>
                                  <Input 
                                    placeholder="Phone number..." 
                                    className="rounded-l-none"
                                    {...field} 
                                  />
                                </FormControl>
                              )}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <FormField
                          control={accountForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                              <FormControl>
                                <div className="mt-2 relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input 
                                    placeholder="Email address" 
                                    className="pl-10"
                                    type="email"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Address Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={accountForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Address *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Street address" 
                                    className="mt-1"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={accountForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">City *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="City" 
                                    className="mt-1"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={accountForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">State/Province *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="State" 
                                    className="mt-1"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={accountForm.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">ZIP Code *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="ZIP code" 
                                    className="mt-1"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={accountForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Country *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Country" 
                                    className="mt-1"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={accountForm.control}
                            name="contactPerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Contact Person *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Contact person name" 
                                    className="mt-1"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-6">
                          <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                          >
                            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}