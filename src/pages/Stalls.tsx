import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Tables = Database['public']['Tables']
type Stalls = Tables['stalls']

type StallStatus = 'vacant' | 'occupied' | 'maintenance'

interface MarketSection {
  id: string
  name: string
  code: string
  capacity: number
}

interface Stall {
  id: string
  section_id: string
  stall_number: string
  location_description: string | null
  status: StallStatus
  vendor_profile_id: string | null
  created_at: string
  updated_at: string
  market_section?: MarketSection
  vendor_profile?: {
    id: string
    business_name?: string
    first_name?: string
    last_name?: string
  } | null
}

type NewStall = Pick<Stall, 'section_id' | 'stall_number' | 'location_description' | 'status'>

interface AddStallModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (stall: NewStall) => Promise<void>
  marketSections: MarketSection[]
  onRefreshSections?: () => Promise<void>
}

interface EditStallModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (stallId: string, updates: Partial<Stall>) => Promise<void>
  stall: Stall | null
}

function AddStallModal({ isOpen, onClose, onAdd, marketSections, onRefreshSections }: AddStallModalProps) {
  const [selectedSection, setSelectedSection] = useState<MarketSection | null>(null)
  const [stallCount, setStallCount] = useState(1)
  const [locationDesc, setLocationDesc] = useState('')
  const [status, setStatus] = useState<StallStatus>('vacant')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Dropdown states
  const [filteredSectionOptions, setFilteredSectionOptions] = useState<MarketSection[]>(marketSections)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [sectionSearchValue, setSectionSearchValue] = useState('')

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSectionDropdown(false)
    }
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  // Update filtered options when marketSections change
  useEffect(() => {
    setFilteredSectionOptions(marketSections)
  }, [marketSections])

  // Refresh sections when modal opens
  useEffect(() => {
    if (isOpen && onRefreshSections) {
      onRefreshSections()
    }
  }, [isOpen, onRefreshSections])

  if (!isOpen) return null

  const validateStallCount = (section: MarketSection, count: number): boolean => {
    return count >= 1 && count <= section.capacity
  }

  const handleSectionSearchChange = (value: string) => {
    setSectionSearchValue(value)

    // Filter section options
    const filtered = marketSections.filter(section =>
      section.name.toLowerCase().includes(value.toLowerCase()) ||
      section.code.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredSectionOptions(filtered)
    setShowSectionDropdown(true)

    // Auto-select if exact match
    const exactMatch = marketSections.find(
      section => section.name.toLowerCase() === value.toLowerCase() ||
        section.code.toLowerCase() === value.toLowerCase()
    )
    if (exactMatch) {
      setSelectedSection(exactMatch)
      setStallCount(1)
    }
  }

  const selectSectionOption = (section: MarketSection) => {
    setSelectedSection(section)
    setSectionSearchValue(`${section.name} (${section.code})`)
    setStallCount(1)
    setShowSectionDropdown(false)
    setValidationError(null)
  }

  const incrementStallNumber = () => {
    if (selectedSection && stallCount < selectedSection.capacity) {
      setStallCount(stallCount + 1)
    }
  }

  const decrementStallNumber = () => {
    if (stallCount > 1) {
      setStallCount(stallCount - 1)
    }
  }

  const handleStallNumberChange = (value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && selectedSection) {
      if (numValue >= 1 && numValue <= selectedSection.capacity) {
        setStallCount(numValue)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSection) {
      setValidationError('Please select a section')
      return
    }

    if (!validateStallCount(selectedSection, stallCount)) {
      setValidationError(`Invalid stall count. Must be between 1 and ${selectedSection.capacity}`)
      return
    }

    setLoading(true)
    try {
      // Create multiple stalls with automatic numbering
      for (let i = 1; i <= stallCount; i++) {
        const fullStallNumber = `${selectedSection.code}-${i}`
        await onAdd({
          section_id: selectedSection.id,
          stall_number: fullStallNumber,
          location_description: locationDesc || null,
          status
        })
      }
      onClose()
      setSelectedSection(null)
      setSectionSearchValue('')
      setStallCount(1)
      setLocationDesc('')
      setStatus('vacant')
      setValidationError(null)
    } catch (error) {
      console.error('Error adding stalls:', error)
      setValidationError('Failed to add stalls')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add New Stalls</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Selection with Dropdown */}
          <div className="space-y-2">
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
              Market Section
            </label>
            <div className="relative">
              <input
                type="text"
                id="section"
                value={sectionSearchValue}
                onChange={(e) => handleSectionSearchChange(e.target.value)}
                onFocus={() => setShowSectionDropdown(true)}
                onClick={(e) => e.stopPropagation()}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type or select a section"
                autoComplete="off"
              />
              {showSectionDropdown && filteredSectionOptions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredSectionOptions.map((section, index) => (
                    <div
                      key={`${section.id}-${index}`}
                      className="px-3 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-900 text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectSectionOption(section)
                      }}
                    >
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-gray-500">Code: {section.code} • Capacity: {section.capacity} stalls</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Number of Stalls with Plus/Minus */}
          <div className="space-y-2">
            <label htmlFor="stallCount" className="block text-sm font-medium text-gray-700">
              Number of Stalls
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={decrementStallNumber}
                disabled={!selectedSection || stallCount <= 1}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="text"
                id="stallCount"
                value={stallCount}
                onChange={(e) => handleStallNumberChange(e.target.value)}
                disabled={!selectedSection}
                className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                placeholder="0"
              />
              <button
                type="button"
                onClick={incrementStallNumber}
                disabled={!selectedSection || stallCount >= selectedSection.capacity}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            {selectedSection && (
              <p className="text-xs text-gray-500">
                Format: {selectedSection.code}-{stallCount} (Range: 1 to {selectedSection.capacity})
              </p>
            )}
          </div>

          {/* Location Description */}
          <div className="space-y-2">
            <label htmlFor="locationDesc" className="block text-sm font-medium text-gray-700">
              Location Description
            </label>
            <textarea
              id="locationDesc"
              value={locationDesc}
              onChange={(e) => setLocationDesc(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Optional: Add specific location details"
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Initial Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StallStatus)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="vacant">● Vacant</option>
              <option value="occupied">● Occupied</option>
              <option value="maintenance">● Maintenance</option>
            </select>
            <p className="text-xs text-gray-500">Set the initial status for this stall</p>
          </div>

          {/* Error Message */}
          {validationError && (
            <div className="rounded-lg bg-red-50 p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="ml-3 text-sm text-red-800">{validationError}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedSection}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : `Add ${stallCount} Stall${stallCount > 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditStallModal({ isOpen, onClose, onUpdate, stall }: EditStallModalProps) {
  const [stallNumber, setStallNumber] = useState('')
  const [locationDesc, setLocationDesc] = useState('')
  const [status, setStatus] = useState<StallStatus>('vacant')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form with stall data
  useEffect(() => {
    if (isOpen && stall) {
      setStallNumber(stall.stall_number)
      setLocationDesc(stall.location_description || '')
      setStatus(stall.status)
      setValidationError(null)
      setHasChanges(false)
    }
  }, [isOpen, stall])

  // Track changes
  useEffect(() => {
    if (stall) {
      const stallNumberChanged = stallNumber !== stall.stall_number
      const locationChanged = locationDesc !== (stall.location_description || '')
      const statusChanged = status !== stall.status
      setHasChanges(stallNumberChanged || locationChanged || statusChanged)
    }
  }, [stallNumber, locationDesc, status, stall])

  if (!isOpen || !stall) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasChanges) {
      onClose()
      return
    }

    setLoading(true)
    setValidationError(null)

    try {
      await onUpdate(stall.id, {
        stall_number: stallNumber.trim(),
        location_description: locationDesc.trim() || null,
        status
      })
      onClose()
    } catch (error) {
      console.error('Error updating stall:', error)
      setValidationError('Failed to update stall. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStallNumber(stall.stall_number)
    setLocationDesc(stall.location_description || '')
    setStatus(stall.status)
    setValidationError(null)
  }

  const getStatusInfo = (stallStatus: StallStatus) => {
    switch (stallStatus) {
      case 'vacant':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: '○', label: 'Vacant - Available for assignment' }
      case 'occupied':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: '●', label: 'Occupied - Currently assigned to a vendor' }
      case 'maintenance':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '◐', label: 'Under Maintenance - Temporarily unavailable' }
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: '?', label: 'Unknown status' }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Stall Details</h2>
              <p className="text-sm text-gray-600 mt-1">Update location and status information for this stall</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Stall Info - More detailed and visual */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{stall.stall_number}</h3>
                <p className="text-sm text-gray-600">{stall.market_section?.name} Section</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Status</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stall.status === 'vacant' ? 'bg-green-100 text-green-800' :
                    stall.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {stall.status.charAt(0).toUpperCase() + stall.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Vendor</p>
                <p className="text-sm text-gray-900 mt-1">
                  {stall.vendor_profile ? (
                    stall.vendor_profile.business_name ||
                    `${stall.vendor_profile.first_name} ${stall.vendor_profile.last_name}`
                  ) : (
                    <span className="text-gray-500">No vendor assigned</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Stall Number */}
          <div className="space-y-3">
            <label htmlFor="edit-stallNumber" className="block text-sm font-medium text-gray-900">
              <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
              </svg>
              Stall Number
            </label>
            <input
              id="edit-stallNumber"
              type="text"
              value={stallNumber}
              onChange={(e) => setStallNumber(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., V-7a, V-7b, E-1"
            />
            <p className="text-xs text-gray-500 flex items-center">
              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Use letters after numbers for sub-stalls (e.g., V-7a, V-7b)
            </p>
          </div>

          {/* Location Description */}
          <div className="space-y-3">
            <label htmlFor="edit-locationDesc" className="block text-sm font-medium text-gray-900">
              <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Description
            </label>
            <textarea
              id="edit-locationDesc"
              value={locationDesc}
              onChange={(e) => setLocationDesc(e.target.value)}
              rows={4}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
              placeholder="Describe the specific location of this stall (e.g., 'Near main entrance', 'Corner stall facing east', 'Adjacent to restrooms')"
            />
            <p className="text-xs text-gray-500 flex items-center">
              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help vendors and visitors easily locate this stall
            </p>
          </div>

          {/* Status Selection - Enhanced with descriptions */}
          <div className="space-y-3">
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-900">
              <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Stall Status
            </label>
            <div className="space-y-3">
              {(['vacant', 'occupied', 'maintenance'] as StallStatus[]).map((statusOption) => {
                const statusInfo = getStatusInfo(statusOption)
                return (
                  <label key={statusOption} className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-all ${status === statusOption
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input
                      type="radio"
                      name="status"
                      value={statusOption}
                      checked={status === statusOption}
                      onChange={(e) => setStatus(e.target.value as StallStatus)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className={`text-2xl mr-3 ${statusInfo.color}`}>{statusInfo.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{statusOption}</p>
                          <p className="text-xs text-gray-600">{statusInfo.label}</p>
                        </div>
                      </div>
                      {status === statusOption && (
                        <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {validationError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">Error updating stall</p>
                  <p className="text-sm text-red-700 mt-1">{validationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              {hasChanges ? (
                <span className="flex items-center text-amber-600">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Unsaved changes
                </span>
              ) : (
                <span className="flex items-center text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No changes made
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Reset
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !hasChanges}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Stalls() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StallStatus>('all')
  const [sectionFilter, setSectionFilter] = useState<'all' | string>('all')
  const [sortBy, setSortBy] = useState<'stall_number' | 'section' | 'status' | 'updated_at'>('section')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const sampleStalls: Stall[] = [
    // Eatery Section
    {
      id: '1',
      section_id: '1',
      stall_number: 'E-1',
      location_description: 'Near main entrance',
      status: 'occupied',
      vendor_profile_id: '1',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '1',
        name: 'Eatery',
        code: 'E',
        capacity: 12
      },
      vendor_profile: null // Will be fetched from database
    },
    {
      id: '2',
      section_id: '1',
      stall_number: 'E-2',
      location_description: 'Next to entrance',
      status: 'occupied',
      vendor_profile_id: '2',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '1',
        name: 'Eatery',
        code: 'E',
        capacity: 12
      },
      vendor_profile: null // Will be fetched from database
    },
    {
      id: '3',
      section_id: '1',
      stall_number: 'E-3',
      location_description: 'Corner spot',
      status: 'maintenance',
      vendor_profile_id: null,
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '1',
        name: 'Eatery',
        code: 'E',
        capacity: 12
      }
    },
    // Fruits and Vegetables Section
    {
      id: '4',
      section_id: '2',
      stall_number: 'FV-1',
      location_description: 'Main aisle',
      status: 'occupied',
      vendor_profile_id: '3',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '2',
        name: 'Fruits and Vegetables',
        code: 'FV',
        capacity: 36
      },
      vendor_profile: null // Will be fetched from database
    },
    {
      id: '5',
      section_id: '2',
      stall_number: 'FV-2',
      location_description: 'Center aisle',
      status: 'occupied',
      vendor_profile_id: '4',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '2',
        name: 'Fruits and Vegetables',
        code: 'FV',
        capacity: 36
      },
      vendor_profile: null // Will be fetched from database
    },
    {
      id: '6',
      section_id: '2',
      stall_number: 'FV-3',
      location_description: 'Near loading area',
      status: 'vacant',
      vendor_profile_id: null,
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '2',
        name: 'Fruits and Vegetables',
        code: 'FV',
        capacity: 36
      }
    },
    // Dried Fish Section
    {
      id: '7',
      section_id: '3',
      stall_number: 'DF-1',
      location_description: 'Front row',
      status: 'occupied',
      vendor_profile_id: '5',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '3',
        name: 'Dried Fish',
        code: 'DF',
        capacity: 24
      },
      vendor_profile: null // Will be fetched from database
    },
    {
      id: '8',
      section_id: '3',
      stall_number: 'DF-2',
      location_description: 'Middle row',
      status: 'maintenance',
      vendor_profile_id: null,
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '3',
        name: 'Dried Fish',
        code: 'DF',
        capacity: 24
      }
    },
    // Grocery Section
    {
      id: '9',
      section_id: '4',
      stall_number: 'G-1',
      location_description: 'Prime corner spot',
      status: 'occupied',
      vendor_profile_id: '6',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '4',
        name: 'Grocery',
        code: 'G',
        capacity: 14
      },
      vendor_profile: null // Will be fetched from database
    },
    // Rice and Grains Section
    {
      id: '10',
      section_id: '5',
      stall_number: 'RG-1',
      location_description: 'Near entrance',
      status: 'occupied',
      vendor_profile_id: '7',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '5',
        name: 'Rice and Grains',
        code: 'RG',
        capacity: 20
      },
      vendor_profile: null // Will be fetched from database
    },
    {
      id: '11',
      section_id: '5',
      stall_number: 'RG-2',
      location_description: 'Back area',
      status: 'vacant',
      vendor_profile_id: null,
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '5',
        name: 'Rice and Grains',
        code: 'RG',
        capacity: 20
      }
    },
    // Fish Section
    {
      id: '12',
      section_id: '6',
      stall_number: 'F-1',
      location_description: 'Near ice storage',
      status: 'occupied',
      vendor_profile_id: '8',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '6',
        name: 'Fish',
        code: 'F',
        capacity: 72
      },
      vendor_profile: null // Will be fetched from database
    },
    // Meat Section
    {
      id: '13',
      section_id: '7',
      stall_number: 'M-1',
      location_description: 'Front section',
      status: 'occupied',
      vendor_profile_id: '9',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '7',
        name: 'Meat',
        code: 'M',
        capacity: 72
      },
      vendor_profile: null // Will be fetched from database
    },
    // Variety Section
    {
      id: '14',
      section_id: '8',
      stall_number: 'V-1',
      location_description: 'Central location',
      status: 'occupied',
      vendor_profile_id: '10',
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '8',
        name: 'Variety',
        code: 'V',
        capacity: 14
      },
      vendor_profile: null // Will be fetched from database
    },
    {
      id: '15',
      section_id: '8',
      stall_number: 'V-2',
      location_description: 'Near exit',
      status: 'maintenance',
      vendor_profile_id: null,
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      market_section: {
        id: '8',
        name: 'Variety',
        code: 'V',
        capacity: 14
      }
    }
  ]

  const [stalls, setStalls] = useState<Stall[]>(sampleStalls)
  const sampleMarketSections: MarketSection[] = [
    { id: '1', name: 'Eatery', code: 'E', capacity: 12 },
    { id: '2', name: 'Fruits and Vegetables', code: 'FV', capacity: 36 },
    { id: '3', name: 'Dried Fish', code: 'DF', capacity: 24 },
    { id: '4', name: 'Grocery', code: 'G', capacity: 14 },
    { id: '5', name: 'Rice and Grains', code: 'RG', capacity: 20 },
    { id: '6', name: 'Fish', code: 'F', capacity: 72 },
    { id: '7', name: 'Meat', code: 'M', capacity: 72 },
    { id: '8', name: 'Variety', code: 'V', capacity: 14 },
    { id: '9', name: 'Ambot', code: 'A', capacity: 10 }
  ]

  const [marketSections, setMarketSections] = useState<MarketSection[]>(sampleMarketSections)
  const [loading, setLoading] = useState(false)

  // Log to verify data
  useEffect(() => {
    console.log('Current stalls:', stalls)
    console.log('Current market sections:', marketSections)
  }, [stalls, marketSections])

  const fetchMarketSections = async () => {
    try {
      const { data, error } = await supabase
        .from('market_sections')
        .select('*')
        .order('name')

      if (error) throw error

      // Always use database data if it exists, even if empty
      if (data) {
        console.log('Fetched market sections from database:', data)
        setMarketSections(data)
      } else {
        // Only fallback to sample data if data is null
        console.log('No data returned, using sample data')
        setMarketSections(sampleMarketSections)
      }
    } catch (error) {
      console.error('Error fetching market sections:', error)
      // Use sample data as fallback only on error
      setMarketSections(sampleMarketSections)
    }
  }

  const fetchStalls = async () => {
    try {
      // Fetch stalls first, then manually join the related data
      const { data: stallsData, error: stallsError } = await supabase
        .from('stalls')
        .select('*')
        .order('stall_number')

      if (stallsError) throw stallsError

      console.log('Raw stalls data:', stallsData)

      // Fetch market sections separately
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('market_sections')
        .select('*')

      if (sectionsError) {
        console.warn('Could not fetch market sections:', sectionsError)
      }

      // Fetch vendor profiles for stalls that have vendor_profile_id
      const stallsWithVendors = stallsData?.filter((stall: any) => stall.vendor_profile_id) || []
      const vendorIds = stallsWithVendors.map((stall: any) => stall.vendor_profile_id)

      let vendorsData: any[] = []
      if (vendorIds.length > 0) {
        const { data: vendorsResult, error: vendorsError } = await supabase
          .from('vendor_profiles')
          .select('id, business_name, first_name, last_name')
          .in('id', vendorIds)

        if (vendorsError) {
          console.warn('Could not fetch vendor profiles:', vendorsError)
        } else {
          vendorsData = vendorsResult || []
        }
      }

      console.log('Market sections:', sectionsData)
      console.log('Vendor profiles:', vendorsData)

      if (stallsData) {
        // Map the data to match our interface by manually joining the relations
        const mappedData = stallsData.map((stall: any) => ({
          ...stall,
          market_section: sectionsData?.find((section: any) => section.id === stall.section_id),
          vendor_profile: vendorsData.find((vendor: any) => vendor.id === stall.vendor_profile_id) || null
        }))

        console.log(`Fetched ${mappedData.length} stalls from database:`, mappedData)
        setStalls(mappedData)

        // Log some debugging info about vendor assignments
        const occupiedStalls = mappedData.filter((s: any) => s.status === 'occupied')
        const stallsWithVendorProfiles = mappedData.filter((s: any) => s.vendor_profile_id)
        console.log(`Occupied stalls: ${occupiedStalls.length}, Stalls with vendor profiles: ${stallsWithVendorProfiles.length}`)
      } else {
        // If no database data, use sample data
        console.log('No stalls data returned from database, using sample data')
        setStalls(sampleStalls)
      }
    } catch (error) {
      console.error('Error fetching stalls:', error)
      // Fall back to sample data if there's an error
      setStalls(sampleStalls)
    }
  }

  const handleAddStall = async (newStall: NewStall) => {
    try {
      console.log('Attempting to add stall:', newStall)

      const { data, error } = await supabase
        .from('stalls')
        .insert([{
          section_id: newStall.section_id,
          stall_number: newStall.stall_number,
          location_description: newStall.location_description,
          status: newStall.status ?? 'vacant',
          vendor_profile_id: null
        }] as any)
        .select()

      console.log('Insert result:', { data, error })

      if (error) {
        console.error('Detailed error:', error)
        throw error
      }

      // Refresh stalls from database after successful add
      if (data && data.length > 0) {
        await fetchStalls()
      }
    } catch (error) {
      console.error('Error adding stall:', error)
      throw error
    }
  }

  const handleUpdateStall = async (stallId: string, updates: Partial<Stall>) => {
    try {
      console.log('Attempting to update stall:', stallId, updates)

      // Build update object with only provided fields
      const updateData: any = {}
      if (updates.stall_number !== undefined) updateData.stall_number = updates.stall_number
      if (updates.section_id !== undefined) updateData.section_id = updates.section_id
      if (updates.location_description !== undefined) updateData.location_description = updates.location_description
      if (updates.status !== undefined) updateData.status = updates.status

      const { data, error } = await (supabase as any)
        .from('stalls')
        .update(updateData)
        .eq('id', stallId)
        .select()

      console.log('Update result:', { data, error })

      if (error) {
        console.error('Detailed error:', error)
        throw error
      }

      // Always refresh stalls from database after successful update to get latest vendor assignments
      await fetchStalls()
    } catch (error) {
      console.error('Error updating stall:', error)
      throw error
    }
  }

  const handleEditStall = (stall: Stall) => {
    setSelectedStall(stall)
    setIsEditModalOpen(true)
  }

  // Handle URL parameters for section filtering
  useEffect(() => {
    const sectionParam = searchParams.get('section')
    if (sectionParam && sectionParam !== sectionFilter) {
      setSectionFilter(sectionParam)
      console.log('Setting section filter from URL parameter:', sectionParam)

      // Optional: Auto-sort by stall number when filtering by section for better UX
      if (sortBy !== 'stall_number') {
        setSortBy('stall_number')
        setSortOrder('asc')
      }
    }
  }, [searchParams])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchMarketSections(),
          fetchStalls()
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('search') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }
      // Escape to clear search/filters
      if (e.key === 'Escape' && (searchQuery || statusFilter !== 'all' || sectionFilter !== 'all')) {
        clearFilters()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [searchQuery, statusFilter, sectionFilter])

  // Filter and search stalls
  const filteredStalls = stalls.filter((stall) => {
    const matchesSearch = searchQuery === '' ||
      stall.stall_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.market_section?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.market_section?.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stall.location_description && stall.location_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (stall.vendor_profile?.business_name && stall.vendor_profile.business_name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || stall.status === statusFilter

    const matchesSection = sectionFilter === 'all' || stall.section_id === sectionFilter

    return matchesSearch && matchesStatus && matchesSection
  }).sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortBy) {
      case 'stall_number':
        // Extract numeric part for proper numeric sorting
        const aNum = parseInt(a.stall_number.split('-')[1]) || 0
        const bNum = parseInt(b.stall_number.split('-')[1]) || 0
        aValue = aNum
        bValue = bNum
        break
      case 'section':
        aValue = a.market_section?.name || ''
        bValue = b.market_section?.name || ''
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'updated_at':
        aValue = new Date(a.updated_at).getTime()
        bValue = new Date(b.updated_at).getTime()
        break
      default:
        aValue = a.market_section?.name || ''
        bValue = b.market_section?.name || ''
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  // Clear filters function
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSectionFilter('all')
    // Remove section parameter from URL if it exists
    if (searchParams.get('section')) {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('section')
      setSearchParams(newSearchParams, { replace: true })
    }
  }

  // Handle sort
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  // Get unique sections for filter dropdown
  const availableSections = Array.from(
    new Set(stalls.map(stall => stall.section_id))
  ).map(sectionId => {
    const section = marketSections.find(s => s.id === sectionId)
    return section ? { id: section.id, name: section.name, code: section.code } : null
  }).filter(Boolean) as { id: string; name: string; code: string }[]


  // Calculate stats
  const stats = {
    total: filteredStalls.length,
    vacant: filteredStalls.filter(s => s.status === 'vacant').length,
    occupied: filteredStalls.filter(s => s.status === 'occupied').length,
    maintenance: filteredStalls.filter(s => s.status === 'maintenance').length
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-gray-900">Stall Management</h1>
            {sectionFilter !== 'all' && marketSections.find(s => s.id === sectionFilter) && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
                {marketSections.find(s => s.id === sectionFilter)?.name} ({marketSections.find(s => s.id === sectionFilter)?.code})
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-700">
            {sectionFilter !== 'all' && marketSections.find(s => s.id === sectionFilter)
              ? `Showing stalls in ${marketSections.find(s => s.id === sectionFilter)?.name} section`
              : 'Manage and assign market stalls to vendors'
            }
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex space-x-3">
          {sectionFilter !== 'all' && (
            <button
              type="button"
              onClick={() => navigate('/admin/market/sections')}
              className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
            >
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sections
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Add Stalls
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Stalls
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-16 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by stall number, section, location, or vendor..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | StallStatus)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label htmlFor="sectionFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              id="sectionFilter"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Sections</option>
              {availableSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name} ({section.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary and Clear */}
        {(searchQuery || statusFilter !== 'all' || sectionFilter !== 'all') && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Filters active:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchQuery}"
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {statusFilter}
                </span>
              )}
              {sectionFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Section: {availableSections.find(s => s.id === sectionFilter)?.name}
                </span>
              )}
              <span className="text-gray-500">
                ({filteredStalls.length} of {stalls.length} stalls)
              </span>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredStalls.length}</span> of{' '}
            <span className="font-medium">{stalls.length}</span> stalls
          </div>
          {stats.total > 0 && (
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                <span className="text-gray-600">Vacant: {stats.vacant}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-gray-600">Occupied: {stats.occupied}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-gray-600">Maintenance: {stats.maintenance}</span>
              </div>
            </div>
          )}
        </div>
        {filteredStalls.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="stall_number">Stall Number</option>
              <option value="section">Section</option>
              <option value="status">Status</option>
              <option value="updated_at">Last Updated</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-gray-400 hover:text-gray-500"
            >
              {sortOrder === 'asc' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    <button
                      type="button"
                      onClick={() => handleSort('stall_number')}
                      className="group inline-flex items-center hover:text-gray-700"
                    >
                      Stall Number
                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-500">
                        {sortBy === 'stall_number' ? (
                          sortOrder === 'asc' ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )
                        ) : (
                          <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <button
                      type="button"
                      onClick={() => handleSort('status')}
                      className="group inline-flex items-center hover:text-gray-700"
                    >
                      Status
                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-500">
                        {sortBy === 'status' ? (
                          sortOrder === 'asc' ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )
                        ) : (
                          <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Assigned Vendor
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        <span className="ml-2 text-gray-600">Loading stalls...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStalls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="mt-2 text-sm">
                          {stalls.length === 0 ? 'No stalls found' : 'No stalls match your search criteria'}
                        </p>
                        {stalls.length > 0 && (
                          <button
                            onClick={clearFilters}
                            className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                          >
                            Clear filters to see all stalls
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStalls.map((stall) => (
                    <tr key={stall.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-0 w-64">
                        <div className="flex items-center">
                          <div className="h-8 w-12 flex-shrink-0 rounded bg-indigo-100 flex items-center justify-center">
                            <span className="font-medium text-indigo-700 text-sm">{stall.stall_number}</span>
                          </div>
                          <div className="ml-4 min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">{stall.market_section?.name}</div>
                            <div className="text-xs text-gray-500">Section Code: {stall.market_section?.code || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm">
                        <div className="text-gray-900 font-medium">
                          {stall.location_description?.trim() || 'No description provided'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(stall.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${stall.status === 'vacant'
                          ? 'bg-green-100 text-green-800'
                          : stall.status === 'occupied'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${stall.status === 'vacant'
                            ? 'bg-green-600'
                            : stall.status === 'occupied'
                              ? 'bg-blue-600'
                              : 'bg-yellow-600'
                            } mr-1.5`}></span>
                          {stall.status ? stall.status.charAt(0).toUpperCase() + stall.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm">
                        {stall.vendor_profile ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              {stall.vendor_profile.business_name ||
                                `${stall.vendor_profile.first_name} ${stall.vendor_profile.last_name}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {stall.vendor_profile.business_name ?
                                `Owner: ${stall.vendor_profile.first_name} ${stall.vendor_profile.last_name}` :
                                `ID: ${stall.vendor_profile.id.substring(0, 8)}...`}
                            </div>
                          </div>
                        ) : stall.status === 'occupied' ? (
                          <span className="text-orange-500 font-medium">Occupied (No vendor data)</span>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          type="button"
                          onClick={() => handleEditStall(stall)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddStallModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStall}
        marketSections={marketSections}
        onRefreshSections={fetchMarketSections}
      />

      <EditStallModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateStall}
        stall={selectedStall}
      />
    </div>
  )
}
