import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Building, MapPin, Globe, Calendar, Upload, X } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { db } from '@/lib/supabase'

const companySchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  postal_code: z.string().min(3, 'Postal code is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  industry: z.string().min(2, 'Industry is required'),
  founded_date: z.string().optional(),
  description: z.string().optional()
})

const CompanyRegistrationForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  
  const { user } = useSelector((state) => state.auth)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch
  } = useForm({
    resolver: zodResolver(companySchema),
    mode: 'onChange'
  })

  const progress = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100

  const validateCurrentStep = async () => {
    if (step === 1) {
      return await trigger(['company_name', 'industry', 'description'])
    } else if (step === 2) {
      return await trigger(['address', 'city', 'state', 'country', 'postal_code'])
    } else if (step === 3) {
      return await trigger(['website', 'founded_date'])
    }
    return true
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && step < 4) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleImageUpload = (file, type) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoFile(file)
        setLogoPreview(reader.result)
      } else {
        setBannerFile(file)
        setBannerPreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (type) => {
    if (type === 'logo') {
      setLogoFile(null)
      setLogoPreview(null)
    } else {
      setBannerFile(null)
      setBannerPreview(null)
    }
  }

  const uploadToCloudinary = async (file) => {
    if (!file) return null

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw error
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      let logoUrl = null
      let bannerUrl = null

      // Upload images to Cloudinary
      if (logoFile) {
        logoUrl = await uploadToCloudinary(logoFile)
      }
      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile)
      }

      // Prepare company data
      const companyData = {
        ...data,
        owner_id: user.id,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        social_links: {} // Add social links functionality later
      }

      // Save to database
      const { data: savedCompany, error } = await db.companies.create(companyData)

      if (error) {
        throw error
      }

      onSuccess(savedCompany)
    } catch (error) {
      console.error('Company registration error:', error)
      toast.error(error.message || 'Failed to register company. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="company_name"
            placeholder="Enter your company name"
            className="pl-10"
            {...register('company_name')}
          />
        </div>
        {errors.company_name && (
          <p className="text-sm text-destructive">{errors.company_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry Type</Label>
        <select
          id="industry"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register('industry')}
        >
          <option value="">Select...</option>
          <option value="Fintech">Fintech</option>
          <option value="Engineering">Engineering</option>
          <option value="Software & IT">Software & IT</option>
          <option value="Edtech">Edtech</option>
          <option value="Oil & Gas">Oil & Gas</option>
          <option value="Other">Other</option>
        </select>
        {errors.industry && (
          <p className="text-sm text-destructive">{errors.industry.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">About Us</Label>
        <textarea
          id="description"
          placeholder="Write down about your company here. Let the candidate know who we are..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-none"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Company Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            placeholder="Enter full address"
            className="pl-10"
            {...register('address')}
          />
        </div>
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="City"
            {...register('city')}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="State"
            {...register('state')}
          />
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Country"
            {...register('country')}
          />
          {errors.country && (
            <p className="text-sm text-destructive">{errors.country.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            placeholder="Postal Code"
            {...register('postal_code')}
          />
          {errors.postal_code && (
            <p className="text-sm text-destructive">{errors.postal_code.message}</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="website">Official Careers Link</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="website"
            type="url"
            placeholder="https://yourcompany.com/careers"
            className="pl-10"
            {...register('website')}
          />
        </div>
        {errors.website && (
          <p className="text-sm text-destructive">{errors.website.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="founded_date">Founded Date</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="founded_date"
            type="date"
            className="pl-10"
            {...register('founded_date')}
          />
        </div>
        {errors.founded_date && (
          <p className="text-sm text-destructive">{errors.founded_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Company Vision</Label>
        <textarea
          placeholder="Tell us about your company vision..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-none"
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Logo & Banner Image</h3>
        <p className="text-sm text-muted-foreground">Upload your company logo and banner image</p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-4">
        <Label>Upload Logo</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {logoPreview ? (
            <div className="relative">
              <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto" />
              <button
                type="button"
                onClick={() => removeImage('logo')}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Browse photo or drop here</p>
              <p className="text-xs text-muted-foreground">A photo larger than 400 pixels work best. Max photo size 5 MB.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'logo')}
                className="hidden"
                id="logo-upload"
              />
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="mt-4">
                  Browse Photo
                </Button>
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Banner Upload */}
      <div className="space-y-4">
        <Label>Banner Image</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {bannerPreview ? (
            <div className="relative">
              <img src={bannerPreview} alt="Banner preview" className="max-h-32 mx-auto" />
              <button
                type="button"
                onClick={() => removeImage('banner')}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Browse photo or drop here</p>
              <p className="text-xs text-muted-foreground">Banner images optimal dimension 1520*400. Supported format: JPEG, PNG. Max photo size 5 MB.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'banner')}
                className="hidden"
                id="banner-upload"
              />
              <Label htmlFor="banner-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="mt-4">
                  Browse Photo
                </Button>
              </Label>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Comify Company Registration</CardTitle>
        <CardDescription className="text-center">
          {step === 1 && 'Basic Company Information'}
          {step === 2 && 'Company Address Details'}
          {step === 3 && 'Additional Information'}
          {step === 4 && 'Logo & Banner Upload'}
        </CardDescription>
        
        <div className="pt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Setup Progress</span>
            <span>{progress}% Completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || isLoading}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button type="button" onClick={nextStep} disabled={isLoading}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

export default CompanyRegistrationForm