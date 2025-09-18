import { 
  SignIn, 
  SignUp, 
  UserButton, 
  useUser,
  useAuth,
  ClerkLoaded,
  ClerkLoading
} from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '@/lib/supabase'
import { toast } from 'react-toastify'

// Custom Sign Up component with company registration flow
export function ClerkSignUp({ onSuccess }) {
  const { user, isSignedIn } = useUser()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('ClerkSignUp: user state changed', { user: user?.id, isSignedIn })
    if (user && isSignedIn) {
      handleUserCreation(user)
    }
  }, [user, isSignedIn])

  const handleUserCreation = async (clerkUser) => {
    try {
      console.log('Creating user in database for:', clerkUser.id)
      
      // Check if user already exists in our database
      const { data: existingUser, error: checkError } = await db.users.getByClerkId(clerkUser.id)
      
      if (checkError) {
        console.error('Error checking existing user:', checkError)
      }
      
      if (existingUser) {
        // User exists, check if they have a company
        console.log('User already exists, checking for company registration')
        
        try {
          const companyResponse = await fetch(`http://localhost:5000/api/company-profile/${clerkUser.id}`)
          if (companyResponse.ok) {
            // Has company, redirect to dashboard
            console.log('User has company, redirecting to dashboard')
            toast.success('Welcome back!')
            if (onSuccess) onSuccess()
            navigate('/jobpilot-dashboard')
          } else {
            // No company, redirect to registration
            console.log('User has no company, redirecting to registration')
            toast.success('Welcome back! Please complete your company registration.')
            if (onSuccess) onSuccess()
            navigate('/jobpilot-complete')
          }
        } catch (error) {
          console.error('Error checking company registration:', error)
          // Default to dashboard on error
          toast.success('Welcome back!')
          if (onSuccess) onSuccess()
          navigate('/jobpilot-dashboard')
        }
        return
      }

      // Create new user in our database
      const userData = {
        clerk_id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        mobile_no: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        gender: null, // Will be updated in company registration
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Creating new user with data:', userData)

      const { data: newUser, error: createError } = await db.users.create(userData)
      
      if (createError) {
        console.error('Error creating user in database:', createError)
        toast.error('Failed to create user profile. Please try again.')
        // Optionally sign out the user from Clerk if database creation fails
        await signOut()
        return
      }

      console.log('User created successfully:', newUser)
      toast.success('Account created successfully!')
      
      // Redirect to Jobpilot company registration
      if (onSuccess) onSuccess()
      navigate('/jobpilot-complete')

    } catch (error) {
      console.error('Error in user creation flow:', error)
      toast.error('Something went wrong during account setup')
      // Optionally sign out the user from Clerk
      await signOut()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create Account
          </CardTitle>
          <CardDescription>
            Sign up to register your company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClerkLoading>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <SignUp 
              routing="hash" 
              signInUrl="/sign-in"
              afterSignUpUrl="/register"
              redirectUrl="/register"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                  card: 'shadow-none border-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
            />
          </ClerkLoaded>
        </CardContent>
      </Card>
    </div>
  )
}

// Custom Sign In component
export function ClerkSignIn({ onSuccess }) {
  const { user, isSignedIn } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('ClerkSignIn: user state changed', { user: user?.id, isSignedIn })
    if (user && isSignedIn) {
      console.log('User signed in successfully, redirecting to dashboard')
      toast.success('Welcome back!')
      if (onSuccess) onSuccess()
      navigate('/dashboard')
    }
  }, [user, isSignedIn, navigate, onSuccess])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your company account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClerkLoading>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <SignIn 
              routing="hash" 
              signUpUrl="/sign-up"
              afterSignInUrl="/dashboard"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                  card: 'shadow-none border-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
            />
          </ClerkLoaded>
        </CardContent>
      </Card>
    </div>
  )
}

// User menu component for authenticated users
export function ClerkUserButton() {
  return (
    <UserButton 
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          avatarBox: 'w-10 h-10',
          userButtonPopoverCard: 'shadow-lg',
          userButtonPopoverActionButton: 'hover:bg-gray-50'
        }
      }}
    />
  )
}

// Protected route wrapper
export function ClerkProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in')
    }
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return children
}

// Authentication status component
export function ClerkAuthStatus() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  if (!isSignedIn) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href="/sign-in">Sign In</a>
        </Button>
        <Button asChild>
          <a href="/sign-up">Sign Up</a>
        </Button>
      </div>
    )
  }

  return <ClerkUserButton />
}