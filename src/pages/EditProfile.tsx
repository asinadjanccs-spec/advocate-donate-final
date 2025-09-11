import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Camera, 
  ArrowLeft, 
  Loader2,
  Save,
  Upload 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { userService, UserProfile } from '@/lib/userService';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, validateImageFile, createImagePreview, revokeImagePreview } from '@/lib/imageUpload';

const EditProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    phone_number: '',
    location: '',
    website: '',
    profile_picture_url: '',
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: profile, error } = await userService.getCurrentUserProfile();
        
        if (error || !profile) {
          toast({
            title: "Error",
            description: error || "Failed to load profile",
            variant: "destructive"
          });
          return;
        }

        setUserProfile(profile);
        setFormData({
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          phone_number: profile.phone_number || '',
          location: profile.location || '',
          website: profile.website || '',
          profile_picture_url: profile.profile_picture_url || '',
        });
      } catch (err) {
        console.error('Error loading user profile:', err);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    // Show preview
    const preview = createImagePreview(file);
    setPreviewUrl(preview);

    // Upload file
    setUploading(true);
    try {
      const result = await uploadImage(file);
      
      if (result.error) {
        toast({
          title: "Upload Failed",
          description: result.error,
          variant: "destructive"
        });
        revokeImagePreview(preview);
        setPreviewUrl('');
        return;
      }

      // Update form data with new image URL
      const updatedFormData = {
        ...formData,
        profile_picture_url: result.url
      };
      setFormData(updatedFormData);

      // Auto-save the profile with the new image
      try {
        const { error: saveError } = await userService.updateUserProfile({
          full_name: updatedFormData.full_name,
          bio: updatedFormData.bio,
          phone_number: updatedFormData.phone_number,
          location: updatedFormData.location,
          website: updatedFormData.website,
          profile_picture_url: updatedFormData.profile_picture_url,
        });

        if (saveError) {
          throw new Error(saveError);
        }

        toast({
          title: "Success",
          description: "Profile picture uploaded and saved successfully",
        });
      } catch (saveError) {
        console.error('Error auto-saving profile:', saveError);
        toast({
          title: "Upload Success",
          description: "Profile picture uploaded. Please click 'Save Changes' to persist it.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      revokeImagePreview(preview);
      setPreviewUrl('');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeImagePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await userService.updateUserProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        phone_number: formData.phone_number,
        location: formData.location,
        website: formData.website,
        profile_picture_url: formData.profile_picture_url,
      });

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Loading profile...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2">
              Update your personal information and preferences
            </p>
          </div>

          {/* Profile Picture */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewUrl || formData.profile_picture_url} />
                  <AvatarFallback className="text-xl">
                    {getInitials(formData.full_name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleFileSelect}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Upload New Photo
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, GIF or WebP. Max size 2MB.
                  </p>
                  {previewUrl && (
                    <p className="text-sm text-green-600">
                      ✓ New image ready to save
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Account Type</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {userProfile?.user_type} User
                    </p>
                  </div>
                  {userProfile?.user_type === 'individual' && (
                    <Button variant="outline" size="sm">
                      Upgrade to Organization
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Member Since</h4>
                    <p className="text-sm text-blue-700">
                      {userProfile?.created_at ? 
                        new Date(userProfile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 
                        'Unknown'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="min-w-32"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
