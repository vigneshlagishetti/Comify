import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  FileText, 
  Users, 
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Award,
  Zap,
  Globe,
  BarChart3,
  Settings
} from 'lucide-react'

export default function Services() {
  const mainServices = [
    {
      icon: Building2,
      title: 'Company Registration',
      description: 'Complete business registration with legal compliance and VINSA branding integration.',
      features: [
        'Multi-step registration process',
        'Legal document generation',
        'VINSA branding integration',
        'Government compliance',
        'Certificate generation'
      ],
      price: 'Starting at $199',
      link: '/register'
    },
    {
      icon: Settings,
      title: 'Jobpilot Dashboard',
      description: 'Professional dashboard interface for comprehensive company management and profile setup.',
      features: [
        'Complete company profile',
        'Social media integration',
        'Contact management',
        'Document uploads',
        'Team collaboration'
      ],
      price: 'Premium Service',
      link: '/jobpilot-complete'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Advanced tools for managing your company team, roles, and collaborative workflows.',
      features: [
        'Role-based access control',
        'Team member invitations',
        'Activity tracking',
        'Permission management',
        'Collaborative workspaces'
      ],
      price: 'Contact for pricing',
      link: '/dashboard'
    }
  ]

  const additionalServices = [
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security measures and compliance verification'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your business needs'
    },
    {
      icon: Award,
      title: 'Certification',
      description: 'Government-approved certification process with legal validation'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Detailed insights and analytics for your business performance'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Register and manage companies from anywhere in the world'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick registration processing with 1-2 business day turnaround'
    }
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Choose Your Service',
      description: 'Select the registration package that best fits your business needs.'
    },
    {
      step: '2',
      title: 'Complete Your Profile',
      description: 'Fill out our comprehensive forms with your company information.'
    },
    {
      step: '3',
      title: 'Review & Submit',
      description: 'Review all information and submit for processing and verification.'
    },
    {
      step: '4',
      title: 'Get Certified',
      description: 'Receive your official company registration and certificates.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="services" />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="text-blue-600">Services</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive business registration and management solutions designed 
            to help you establish and grow your company with confidence.
          </p>
          <Link to="/sign-up">
            <Button size="lg" className="text-lg px-8 py-4">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Services
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to register and manage your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="hover:shadow-xl transition-shadow border-2 hover:border-blue-200">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Includes:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          {service.price}
                        </Badge>
                      </div>
                      <Link to={service.link}>
                        <Button className="w-full h-12">
                          Access Service
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Additional Features
            </h2>
            <p className="text-lg text-gray-600">
              Extra services and features included with every registration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple 4-step process to get your business registered
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            No hidden fees, no surprises. Pay only for what you need.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Basic Registration</CardTitle>
                <div className="text-3xl font-bold text-blue-600">$199</div>
                <CardDescription>Perfect for startups</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Company registration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    VINSA branding
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Basic support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Professional</CardTitle>
                <div className="text-3xl font-bold text-blue-600">$399</div>
                <CardDescription>Complete business solution</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Everything in Basic
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Jobpilot Dashboard
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Team management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Priority support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-blue-600">Custom</div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dedicated support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Register Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose the service that best fits your needs and get started today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" variant="secondary" className="text-blue-600 bg-white hover:bg-gray-100">
                Start Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">CompanyReg</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for business registration and company management solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-gray-400 hover:text-white">Company Registration</Link></li>
                <li><Link to="/jobpilot-complete" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Profile Management</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Comify. All rights reserved. Powered by VINSA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}