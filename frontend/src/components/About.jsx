import React from 'react'
import Navbar from './Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building2, 
  Users, 
  Target, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  const features = [
    {
      icon: Building2,
      title: 'Company Registration',
      description: 'Streamlined registration process with comprehensive form validation and VINSA branding integration.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Advanced team management tools with role-based access and collaborative features.'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and track company goals with detailed analytics and progress monitoring.'
    },
    {
      icon: Award,
      title: 'Certification',
      description: 'Government-approved certification process with legal compliance verification.'
    }
  ]

  const values = [
    {
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to simplify complex business processes.'
    },
    {
      title: 'Trust',
      description: 'Your data security and privacy are our top priorities in everything we do.'
    },
    {
      title: 'Excellence',
      description: 'We strive for perfection in every aspect of our service delivery.'
    },
    {
      title: 'Support',
      description: '24/7 customer support to help you succeed in your business journey.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="about" />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">CompanyReg</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're revolutionizing business registration with our comprehensive platform 
            that combines modern technology with legal compliance to make company 
            registration effortless and secure.
          </p>
          <Link to="/sign-up">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize business registration by providing an intuitive, secure, 
                and comprehensive platform that empowers entrepreneurs and businesses 
                to establish their legal presence efficiently.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe that starting a business should be exciting, not bureaucratic. 
                That's why we've built a platform that handles the complexity while you 
                focus on what matters most - growing your business.
              </p>
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg font-medium text-gray-900">
                  10,000+ Companies Successfully Registered
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="text-center">
                <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">VINSA Powered</h3>
                <p className="text-gray-600 mb-6">
                  Our platform is powered by VINSA technology, ensuring automatic 
                  branding integration and seamless business process management.
                </p>
                <Link to="/jobpilot-complete">
                  <Button className="w-full">
                    Experience VINSA Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Comify?
            </h2>
            <p className="text-lg text-gray-600">
              Our platform offers comprehensive solutions for all your business registration needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
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

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{value.title[0]}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Business Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful businesses that started with Comify
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" variant="secondary" className="text-blue-600 bg-white hover:bg-gray-100">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Contact Us
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
                <span className="ml-2 text-xl font-bold">Comify</span>
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
              © 2024 Comify by VINSA. All rights reserved. Powered by VINSA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}