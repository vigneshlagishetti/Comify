import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Navbar from './Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Building, 
  Shield, 
  Users, 
  CheckCircle, 
  Star,
  Globe,
  Clock,
  Award
} from 'lucide-react'

const LandingPage = () => {
  const { user, isSignedIn } = useUser()
  const [hasCompany, setHasCompany] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkCompanyRegistration = async () => {
      if (isSignedIn && user?.id) {
        try {
          const response = await fetch(`http://localhost:5000/api/company-profile/${user.id}`)
          if (response.ok) {
            setHasCompany(true)
          } else {
            setHasCompany(false)
          }
        } catch (error) {
          console.error('Error checking company registration:', error)
          setHasCompany(false)
        }
      } else {
        setHasCompany(false)
      }
      setIsLoading(false)
    }

    checkCompanyRegistration()
  }, [user, isSignedIn])

  const features = [
    {
      icon: Building,
      title: 'Company Registration',
      description: 'Quick and easy multi-step company registration process'
    },
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'Advanced security measures to verify your company details'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage your company team and employee information'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Register companies from anywhere in the world'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round the clock customer support for all your needs'
    },
    {
      icon: Award,
      title: 'Certified Process',
      description: 'Government approved and legally compliant registration'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      content: 'The registration process was incredibly smooth. Got my company registered in just 2 days!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      company: 'Digital Solutions Ltd.',
      content: 'Professional service with excellent support. Highly recommended for business registration.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      company: 'Creative Agency',
      content: 'User-friendly platform with step-by-step guidance. Made the whole process stress-free.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar currentPage="home" />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Register Your Company
            <span className="text-blue-600"> Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your business registration process with our comprehensive platform. 
            Get your company registered quickly, securely, and legally compliant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isSignedIn ? (
              // Not signed in - Show sign up
              <Link to="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Registration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : isLoading ? (
              // Loading state
              <Button size="lg" disabled className="w-full sm:w-auto">
                Loading...
              </Button>
            ) : hasCompany ? (
              // Has company - Show dashboard
              <Link to="/jobpilot-dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              // Signed in but no company - Show registration
              <Link to="/jobpilot-complete">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Register Company
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to register and manage your company efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Companies Registered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2 Days</div>
              <div className="text-gray-600">Average Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-600 italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Register Your Company?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful businesses that started their journey with us.
          </p>
          {!isSignedIn ? (
            <Link to="/sign-up">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Your Registration Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : hasCompany ? (
            <Link to="/jobpilot-dashboard">
              <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700">
                Go to Your Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/jobpilot-complete">
              <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700">
                Register Your Company
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Registration Options for Development/Testing */}
      {isSignedIn && !hasCompany && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Registration Interface Options
              </h2>
              <p className="text-lg text-gray-600">
                Choose the registration interface that best suits your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Original Registration</CardTitle>
                  <CardDescription>
                    Enhanced multi-step form with modern UI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/register">
                    <Button className="w-full">
                      Access Original Form
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border-2 border-blue-200">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Jobpilot Dashboard</CardTitle>
                  <CardDescription>
                    Complete dashboard-style interface with sidebar navigation
                  </CardDescription>
                  <Badge className="mt-2 bg-blue-100 text-blue-700">Recommended</Badge>
                </CardHeader>
                <CardContent>
                  <Link to="/jobpilot-complete">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Access Jobpilot Interface
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Jobpilot Registration</CardTitle>
                  <CardDescription>
                    Simplified registration flow with step-by-step tabs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/jobpilot-register">
                    <Button variant="outline" className="w-full">
                      Access Simple Form
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Building className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Comify</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for business registration and company management solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
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
              © 2024 Comify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage