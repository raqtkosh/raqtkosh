'use client'
import { useState, useEffect } from 'react' 
import { useUser } from '@clerk/nextjs'
import { User, Address } from '@prisma/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplet, MapPin } from 'lucide-react' 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type ExtendedUser = User & {
  addresses: Address[]
}

type StringAddressField = 'street' | 'city' | 'state' | 'postalCode' | 'country'

export function ProfileForm({ userData }: { userData: ExtendedUser }) {
  const { user } = useUser()
  const [initialData, setInitialData] = useState({
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    phoneNumber: userData.phoneNumber || '',
    bloodType: userData.bloodType || '',
    feedback: userData.feedback || '',
    addresses: userData.addresses.length > 0 ? userData.addresses : [
      {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isPrimary: true
      }
    ]
  })

  const [formData, setFormData] = useState(initialData)
  const [hasChanges, setHasChanges] = useState(false) 

  useEffect(() => {
    const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData)
    setHasChanges(isChanged)
  }, [formData, initialData])

  const bloodTypeOptions = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const updatedAddresses = [...formData.addresses]
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [name]: value
    }
    setFormData(prev => ({ ...prev, addresses: updatedAddresses }))
  }

  const handlePrimaryAddressChange = (index: number) => {
    const updated = formData.addresses.map((addr, i) => ({
      ...addr,
      isPrimary: i === index
    }))
    setFormData(prev => ({ ...prev, addresses: updated }))
  }

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          isPrimary: false
        }
      ]
    }))
  }

  const removeAddress = (index: number) => {
    const filtered = formData.addresses.filter((_, i) => i !== index)
    const hasPrimary = filtered.some(addr => addr.isPrimary)
    if (!hasPrimary && filtered.length > 0) {
      filtered[0].isPrimary = true
    }
    setFormData(prev => ({ ...prev, addresses: filtered }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          addresses: formData.addresses.map(addr => ({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            isPrimary: addr.isPrimary
          }))
        })
      })
      if (response.ok) {
        setInitialData(formData)
        toast.success('Profile updated successfully!', {
          position: 'top-right',
          autoClose: 2000,
        })
      } else {
        toast.error('Failed to update profile', {
          position: 'top-right',
          autoClose: 2000,
        })
      }
    } catch (err) {
      console.error('Update failed:', err)
      toast.error('An error occurred while updating profile', {
        position: 'top-right',
        autoClose: 2000,
      })
    }
  }

  const stringFields: StringAddressField[] = ['street', 'city', 'state', 'postalCode', 'country']

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-medium">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <Card className="bg-white border border-gray-200 shadow">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-2 rounded-full bg-red-50 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-50 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-50 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-50 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-50 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-50 text-red-600">
                  <Droplet className="h-5 w-5" />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select blood type</option>
                    {bloodTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-800">Your Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your experience
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows={4}
              placeholder="Write your feedback about RaqtKosh..."
              className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </CardContent>
        </Card>

        {/* Addresses Card */}
        <Card className="bg-white border border-gray-200 shadow">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-2 rounded-full bg-red-50 text-red-600">
                <MapPin className="h-5 w-5" />
              </div>
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {formData.addresses.map((address, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <input
                      type="radio"
                      name="primaryAddress"
                      checked={address.isPrimary}
                      onChange={() => handlePrimaryAddressChange(index)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <span>Primary Address</span>
                  </label>
                  {index > 0 && (
                    <button
                      onClick={() => removeAddress(index)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stringFields.map(field => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field === 'postalCode' ? 'Postal Code' : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={address[field]}
                        onChange={(e) => handleAddressChange(index, e)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={field === 'country' ? 'India' : `Enter ${field}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addAddress}
              className="w-full border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Another Address
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 bg-white p-6 rounded-lg shadow border border-gray-200">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
            disabled={!hasChanges} 
          >
            Save Changes
            
          </Button>
          
        </div>
      </div>
    </div>
  )
}
