import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Users, 
  Globe, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Briefcase,
  Target,
  Award,
  Settings,
  User,
  PlusCircle,
  FileText,
  Bookmark,
  BarChart3,
  CreditCard,
  Bell,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Download,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Heart,
  MessageSquare,
  Star,
  ChevronDown,
  MoreHorizontal,
  Upload,
  Save,
  X,
  Camera,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Lock,
  UserCheck,
  Shield,
  Palette
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for dashboard
const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $120k',
    applications: 45,
    views: 320,
    status: 'Active',
    posted: '2 days ago',
    expires: '25 days left',
    description: 'We are looking for a Senior Frontend Developer to join our team...',
    requirements: 'React, TypeScript, 5+ years experience'
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$70k - $100k',
    applications: 23,
    views: 180,
    status: 'Active',
    posted: '5 days ago',
    expires: '22 days left',
    description: 'Join our design team to create beautiful user experiences...',
    requirements: 'Figma, Adobe Creative Suite, 3+ years experience'
  },
  {
    id: 3,
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$100k - $140k',
    applications: 67,
    views: 450,
    status: 'Draft',
    posted: '1 week ago',
    expires: '18 days left',
    description: 'Lead product strategy and execution for our core platform...',
    requirements: 'MBA preferred, 7+ years product management experience'
  },
  {
    id: 4,
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$75k - $110k',
    applications: 32,
    views: 220,
    status: 'Active',
    posted: '3 days ago',
    expires: '24 days left',
    description: 'Build scalable backend systems and APIs...',
    requirements: 'Node.js, Python, AWS, 4+ years experience'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Seattle, WA',
    type: 'Contract',
    salary: '$90k - $130k',
    applications: 18,
    views: 150,
    status: 'Paused',
    posted: '1 week ago',
    expires: '20 days left',
    description: 'Manage cloud infrastructure and deployment pipelines...',
    requirements: 'Kubernetes, Docker, Terraform, 5+ years experience'
  },
  {
    id: 6,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Part-time',
    salary: '$40k - $60k',
    applications: 41,
    views: 280,
    status: 'Expired',
    posted: '2 weeks ago',
    expires: 'Expired',
    description: 'Drive digital marketing campaigns and growth initiatives...',
    requirements: 'Google Ads, SEO/SEM, Analytics, 2+ years experience'
  }
]

const mockCandidates = [
  {
    id: 1,
    name: 'John Smith',
    title: 'Senior React Developer',
    location: 'California, USA',
    experience: '5+ years',
    salary: '$90k',
    rating: 4.8,
    appliedFor: 'Senior Frontend Developer',
    appliedDate: '2 days ago',
    status: 'Under Review',
    avatar: null
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    title: 'UX Designer',
    location: 'New York, USA',
    experience: '3+ years',
    salary: '$75k',
    rating: 4.9,
    appliedFor: 'UX/UI Designer',
    appliedDate: '1 day ago',
    status: 'Shortlisted',
    avatar: null
  },
  {
    id: 3,
    name: 'Mike Chen',
    title: 'Product Manager',
    location: 'San Francisco, USA',
    experience: '7+ years',
    salary: '$120k',
    rating: 4.7,
    appliedFor: 'Product Manager',
    appliedDate: '3 days ago',
    status: 'Interview Scheduled',
    avatar: null
  }
]

