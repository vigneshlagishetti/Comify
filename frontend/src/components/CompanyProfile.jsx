import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Edit, Save, X, Building, MapPin, Globe, Calendar, Mail, Phone } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { db } from '@/lib/supabase'
import { updateProfile } from '@/store/companySlice'

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const handleEdit = () => {
    setEditData(profile)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData({})
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await db.companies.update(profile.id, editData)
      
      if (error) {
        throw error
      }

      dispatch(updateProfile(editData))
      setIsEditing(false)
      setEditData({})
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Building className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Company Profile Found</h2>
        <p className="text-muted-foreground">Please register your company first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Company Profile</h1>
        <div className="space-x-2">
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <div className="space-x-2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isLoading ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Banner and Logo */}
      <Card>
        <div className="relative">
          {profile.banner_url ? (
            <img 
              src={profile.banner_url} 
              alt="Company Banner" 
              className="w-full h-48 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
              <Building className="h-16 w-16 text-white opacity-50" />
            </div>
          )}
          
          <div className="absolute -bottom-12 left-8">
            {profile.logo_url ? (
              <img 
                src={profile.logo_url} 
                alt="Company Logo" 
                className="w-24 h-24 rounded-lg border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg border-4 border-white shadow-lg flex items-center justify-center">
                <Building className="h-8 w-8 text-gray-500" />
              </div>
            )}
          </div>
        </div>
        
        <CardContent className="pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
              
              <div className="space-y-2">
                <Label>Company Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.company_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Industry</Label>
                {isEditing ? (
                  <select
                    value={editData.industry || ''}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Fintech">Fintech</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Software & IT">Software & IT</option>
                    <option value="Edtech">Edtech</option>
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.industry}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Founded Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.founded_date || ''}
                    onChange={(e) => handleChange('founded_date', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {profile.founded_date ? new Date(profile.founded_date).toLocaleDateString() : 'Not specified'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Website</Label>
                {isEditing ? (
                  <Input
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {profile.website ? (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profile.website}
                      </a>
                    ) : 'Not specified'}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
              
              <div className="space-y-2">
                <Label>Address</Label>
                {isEditing ? (
                  <textarea
                    value={editData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  {isEditing ? (
                    <Input
                      value={editData.city || ''}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  {isEditing ? (
                    <Input
                      value={editData.state || ''}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  {isEditing ? (
                    <Input
                      value={editData.country || ''}
                      onChange={(e) => handleChange('country', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  {isEditing ? (
                    <Input
                      value={editData.postal_code || ''}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.postal_code}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">About Company</h3>
            {isEditing ? (
              <textarea
                value={editData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Tell us about your company..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] resize-none"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profile.description || 'No description provided.'}
              </p>
            )}
          </div>

          {/* Owner Information */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user?.user_metadata?.full_name || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Registered</p>
                <p className="font-semibold">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Building className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-semibold">{profile.industry}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">{profile.city}, {profile.country}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyProfile