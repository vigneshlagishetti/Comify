import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { auth, db } from '@/lib/supabase'
import { setUser, setSession, setLoading, setError } from '@/store/authSlice'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobile_no: z.string().min(10, 'Please enter a valid mobile number'),
  gender: z.enum(['m', 'f', 'o'], { required_error: 'Please select a gender' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const Register = () => {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
      mobile_no: '',
      gender: '',
      password: '',
      confirmPassword: ''
    }
  })

  const watchedFields = watch()
  const progress = step === 1 ? 33 : step === 2 ? 66 : 100

  const onSubmit = async (data) => {
    if (step < 3) {
      const isStepValid = await validateCurrentStep()
      if (isStepValid) {
        if (step === 1) {
          // Move to step 2 immediately, don't call handleEmailRegistration yet
          setStep(step + 1)
        } else if (step === 2) {
          // Step 2 complete, now handle email registration and move to step 3
          await handleEmailRegistration(data)
        }
      }
      return
    }

    // Final step - handle OTP verification
    await handleOTPVerification()
  }

  const validateCurrentStep = async () => {
    if (step === 1) {
      const result = await trigger(['full_name', 'email', 'gender'])
      console.log('Step 1 validation result:', result)
      console.log('Current values:', watchedFields)
      return result
    } else if (step === 2) {
      const result = await trigger(['mobile_no', 'password', 'confirmPassword'])
      console.log('Step 2 validation result:', result)
      return result
    }
    return true
  }

  const handleEmailRegistration = async (data) => {
    setIsLoading(true)
    dispatch(setLoading(true))

    try {
      const { data: authData, error } = await auth.signUp(
        data.email,
        data.password,
        {
          full_name: data.full_name,
          gender: data.gender,
          mobile_no: phone,
          signup_type: 'e'
        }
      )

      if (error) {
        throw error
      }

      setEmailSent(true)
      toast.success('Registration successful! Please check your email for verification.')
      
      // Send OTP to mobile
      await sendMobileOTP()
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
      setStep(1)
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  const sendMobileOTP = async () => {
    try {
      const { data, error } = await auth.sendOTP(phone)
      if (error) {
        throw error
      }
      setOtpSent(true)
      toast.success('OTP sent to your mobile number')
    } catch (error) {
      console.error('OTP send error:', error)
      toast.error('Failed to send OTP. Please try again.')
    }
  }

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await auth.verifyOTP(phone, otp)
      if (error) {
        throw error
      }

      toast.success('Mobile number verified successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    await sendMobileOTP()
  }

  const handlePhoneChange = (value) => {
    setPhone(value)
    setValue('mobile_no', value)
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="full_name"
            type="text"
            placeholder="Enter Your Full Name"
            className="pl-10"
            {...register('full_name')}
          />
        </div>
        {errors.full_name && (
          <p className="text-sm text-destructive">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email ID</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="📧 Official Email"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Gender</Label>
        <RadioGroup
          value={watchedFields.gender || ''}
          onValueChange={(value) => setValue('gender', value)}
          className="flex flex-row space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="m" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="f" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="o" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
        {errors.gender && (
          <p className="text-sm text-destructive">{errors.gender.message}</p>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mobile_no">Mobile No</Label>
        <PhoneInput
          country={'in'}
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+91 __________________"
          inputClass="w-full h-10 text-sm border-input"
          containerClass="phone-input-container"
          inputStyle={{
            width: '100%',
            height: '40px',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            paddingLeft: '48px',
            fontSize: '14px'
          }}
        />
        {errors.mobile_no && (
          <p className="text-sm text-destructive">{errors.mobile_no.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4 text-center">
      {emailSent && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
          <p className="text-green-800 text-sm">
            A verification link has been sent to your email. Please check your inbox and verify.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Verify Mobile</h3>
        <p className="text-sm text-muted-foreground">
          Enter the One Time Password (OTP) which has been sent to {phone}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Enter Your OTP Here</Label>
        <Input
          id="otp"
          type="text"
          placeholder="______"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="text-center text-lg tracking-widest"
          maxLength={6}
        />
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={resendOTP}
          className="text-sm text-primary hover:underline"
        >
          Didn't receive OTP? Resend OTP
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HireNext</h1>
          <p className="text-gray-600">Create your company account</p>
        </div>

        <Card className="mt-8">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {step === 3 ? 'Verify Mobile' : 'Register as a Company'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 && 'Enter your basic information'}
              {step === 2 && 'Set up your contact and password'}
              {step === 3 && 'Great! Almost done! Please verify your mobile no'}
            </CardDescription>
            
            <div className="pt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Setup Progress</span>
                <span>{progress}% Completed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && 'Processing...'}
                {!isLoading && step < 3 && 'Continue'}
                {!isLoading && step === 3 && 'Verify & Complete'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {step < 3 && (
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            )}
            
            {step === 3 && (
              <button 
                onClick={() => navigate('/login')}
                className="text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            )}
          </CardFooter>
        </Card>

        <div className="text-center text-xs text-muted-foreground max-w-md mx-auto">
          All your information is collected, stored and processed as per our data processing guidelines. 
          By signing on HireNext, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Terms of Use</a>
        </div>
      </div>
    </div>
  )
}

export default Register