export default function JobpilotDashboard() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock company data for dashboard
  const [companyData, setCompanyData] = useState({
    id: 1,
    companyName: 'TechCorp Solutions',
    website: 'https://techcorp.com',
    email: 'contact@techcorp.com',
    phone: '+1-555-0123',
    location: 'San Francisco, CA',
    establishedDate: '2015',
    teamSize: '50-100',
    industryType: 'Technology',
    companyType: 'Private',
    description: 'Leading technology company focused on innovative solutions.',
    logo: '/placeholder-logo.png',
    banner: '/placeholder-banner.jpg'
  })

  useEffect(() => {
    // Initialize with mock data
    if (user?.id && !companyData) {
      setCompanyData({
        id: 1,
        companyName: 'TechCorp Solutions',
        website: 'https://techcorp.com',
        email: 'contact@techcorp.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        establishedDate: '2015',
        teamSize: '50-100',
        industryType: 'Technology',
        companyType: 'Private',
        description: 'Leading technology company focused on innovative solutions.',
        logo: '/placeholder-logo.png',
        banner: '/placeholder-banner.jpg'
      })
    }
  }, [user, companyData])

  const sidebarItems = [
    { icon: BarChart3, label: 'Overview', id: 'overview', active: true },
    { icon: User, label: 'Employers Profile', id: 'profile' },
    { icon: PlusCircle, label: 'Post a Job', id: 'post-job' },
    { icon: FileText, label: 'My Jobs', id: 'my-jobs' },
    { icon: Bookmark, label: 'Saved Candidate', id: 'saved-candidates' },
    { icon: CreditCard, label: 'Plans & Billing', id: 'billing' },
    { icon: Users, label: 'All Companies', id: 'companies' },
    { icon: Settings, label: 'Settings', id: 'settings' }
  ]

  // Company form data state
  const [companyForm, setCompanyForm] = useState({
    // Company Info
    companyName: '',
    website: '',
    establishedDate: '',
    teamSize: '',
    industryType: '',
    companyType: '',
    categories: [],
    description: '',
    companyLogo: null,
    companyBanner: null,
    
    // Founding Info
    foundingStory: '',
    vision: '',
    mission: '',
    companyValues: [],
    keyAchievements: '',
    
    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    
    // Account Settings
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    profileVisibility: 'public'
  })

  const [activeSettingsTab, setActiveSettingsTab] = useState('company-info')

  const teamSizeOptions = [
    '1-10 employees',
    '11-50 employees', 
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ]

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Manufacturing',
    'Consulting',
    'Real Estate',
    'Media & Entertainment',
    'Transportation',
    'Non-profit',
    'Government',
    'Other'
  ]

  const companyTypeOptions = [
    'Private Company',
    'Public Company',
    'Partnership',
    'Sole Proprietorship',
    'Non-profit',
    'Government Agency',
    'Startup',
    'Corporation',
    'LLC'
  ]

  const categoryOptions = [
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

  // File upload handler
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0]
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
      if (allowedTypes.includes(file.type)) {
        setCompanyForm(prev => ({
          ...prev,
          [type]: file
        }))
      } else {
        alert('Please upload PNG, JPG or GIF files only')
      }
    } else {
      alert('File size must be less than 2MB')
    }
  }

  // Category toggle handler
  const toggleCategory = (category) => {
    setCompanyForm(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  // Form submit handler
  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/company-profile/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Company profile updated successfully!')
        // Refresh company data
        const updatedResponse = await fetch(`http://localhost:5000/api/company-profile/${user?.id}`)
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setCompanyData(updatedData)
        }
      }
    } catch (error) {
      console.error('Error updating company profile:', error)
      alert('Failed to update company profile')
    }
  }

  const stats = [
    { label: 'Total Jobs Posted', value: '12', change: '+2', icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Applications', value: '135', change: '+15', icon: Users, color: 'bg-green-500' },
    { label: 'Total Views', value: '950', change: '+45', icon: Eye, color: 'bg-purple-500' },
    { label: 'Saved Candidates', value: '28', change: '+5', icon: Heart, color: 'bg-orange-500' }
  ]

  // Show dashboard content
  console.log('Current activeTab:', activeTab)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Comify</span>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Find Candidate</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium border-b-2 border-blue-600">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">My Jobs</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Applications</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Customer Supports</a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">📞 +1-202-555-0122</span>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Post Job
              </Button>
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-400 cursor-pointer" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </div>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
              </Avatar>
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
                  COMIFY DASHBOARD
                </h3>
              </div>
              <nav className="p-2">
                <div className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          console.log('Switching to tab:', item.id)
                          setActiveTab(item.id)
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive 
                            ? 'text-blue-600 bg-blue-50 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.firstName}!
                      </h1>
                      <p className="text-gray-600 mt-1">
                        Here's what's happening with your job postings today.
                      </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                              <div className="flex items-center mt-2">
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <span className="ml-2 text-sm text-green-600 font-medium">
                                  {stat.change}
                                </span>
                              </div>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Recent Jobs and Applications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Jobs */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Job Posts</CardTitle>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockJobs.slice(0, 3).map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div>
                              <h4 className="font-medium text-gray-900">{job.title}</h4>
                              <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                                  {job.status}
                                </Badge>
                                <span className="text-xs text-gray-500">{job.applications} applications</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{job.salary}</p>
                              <p className="text-xs text-gray-500">{job.posted}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Applications */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Applications</CardTitle>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockCandidates.map((candidate) => (
                          <div key={candidate.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                              <p className="text-sm text-gray-600">{candidate.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={
                                  candidate.status === 'Shortlisted' ? 'default' : 
                                  candidate.status === 'Interview Scheduled' ? 'secondary' : 'outline'
                                }>
                                  {candidate.status}
                                </Badge>
                                <span className="text-xs text-gray-500">{candidate.appliedDate}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{candidate.rating}</span>
                              </div>
                              <p className="text-xs text-gray-500">{candidate.salary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'my-jobs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
                  <Button 
                    onClick={() => setActiveTab('post-job')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                          <p className="text-xl font-bold text-gray-900">{mockJobs.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active</p>
                          <p className="text-xl font-bold text-gray-900">{mockJobs.filter(j => j.status === 'Active').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-50">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Draft</p>
                          <p className="text-xl font-bold text-gray-900">{mockJobs.filter(j => j.status === 'Draft').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Expired</p>
                          <p className="text-xl font-bold text-gray-900">{mockJobs.filter(j => j.status === 'Expired').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Applications</p>
                          <p className="text-xl font-bold text-gray-900">{mockJobs.reduce((sum, job) => sum + job.applications, 0)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search jobs by title, department, or location..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mockJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {job.department} • {job.location} • {job.type}
                            </CardDescription>
                          </div>
                          <Badge 
                            variant={
                              job.status === 'Active' ? 'default' : 
                              job.status === 'Draft' ? 'secondary' : 
                              job.status === 'Paused' ? 'outline' : 'destructive'
                            }
                            className={
                              job.status === 'Active' ? 'bg-green-100 text-green-800' :
                              job.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                              job.status === 'Paused' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-900">{job.salary}</span>
                          <span className="text-gray-500">{job.expires}</span>
                        </div>

                        {/* Job Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="h-3 w-3 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{job.applications}</span>
                            </div>
                            <span className="text-xs text-gray-500">Applications</span>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Eye className="h-3 w-3 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{job.views}</span>
                            </div>
                            <span className="text-xs text-gray-500">Views</span>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{job.posted.split(' ')[0]}</span>
                            </div>
                            <span className="text-xs text-gray-500">Days ago</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Job
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export Applications
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {job.status === 'Active' ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Pause Job
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate Job
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Target className="h-4 w-4 mr-2" />
                                Boost Job
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Empty State if no jobs */}
                {mockJobs.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                      <p className="text-gray-600 mb-6">Get started by posting your first job and start receiving applications.</p>
                      <Button 
                        onClick={() => setActiveTab('post-job')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-1">Manage your company profile and account preferences</p>
                </div>
                
                <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="w-full">
                  <TabsList className="w-full justify-start h-auto p-1 bg-gray-50 rounded-none border-b">
                    <TabsTrigger value="company-info" className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                      Company Info
                    </TabsTrigger>
                    <TabsTrigger value="founding-info" className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                      Founding Info
                    </TabsTrigger>
                    <TabsTrigger value="social-media" className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                      Social Media Profile
                    </TabsTrigger>
                    <TabsTrigger value="account-setting" className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                      Account Setting
                    </TabsTrigger>
                  </TabsList>

                  {/* Company Info Tab */}
                  <TabsContent value="company-info" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Company Logo Upload */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Camera className="h-5 w-5" />
                            Company Logo
                          </CardTitle>
                          <CardDescription>Upload company logo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or GIF (max. 2MB)</p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/png,image/jpeg,image/gif"
                                onChange={(e) => handleFileUpload(e, 'companyLogo')}
                              />
                            </label>
                          </div>
                          {companyForm.companyLogo && (
                            <p className="text-sm text-green-600">✓ {companyForm.companyLogo.name}</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Company Banner Upload */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Company Banner
                          </CardTitle>
                          <CardDescription>Upload company banner</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or GIF (max. 2MB)</p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/png,image/jpeg,image/gif"
                                onChange={(e) => handleFileUpload(e, 'companyBanner')}
                              />
                            </label>
                          </div>
                          {companyForm.companyBanner && (
                            <p className="text-sm text-green-600">✓ {companyForm.companyBanner.name}</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Company Details Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>Basic information about your company</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name *</Label>
                            <Input 
                              id="companyName"
                              placeholder="Company name"
                              value={companyForm.companyName}
                              onChange={(e) => setCompanyForm(prev => ({...prev, companyName: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input 
                              id="website"
                              placeholder="Website link"
                              value={companyForm.website}
                              onChange={(e) => setCompanyForm(prev => ({...prev, website: e.target.value}))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="establishedDate">Established Date *</Label>
                            <Input 
                              id="establishedDate"
                              type="date"
                              value={companyForm.establishedDate}
                              onChange={(e) => setCompanyForm(prev => ({...prev, establishedDate: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="teamSize">Team Size *</Label>
                            <Select value={companyForm.teamSize} onValueChange={(value) => setCompanyForm(prev => ({...prev, teamSize: value}))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select team size" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamSizeOptions.map((size) => (
                                  <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="industryType">Industry Type *</Label>
                            <Select value={companyForm.industryType} onValueChange={(value) => setCompanyForm(prev => ({...prev, industryType: value}))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {industryOptions.map((industry) => (
                                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyType">Company Type *</Label>
                            <Select value={companyForm.companyType} onValueChange={(value) => setCompanyForm(prev => ({...prev, companyType: value}))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company type" />
                              </SelectTrigger>
                              <SelectContent>
                                {companyTypeOptions.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Categories Section */}
                        <div className="space-y-2">
                          <Label>Categories *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 border rounded-lg bg-gray-50">
                            {categoryOptions.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={category}
                                  checked={companyForm.categories.includes(category)}
                                  onCheckedChange={() => toggleCategory(category)}
                                />
                                <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                                  {category}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">Selected: {companyForm.categories.length} categories</p>
                        </div>

                        {/* Company Description */}
                        <div className="space-y-2">
                          <Label htmlFor="description">Company Description *</Label>
                          <Textarea 
                            id="description"
                            placeholder="Write down about your company here. Let the candidate know who we are..."
                            rows={4}
                            value={companyForm.description}
                            onChange={(e) => setCompanyForm(prev => ({...prev, description: e.target.value}))}
                          />
                        </div>

                        {/* Navigation Buttons for Company Info Tab */}
                        <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
                          <Button variant="outline" onClick={() => setActiveTab('overview')}>
                            Cancel
                          </Button>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleFormSubmit(companyForm)}
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button 
                              onClick={() => setActiveSettingsTab('founding-info')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Next: Founding Info
                              <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Founding Info Tab */}
                  <TabsContent value="founding-info" className="p-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Story & Values</CardTitle>
                        <CardDescription>Tell candidates about your company's journey and culture</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="foundingStory">Founding Story</Label>
                          <Textarea 
                            id="foundingStory"
                            placeholder="Tell the story of how your company was founded..."
                            rows={4}
                            value={companyForm.foundingStory}
                            onChange={(e) => setCompanyForm(prev => ({...prev, foundingStory: e.target.value}))}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="vision">Company Vision</Label>
                            <Textarea 
                              id="vision"
                              placeholder="What is your company's vision for the future?"
                              rows={3}
                              value={companyForm.vision}
                              onChange={(e) => setCompanyForm(prev => ({...prev, vision: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mission">Company Mission</Label>
                            <Textarea 
                              id="mission"
                              placeholder="What is your company's mission?"
                              rows={3}
                              value={companyForm.mission}
                              onChange={(e) => setCompanyForm(prev => ({...prev, mission: e.target.value}))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="keyAchievements">Key Achievements</Label>
                          <Textarea 
                            id="keyAchievements"
                            placeholder="Highlight your company's major achievements and milestones..."
                            rows={4}
                            value={companyForm.keyAchievements}
                            onChange={(e) => setCompanyForm(prev => ({...prev, keyAchievements: e.target.value}))}
                          />
                        </div>

                        {/* Navigation Buttons for Founding Info Tab */}
                        <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveSettingsTab('company-info')}
                          >
                            <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
                            Previous: Company Info
                          </Button>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleFormSubmit(companyForm)}
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button 
                              onClick={() => setActiveSettingsTab('social-media')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Next: Social Media
                              <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Social Media Tab */}
                  <TabsContent value="social-media" className="p-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Social Media Profiles</CardTitle>
                        <CardDescription>Connect your company's social media accounts</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                              <Facebook className="h-4 w-4 text-blue-600" />
                              Facebook URL
                            </Label>
                            <Input 
                              id="facebookUrl"
                              placeholder="https://facebook.com/yourcompany"
                              value={companyForm.facebookUrl}
                              onChange={(e) => setCompanyForm(prev => ({...prev, facebookUrl: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                              <Twitter className="h-4 w-4 text-blue-400" />
                              Twitter URL
                            </Label>
                            <Input 
                              id="twitterUrl"
                              placeholder="https://twitter.com/yourcompany"
                              value={companyForm.twitterUrl}
                              onChange={(e) => setCompanyForm(prev => ({...prev, twitterUrl: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4 text-blue-700" />
                              LinkedIn URL
                            </Label>
                            <Input 
                              id="linkedinUrl"
                              placeholder="https://linkedin.com/company/yourcompany"
                              value={companyForm.linkedinUrl}
                              onChange={(e) => setCompanyForm(prev => ({...prev, linkedinUrl: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                              <Instagram className="h-4 w-4 text-pink-600" />
                              Instagram URL
                            </Label>
                            <Input 
                              id="instagramUrl"
                              placeholder="https://instagram.com/yourcompany"
                              value={companyForm.instagramUrl}
                              onChange={(e) => setCompanyForm(prev => ({...prev, instagramUrl: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                              <Youtube className="h-4 w-4 text-red-600" />
                              YouTube URL
                            </Label>
                            <Input 
                              id="youtubeUrl"
                              placeholder="https://youtube.com/channel/yourcompany"
                              value={companyForm.youtubeUrl}
                              onChange={(e) => setCompanyForm(prev => ({...prev, youtubeUrl: e.target.value}))}
                            />
                          </div>
                        </div>

                        {/* Navigation Buttons for Social Media Tab */}
                        <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveSettingsTab('founding-info')}
                          >
                            <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
                            Previous: Founding Info
                          </Button>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleFormSubmit(companyForm)}
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button 
                              onClick={() => setActiveSettingsTab('account-setting')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Next: Account Setting
                              <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Account Settings Tab */}
                  <TabsContent value="account-setting" className="p-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Preferences</CardTitle>
                        <CardDescription>Manage your account settings and preferences</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Notification Settings */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Notification Settings</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="emailNotifications">Email Notifications</Label>
                                <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                              </div>
                              <Switch 
                                id="emailNotifications"
                                checked={companyForm.emailNotifications}
                                onCheckedChange={(checked) => setCompanyForm(prev => ({...prev, emailNotifications: checked}))}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                                <p className="text-sm text-gray-600">Receive SMS alerts for urgent matters</p>
                              </div>
                              <Switch 
                                id="smsNotifications"
                                checked={companyForm.smsNotifications}
                                onCheckedChange={(checked) => setCompanyForm(prev => ({...prev, smsNotifications: checked}))}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="marketingEmails">Marketing Emails</Label>
                                <p className="text-sm text-gray-600">Receive marketing updates and newsletters</p>
                              </div>
                              <Switch 
                                id="marketingEmails"
                                checked={companyForm.marketingEmails}
                                onCheckedChange={(checked) => setCompanyForm(prev => ({...prev, marketingEmails: checked}))}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Security Settings */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Security Settings</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="twoFactorAuth" className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  Two-Factor Authentication
                                </Label>
                                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                              </div>
                              <Switch 
                                id="twoFactorAuth"
                                checked={companyForm.twoFactorAuth}
                                onCheckedChange={(checked) => setCompanyForm(prev => ({...prev, twoFactorAuth: checked}))}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Privacy Settings */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                          <div className="space-y-2">
                            <Label htmlFor="profileVisibility">Profile Visibility</Label>
                            <Select value={companyForm.profileVisibility} onValueChange={(value) => setCompanyForm(prev => ({...prev, profileVisibility: value}))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                                <SelectItem value="private">Private - Only visible to you</SelectItem>
                                <SelectItem value="verified">Verified Users Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Navigation Buttons for Account Settings Tab */}
                        <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveSettingsTab('social-media')}
                          >
                            <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
                            Previous: Social Media
                          </Button>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleFormSubmit(companyForm)}
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button 
                              onClick={() => {
                                handleFormSubmit(companyForm);
                                setActiveTab('overview');
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save & Complete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Add other tab content as needed */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Employers Profile</h1>
                  <Button 
                    onClick={() => setActiveTab('settings')}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Company Header with Banner */}
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-6 left-6 flex items-end gap-4">
                        <div className="w-24 h-24 bg-white rounded-lg border-4 border-white overflow-hidden">
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <div className="text-white">
                          <h2 className="text-2xl font-bold">{companyData?.company_name || 'Your Company Name'}</h2>
                          <p className="text-blue-100">{companyData?.industry_type || 'Technology'}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {companyData?.city || 'Location'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {companyData?.team_size || '11-50 employees'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Stats Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-500">{stat.change}</span>
                                <span className="text-xs text-gray-500">this month</span>
                              </div>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                              <stat.icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Company Details */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* About Company */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            About Company
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-600">
                            {companyData?.description || 'We are an innovative company focused on delivering exceptional solutions to our clients. Our team is dedicated to excellence and continuous growth in the technology sector.'}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Established: {companyData?.established_date || '2020'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Globe className="h-4 w-4" />
                              <span>{companyData?.website || 'www.company.com'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Briefcase className="h-4 w-4" />
                              <span>{companyData?.company_type || 'Private Company'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Award className="h-4 w-4" />
                              <span>Verified Company</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                              {(companyData?.categories || ['Web Development', 'Software Development', 'Technology', 'Consulting']).map((category, index) => (
                                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Activity */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { action: 'Posted new job', detail: 'Senior React Developer', time: '2 hours ago', icon: PlusCircle },
                              { action: 'Reviewed application', detail: 'John Smith for Frontend Developer', time: '4 hours ago', icon: Eye },
                              { action: 'Updated company profile', detail: 'Added new team members', time: '1 day ago', icon: Edit3 },
                              { action: 'Saved candidate', detail: 'Sarah Johnson - UX Designer', time: '2 days ago', icon: Heart },
                            ].map((activity, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <div className="p-2 rounded-lg bg-blue-50">
                                  <activity.icon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{activity.action}</p>
                                  <p className="text-sm text-gray-600">{activity.detail}</p>
                                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">contact@company.com</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {companyData?.city || 'San Francisco'}, {companyData?.state || 'CA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <a href="#" className="text-sm text-blue-600 hover:underline">
                              {companyData?.website || 'www.company.com'}
                            </a>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Social Media Links */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Social Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-3">
                            <a href="#" className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <Facebook className="h-5 w-5 text-blue-600" />
                              <span className="text-sm font-medium">Facebook</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <Twitter className="h-5 w-5 text-blue-400" />
                              <span className="text-sm font-medium">Twitter</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <Linkedin className="h-5 w-5 text-blue-700" />
                              <span className="text-sm font-medium">LinkedIn</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <Instagram className="h-5 w-5 text-pink-600" />
                              <span className="text-sm font-medium">Instagram</span>
                            </a>
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
                            onClick={() => setActiveTab('post-job')}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Post New Job
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('my-jobs')}
                            variant="outline" 
                            className="w-full"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Manage Jobs
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('saved-candidates')}
                            variant="outline" 
                            className="w-full"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            View Saved Candidates
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'post-job' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setActiveTab('my-jobs')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View My Jobs
                    </Button>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Details</CardTitle>
                      <CardDescription>Fill in the details for your new job posting</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Basic Job Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title *</Label>
                            <Input id="jobTitle" placeholder="e.g. Senior React Developer" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="jobDepartment">Department</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="hr">Human Resources</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                                <SelectItem value="customer-support">Customer Support</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="jobLocation">Location *</Label>
                            <Input id="jobLocation" placeholder="e.g. San Francisco, CA" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="jobType">Job Type *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-time">Full Time</SelectItem>
                                <SelectItem value="part-time">Part Time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="temporary">Temporary</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experience">Experience Level</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="entry">Entry Level (0-1 years)</SelectItem>
                                <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                                <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                                <SelectItem value="lead">Lead (8+ years)</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Compensation */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Compensation</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="salaryMin">Minimum Salary</Label>
                            <Input id="salaryMin" placeholder="e.g. 80000" type="number" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="salaryMax">Maximum Salary</Label>
                            <Input id="salaryMax" placeholder="e.g. 120000" type="number" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="usd">USD ($)</SelectItem>
                                <SelectItem value="eur">EUR (€)</SelectItem>
                                <SelectItem value="gbp">GBP (£)</SelectItem>
                                <SelectItem value="inr">INR (₹)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="salaryType">Salary Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yearly">Per Year</SelectItem>
                                <SelectItem value="monthly">Per Month</SelectItem>
                                <SelectItem value="weekly">Per Week</SelectItem>
                                <SelectItem value="hourly">Per Hour</SelectItem>
                                <SelectItem value="project">Per Project</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="benefits">Benefits</Label>
                            <Input id="benefits" placeholder="e.g. Health insurance, 401k, PTO" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Job Description */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="jobDescription">Job Description *</Label>
                          <Textarea 
                            id="jobDescription" 
                            placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                            rows={6}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="requirements">Requirements *</Label>
                          <Textarea 
                            id="requirements" 
                            placeholder="List the required skills, experience, qualifications, and technical requirements..."
                            rows={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="niceToHave">Nice to Have</Label>
                          <Textarea 
                            id="niceToHave" 
                            placeholder="List preferred qualifications that are not required but would be beneficial..."
                            rows={3}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Application Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Application Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="applicationDeadline">Application Deadline</Label>
                            <Input id="applicationDeadline" type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="openings">Number of Openings</Label>
                            <Input id="openings" placeholder="e.g. 2" type="number" min="1" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Application Method</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="platformApplication" />
                              <Label htmlFor="platformApplication">Accept applications through platform</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="emailApplication" />
                              <Label htmlFor="emailApplication">Accept applications via email</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="externalLink" />
                              <Label htmlFor="externalLink">Redirect to external application form</Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="applicationEmail">Application Email (Optional)</Label>
                          <Input id="applicationEmail" placeholder="hr@company.com" type="email" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="externalUrl">External Application URL (Optional)</Label>
                          <Input id="externalUrl" placeholder="https://company.com/careers/apply" type="url" />
                        </div>
                      </div>

                      <Separator />

                      {/* Skills & Tags */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Skills & Tags</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="skills">Required Skills</Label>
                          <Input id="skills" placeholder="React, JavaScript, Node.js, TypeScript (comma separated)" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags</Label>
                          <Input id="tags" placeholder="Frontend, Remote, Startup, Fast-growing (comma separated)" />
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                        <Button variant="outline" onClick={() => setActiveTab('overview')}>
                          Cancel
                        </Button>
                        <div className="flex gap-3">
                          <Button variant="outline">
                            <Save className="h-4 w-4 mr-2" />
                            Save as Draft
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Publish Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'saved-candidates' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Saved Candidates</h1>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search candidates..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockCandidates.map((candidate) => (
                    <Card key={candidate.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                              <p className="text-gray-600">{candidate.title}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {candidate.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3" />
                                  {candidate.experience}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {candidate.salary}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{candidate.rating}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Heart className="h-4 w-4 mr-2" />
                              Saved
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Plans & Billing</h1>
                <div className="space-y-6">
                  {/* Current Plan */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>Manage your subscription and billing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                        <div>
                          <h3 className="font-semibold text-gray-900">Professional Plan</h3>
                          <p className="text-gray-600">50 job posts per month</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">$99/month</p>
                          <p className="text-sm text-gray-500">Next billing: Dec 15, 2024</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing History */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { date: 'Nov 15, 2024', amount: '$99.00', status: 'Paid' },
                          { date: 'Oct 15, 2024', amount: '$99.00', status: 'Paid' },
                          { date: 'Sep 15, 2024', amount: '$99.00', status: 'Paid' },
                        ].map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{invoice.date}</p>
                              <p className="text-sm text-gray-600">Professional Plan</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">{invoice.amount}</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {invoice.status}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">All Companies</h1>
                <p className="text-gray-600 mb-4">
                  Browse and discover other companies on the platform.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((company) => (
                    <Card key={company} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Tech Company {company}</h3>
                            <p className="text-sm text-gray-600">Technology</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Leading technology company focused on innovation and growth.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>100+ employees</span>
                          </div>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'profile' && activeTab !== 'post-job' && activeTab !== 'my-jobs' && activeTab !== 'saved-candidates' && activeTab !== 'billing' && activeTab !== 'companies' && activeTab !== 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="text-gray-600">
                  This section is coming soon. Stay tuned for updates!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}