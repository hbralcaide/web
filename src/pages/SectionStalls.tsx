import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Stall {
  id: string
  section_id: string
  stall_number: string
  location_description: string | null
  status: 'vacant' | 'occupied' | 'maintenance'
  vendor_profile_id: string | null
  created_at: string
  updated_at: string
  vendor_profile?: {
    id: string
    business_name: string
  } | null
}

type StallStatus = 'vacant' | 'occupied' | 'maintenance'

interface MarketSection {
  id: string
  name: string
  code: string
  capacity: number
}

interface EditStallModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (stallId: string, updates: Partial<Stall>) => Promise<void>
  stall: Stall | null
  marketSections: MarketSection[]
  currentSectionName: string
}

function EditStallModal({ isOpen, onClose, onUpdate, stall, marketSections, currentSectionName }: EditStallModalProps) {
  const [selectedSection, setSelectedSection] = useState<MarketSection | null>(null)
  const [stallNumber, setStallNumber] = useState(1)
  const [locationDesc, setLocationDesc] = useState('')
  const [status, setStatus] = useState<StallStatus>('vacant')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  
  // Initialize form with stall data
  useEffect(() => {
    if (isOpen && stall) {
      const section = marketSections.find(s => s.id === stall.section_id)
      setSelectedSection(section || null)
      
      // Extract number from stall_number (e.g., "A-1" -> 1)
      const numberMatch = stall.stall_number.match(/-(\d+)$/)
      setStallNumber(numberMatch ? parseInt(numberMatch[1]) : 1)
      
      setLocationDesc(stall.location_description || '')
      setStatus(stall.status)
      setValidationError(null)
    }
  }, [isOpen, stall, marketSections])

  if (!isOpen || !stall) return null

  const validateStallNumber = (section: MarketSection, number: number): boolean => {
    return number >= 1 && number <= section.capacity
  }

  const incrementStallNumber = () => {
    if (selectedSection && stallNumber < selectedSection.capacity) {
      setStallNumber(stallNumber + 1)
    }
  }

  const decrementStallNumber = () => {
    if (stallNumber > 1) {
      setStallNumber(stallNumber - 1)
    }
  }

  const handleStallNumberChange = (value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && selectedSection) {
      if (numValue >= 1 && numValue <= selectedSection.capacity) {
        setStallNumber(numValue)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSection) {
      setValidationError('Please select a section')
      return
    }

    if (!validateStallNumber(selectedSection, stallNumber)) {
      setValidationError(`Invalid stall number. Must be between 1 and ${selectedSection.capacity}`)
      return
    }

    setLoading(true)
    try {
      const fullStallNumber = `${selectedSection.code}-${stallNumber}`
      await onUpdate(stall.id, {
        section_id: selectedSection.id,
        stall_number: fullStallNumber,
        location_description: locationDesc || null,
        status
      })
      onClose()
    } catch (error) {
      console.error('Error updating stall:', error)
      setValidationError('Failed to update stall')
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
            <h2 className="text-xl font-semibold text-gray-900">Edit Stall in {currentSectionName}</h2>
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
          {/* Current Stall Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Current Stall</h3>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Number:</span> {stall.stall_number}</p>
              <p><span className="font-medium">Section:</span> {currentSectionName}</p>
              <p><span className="font-medium">Status:</span> {stall.status}</p>
            </div>
          </div>

          {/* Section Selection */}
          <div className="space-y-2">
            <label htmlFor="edit-section" className="block text-sm font-medium text-gray-700">
              Market Section
            </label>
            <select
              id="edit-section"
              value={selectedSection?.id || ''}
              onChange={(e) => {
                const section = marketSections.find(s => s.id === e.target.value)
                setSelectedSection(section || null)
                if (section) setStallNumber(1)
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a section</option>
              {marketSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name} ({section.code}) - Capacity: {section.capacity}
                </option>
              ))}
            </select>
          </div>

          {/* Stall Number with Plus/Minus */}
          <div className="space-y-2">
            <label htmlFor="edit-stallNumber" className="block text-sm font-medium text-gray-700">
              Stall Number
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={decrementStallNumber}
                disabled={!selectedSection || stallNumber <= 1}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="text"
                id="edit-stallNumber"
                value={stallNumber}
                onChange={(e) => handleStallNumberChange(e.target.value)}
                disabled={!selectedSection}
                className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                placeholder="0"
              />
              <button
                type="button"
                onClick={incrementStallNumber}
                disabled={!selectedSection || stallNumber >= selectedSection.capacity}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            {selectedSection && (
              <p className="text-xs text-gray-500">
                Format: {selectedSection.code}-{stallNumber} (Range: 1 to {selectedSection.capacity})
              </p>
            )}
          </div>

          {/* Location Description */}
          <div className="space-y-2">
            <label htmlFor="edit-locationDesc" className="block text-sm font-medium text-gray-700">
              Location Description
            </label>
            <textarea
              id="edit-locationDesc"
              value={locationDesc}
              onChange={(e) => setLocationDesc(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Optional: Add specific location details"
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StallStatus)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="vacant">● Vacant</option>
              <option value="occupied">● Occupied</option>
              <option value="maintenance">● Maintenance</option>
            </select>
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
              {loading ? 'Updating...' : 'Update Stall'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SectionStalls() {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const [stalls, setStalls] = useState<Stall[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionName, setSectionName] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)
  const [marketSections, setMarketSections] = useState<MarketSection[]>([])

  useEffect(() => {
    const fetchSectionDetails = async () => {
      try {
        if (!sectionId) return

        // Fetch section name
        const { data: sectionData, error: sectionError } = await supabase
          .from('market_sections')
          .select('name')
          .eq('id', sectionId)
          .single()

        if (sectionError) throw sectionError
        if (sectionData) {
          setSectionName((sectionData as { name: string }).name)
        }

        // Fetch stalls for this section
        const { data: stallsData, error: stallsError } = await supabase
          .from('stalls')
          .select(`
            *,
            vendor_profile:vendor_profile_id (
              id,
              business_name
            )
          `)
          .eq('section_id', sectionId)
          .order('stall_number')

        if (stallsError) throw stallsError
        if (stallsData) {
          setStalls(stallsData as Stall[])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchMarketSections = async () => {
      try {
        const { data, error } = await supabase
          .from('market_sections')
          .select('id, name, code, capacity')
          .order('name')

        if (error) throw error
        setMarketSections(data as MarketSection[])
      } catch (error) {
        console.error('Error loading market sections:', error)
      }
    }

    fetchSectionDetails()
    fetchMarketSections()
  }, [sectionId])

  const handleEditStall = (stall: Stall) => {
    setSelectedStall(stall)
    setEditModalOpen(true)
  }

  const handleUpdateStall = async (stallId: string, updates: Partial<Stall>) => {
    try {
      const { error } = await (supabase as any)
        .from('stalls')
        .update({
          section_id: updates.section_id,
          stall_number: updates.stall_number,
          location_description: updates.location_description,
          status: updates.status
        })
        .eq('id', stallId)

      if (error) throw error

      // Update local state
      setStalls(prevStalls => 
        prevStalls.map(stall => 
          stall.id === stallId 
            ? { ...stall, ...updates }
            : stall
        )
      )
    } catch (error) {
      console.error('Error updating stall:', error)
      throw error
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vacant':
        return 'bg-green-100 text-green-800'
      case 'occupied':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stalls in {sectionName}</h1>
          <p className="text-gray-600">View and manage stalls in this market section</p>
        </div>
        <button
          onClick={() => navigate('/admin/market-sections')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          ← Back to Sections
        </button>
      </div>

      {/* Stalls Grid */}
      {stalls.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stalls</h3>
          <p className="mt-1 text-sm text-gray-500">No stalls found in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stalls.map((stall) => (
            <div key={stall.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stall.stall_number}</h3>
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(stall.status)}`}>
                    {stall.status}
                  </span>
                </div>
                
                {stall.location_description && (
                  <p className="text-sm text-gray-600 mb-3">{stall.location_description}</p>
                )}
                
                {stall.vendor_profile && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900">Vendor:</p>
                    <p className="text-sm text-gray-600">{stall.vendor_profile.business_name}</p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditStall(stall)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditStallModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedStall(null)
        }}
        onUpdate={handleUpdateStall}
        stall={selectedStall}
        marketSections={marketSections}
        currentSectionName={sectionName}
      />
    </div>
  )
}
