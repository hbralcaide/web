import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type SectionStatus = 'active' | 'inactive' | 'maintenance'

interface MarketSection {
  id: string
  name: string
  code: string
  capacity: number
  description: string
  status: SectionStatus
  created_at: string
  updated_at: string
  // Computed fields
  total_stalls?: number
  occupied_stalls?: number
  vacant_stalls?: number
  maintenance_stalls?: number
}



interface SectionTemplate {
  name: string
  code: string
  defaultCapacity: number
}

interface AddSectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (section: Omit<MarketSection, 'id' | 'stalls_count'>) => void
}

function AddSectionModal({ isOpen, onClose, onAdd }: AddSectionModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [capacity, setCapacity] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Dropdown states
  const [sectionTemplates, setSectionTemplates] = useState<SectionTemplate[]>([])
  const [codeTemplates, setCodeTemplates] = useState<string[]>([])
  const [filteredNameOptions, setFilteredNameOptions] = useState<SectionTemplate[]>([])
  const [filteredCodeOptions, setFilteredCodeOptions] = useState<string[]>([])
  const [showNameDropdown, setShowNameDropdown] = useState(false)
  const [showCodeDropdown, setShowCodeDropdown] = useState(false)

  // Fetch existing sections for dropdown options
  useEffect(() => {
    if (isOpen) {
      fetchSectionTemplates()
    }
  }, [isOpen])

  const fetchSectionTemplates = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('market_sections')
        .select('name, code, capacity')
        .order('name')

      if (error) throw error

      const templates: SectionTemplate[] = data?.map((item: any) => ({
        name: item.name,
        code: item.code,
        defaultCapacity: item.capacity
      })) || []

      // Add some default templates if none exist
      const defaultTemplates: SectionTemplate[] = [
        { name: 'Eatery', code: 'E', defaultCapacity: 12 },
        { name: 'Fruits and Vegetables', code: 'FV', defaultCapacity: 36 },
        { name: 'Dried Fish', code: 'DF', defaultCapacity: 24 },
        { name: 'Grocery', code: 'G', defaultCapacity: 14 },
        { name: 'Rice and Grains', code: 'RG', defaultCapacity: 20 },
        { name: 'Fish', code: 'F', defaultCapacity: 72 },
        { name: 'Meat', code: 'M', defaultCapacity: 72 },
        { name: 'Variety', code: 'V', defaultCapacity: 14 },
        { name: 'Hardware', code: 'HW', defaultCapacity: 10 },
        { name: 'Clothing', code: 'CL', defaultCapacity: 16 },
      ]

      // Merge and deduplicate
      const allTemplates = [...templates]
      defaultTemplates.forEach(defaultTemplate => {
        if (!templates.some(t => t.name === defaultTemplate.name)) {
          allTemplates.push(defaultTemplate)
        }
      })

      setSectionTemplates(allTemplates)
      setCodeTemplates(allTemplates.map(t => t.code))
      setFilteredNameOptions(allTemplates)
      setFilteredCodeOptions(allTemplates.map(t => t.code))
    } catch (error) {
      console.error('Error fetching section templates:', error)
    }
  }

  const handleNameChange = (value: string) => {
    setName(value)

    // Filter name options
    const filtered = sectionTemplates.filter(template =>
      template.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredNameOptions(filtered)
    setShowNameDropdown(true)

    // Auto-fill code and capacity if exact match
    const exactMatch = sectionTemplates.find(
      template => template.name.toLowerCase() === value.toLowerCase()
    )
    if (exactMatch) {
      setCode(exactMatch.code)
      setCapacity(exactMatch.defaultCapacity.toString())
    }
  }

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase()
    setCode(upperValue)

    // Filter code options
    const filtered = codeTemplates.filter(codeTemplate =>
      codeTemplate.includes(upperValue)
    )
    setFilteredCodeOptions(filtered)
    setShowCodeDropdown(true)

    // Auto-fill name and capacity if exact match
    const exactMatch = sectionTemplates.find(
      template => template.code === upperValue
    )
    if (exactMatch) {
      setName(exactMatch.name)
      setCapacity(exactMatch.defaultCapacity.toString())
    }
  }

  const selectNameOption = (template: SectionTemplate) => {
    setName(template.name)
    setCode(template.code)
    setCapacity(template.defaultCapacity.toString())
    setShowNameDropdown(false)
  }

  const selectCodeOption = (selectedCode: string) => {
    const template = sectionTemplates.find(t => t.code === selectedCode)
    if (template) {
      setName(template.name)
      setCode(template.code)
      setCapacity(template.defaultCapacity.toString())
    } else {
      setCode(selectedCode)
    }
    setShowCodeDropdown(false)
  }

  const incrementCapacity = () => {
    const current = parseInt(capacity) || 0
    setCapacity((current + 1).toString())
  }

  const decrementCapacity = () => {
    const current = parseInt(capacity) || 0
    if (current > 1) {
      setCapacity((current - 1).toString())
    }
  }

  const handleCapacityChange = (value: string) => {
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setCapacity(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!name.trim() || !code.trim() || !capacity || !description.trim()) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
      setError('Capacity must be a positive number')
      setLoading(false)
      return
    }

    try {
      await onAdd({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        capacity: Number(capacity),
        description: description.trim(),
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Reset form
      setName('')
      setCode('')
      setCapacity('')
      setDescription('')
      setError(null)
      onClose()
    } catch (error) {
      setError('Failed to add section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNameDropdown(false)
      setShowCodeDropdown(false)
    }
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add New Section</h2>
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
          {/* Section Name with Dropdown */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Section Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => setShowNameDropdown(true)}
                onClick={(e) => e.stopPropagation()}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type or select a section name"
                autoComplete="off"
              />
              {showNameDropdown && filteredNameOptions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredNameOptions.map((template, index) => (
                    <div
                      key={`${template.code}-${index}`}
                      className="px-3 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-900 text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectNameOption(template)
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-gray-500">{template.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section Code with Dropdown */}
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Section Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                onFocus={() => setShowCodeDropdown(true)}
                onClick={(e) => e.stopPropagation()}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter section code (e.g., FV)"
                maxLength={3}
              />
              {showCodeDropdown && filteredCodeOptions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredCodeOptions.map((codeOption, index) => (
                    <div
                      key={`${codeOption}-${index}`}
                      className="px-3 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-900 text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectCodeOption(codeOption)
                      }}
                    >
                      {codeOption}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Capacity with Plus/Minus */}
          <div className="space-y-2">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Total Capacity
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={decrementCapacity}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="text"
                id="capacity"
                value={capacity}
                onChange={(e) => handleCapacityChange(e.target.value)}
                className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0"
              />
              <button
                type="button"
                onClick={incrementCapacity}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500">Number of stalls this section can accommodate</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Brief description of what this section contains"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="ml-3 text-sm text-red-800">{error}</p>
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
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MarketSections() {
  const [sections, setSections] = useState<MarketSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | SectionStatus>('all')
  const [occupancyFilter, setOccupancyFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'capacity' | 'occupancy' | 'updated_at'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      // Fetch sections and stalls in parallel
      const [sectionsResponse, stallsResponse] = await Promise.all([
        supabase.from('market_sections').select('*').order('name'),
        supabase.from('stalls').select('id, stall_number, section_id, status, vendor_profile_id')
      ])

      if (sectionsResponse.error) {
        console.error('Error fetching sections:', sectionsResponse.error)
        return
      }

      if (stallsResponse.error) {
        console.error('Error fetching stalls:', stallsResponse.error)
        return
      }

      const sectionsData = sectionsResponse.data || []
      const stallsData = stallsResponse.data || []

      // Calculate occupancy statistics for each section
      const sectionsWithStats = sectionsData.map((section: any) => {
        const sectionStalls = stallsData.filter((stall: any) => stall.section_id === section.id)
        const occupiedStalls = sectionStalls.filter((stall: any) =>
          stall.status === 'occupied' || stall.vendor_profile_id !== null
        )
        const maintenanceStalls = sectionStalls.filter((stall: any) => stall.status === 'maintenance')
        const vacantStalls = sectionStalls.filter((stall: any) =>
          stall.status === 'vacant' && stall.vendor_profile_id === null
        )

        return {
          ...section,
          total_stalls: sectionStalls.length,
          occupied_stalls: occupiedStalls.length,
          maintenance_stalls: maintenanceStalls.length,
          vacant_stalls: vacantStalls.length
        } as MarketSection
      })

      setSections(sectionsWithStats)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load market sections')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Debug authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('Current user:', user)
      console.log('Auth error:', error)

      if (user) {
        console.log('User ID:', user.id)
        // Check if this user exists in admin_profiles
        const { data: profile, error: profileError } = await (supabase as any)
          .from('admin_profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()

        console.log('Admin profile:', profile)
        console.log('Profile error:', profileError)

        // If no profile exists, create one
        if (!profile && profileError?.code === 'PGRST116') {
          console.log('No admin profile found, creating one...')
          try {
            const { data: newProfile, error: createError } = await (supabase as any)
              .from('admin_profiles')
              .insert({
                auth_user_id: user.id,
                email: user.email,
                first_name: 'Hannah',
                last_name: 'Admin',
                role: 'admin',
                status: 'active'
              })
              .select()
              .single()

            console.log('Created admin profile:', newProfile)
            console.log('Create error:', createError)
          } catch (createError) {
            console.error('Failed to create admin profile:', createError)
          }
        }
      }
    }

    checkAuth()
  }, [])

  const calculateOccupancyRate = (section: MarketSection) => {
    const totalStalls = section.total_stalls || 0
    const occupiedStalls = section.occupied_stalls || 0
    if (totalStalls === 0) return 0
    return (occupiedStalls / totalStalls) * 100
  }

  const getOccupancyStatus = (rate: number) => {
    if (rate >= 90) return { label: 'High', color: 'bg-red-100 text-red-800', barColor: 'bg-red-500' }
    if (rate >= 70) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', barColor: 'bg-yellow-500' }
    if (rate > 0) return { label: 'Low', color: 'bg-green-100 text-green-800', barColor: 'bg-green-500' }
    return { label: 'Empty', color: 'bg-gray-100 text-gray-800', barColor: 'bg-gray-300' }
  }

  const getStatusBadgeColor = (status: SectionStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddSection = async (newSection: Omit<MarketSection, 'id' | 'stalls_count'>) => {
    console.log('=== DEBUG: Starting handleAddSection ===')

    try {
      // First get the current user to ensure we're authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      console.log('Current user:', user)
      console.log('User error:', userError)

      if (userError) {
        console.error('User authentication error:', userError)
        throw new Error(`Authentication error: ${userError.message}`)
      }

      if (!user) {
        console.error('No authenticated user found')
        throw new Error('You must be logged in to add sections')
      }

      // Get the session to check the JWT
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Current session:', session)
      console.log('Session error:', sessionError)

      // Check if user has admin profile
      const { data: adminProfile, error: profileError } = await (supabase as any)
        .from('admin_profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      console.log('Admin profile:', adminProfile)
      console.log('Profile error:', profileError)

      // Test read access first
      console.log('Testing read access to market_sections...')
      const { data: testRead, error: readError } = await (supabase as any)
        .from('market_sections')
        .select('*')
        .limit(1)

      console.log('Read test result:', testRead)
      console.log('Read test error:', readError)

      // Now try the insert with detailed logging
      console.log('Attempting to insert section...')
      const insertData = {
        name: newSection.name,
        code: newSection.code,
        capacity: newSection.capacity,
        description: newSection.description,
        status: newSection.status as 'active' | 'inactive' | 'maintenance',
        stalls_count: 0
      }
      console.log('Insert payload:', insertData)

      const { data, error } = await (supabase as any)
        .from('market_sections')
        .insert(insertData)
        .select()
        .single()

      console.log('Insert result data:', data)
      console.log('Insert result error:', error)

      if (error) {
        console.error('Detailed Supabase error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })

        // Provide specific error message for RLS policy issues
        if (error.code === '42501' && error.message.includes('row-level security policy')) {
          throw new Error('Database permissions need to be updated. The admin role policy needs to be fixed to allow section creation. Please contact your system administrator or check the RLS policies in Supabase.')
        }

        throw error
      }

      if (data) {
        // Refresh all data to get updated statistics
        await fetchData()
        console.log('✅ Section successfully added and data refreshed')
      }
    } catch (error) {
      console.error('=== ERROR in handleAddSection ===')
      console.error('Error details:', error)
      console.error('Error type:', typeof error)
      console.error('Error constructor:', error?.constructor?.name)

      // Re-throw the error so the modal can handle it
      throw error
    }
  }

  // Filter and search sections with enhanced logic
  const filteredSections = React.useMemo(() => {
    return sections.filter((section) => {
      const occupancyRate = calculateOccupancyRate(section)

      const matchesSearch = searchQuery === '' ||
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || section.status === statusFilter

      const matchesOccupancy = occupancyFilter === 'all' ||
        (occupancyFilter === 'low' && occupancyRate < 70) ||
        (occupancyFilter === 'medium' && occupancyRate >= 70 && occupancyRate < 90) ||
        (occupancyFilter === 'high' && occupancyRate >= 90)

      return matchesSearch && matchesStatus && matchesOccupancy
    }).sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'code':
          aValue = a.code
          bValue = b.code
          break
        case 'capacity':
          aValue = a.capacity
          bValue = b.capacity
          break
        case 'occupancy':
          aValue = calculateOccupancyRate(a)
          bValue = calculateOccupancyRate(b)
          break
        case 'updated_at':
          aValue = new Date(a.updated_at).getTime()
          bValue = new Date(b.updated_at).getTime()
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [sections, searchQuery, statusFilter, occupancyFilter, sortBy, sortOrder])

  // Clear filters function
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setOccupancyFilter('all')
  }



  // Calculate comprehensive stats for filtered results
  const stats = React.useMemo(() => {
    const totalStalls = filteredSections.reduce((sum, section) => sum + (section.total_stalls || 0), 0)
    const totalOccupied = filteredSections.reduce((sum, section) => sum + (section.occupied_stalls || 0), 0)
    const totalVacant = filteredSections.reduce((sum, section) => sum + (section.vacant_stalls || 0), 0)
    const totalMaintenance = filteredSections.reduce((sum, section) => sum + (section.maintenance_stalls || 0), 0)

    return {
      total: filteredSections.length,
      active: filteredSections.filter(s => s.status === 'active').length,
      inactive: filteredSections.filter(s => s.status === 'inactive').length,
      maintenance: filteredSections.filter(s => s.status === 'maintenance').length,
      totalCapacity: filteredSections.reduce((sum, section) => sum + section.capacity, 0),
      totalStalls,
      totalOccupied,
      totalVacant,
      totalMaintenance,
      averageOccupancy: totalStalls > 0 ? (totalOccupied / totalStalls) * 100 : 0
    }
  }, [filteredSections])

  // Keyboard shortcuts
  React.useEffect(() => {
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
      if (e.key === 'Escape' && (searchQuery || statusFilter !== 'all' || occupancyFilter !== 'all')) {
        clearFilters()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [searchQuery, statusFilter, occupancyFilter])

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Market Sections</h1>
          <p className="mt-2 text-sm text-gray-700">
            Real-time overview of all market sections, occupancy rates, and stall assignments
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex space-x-3">
          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {refreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      {!loading && sections.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sections</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
              {stats.total !== sections.length && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Filtered from {sections.length} total</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Stalls</dt>
                    <dd className="text-lg font-medium text-blue-600">{stats.totalStalls}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Occupied</dt>
                    <dd className="text-lg font-medium text-green-600">{stats.totalOccupied}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Vacant</dt>
                    <dd className="text-lg font-medium text-gray-600">{stats.totalVacant}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Occupancy Rate</dt>
                    <dd className="text-lg font-medium text-indigo-600">{stats.averageOccupancy.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Sections
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
                placeholder="Search by name, code, or description..."
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
              onChange={(e) => setStatusFilter(e.target.value as 'all' | SectionStatus)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Occupancy Filter */}
          <div>
            <label htmlFor="occupancyFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Occupancy
            </label>
            <select
              id="occupancyFilter"
              value={occupancyFilter}
              onChange={(e) => setOccupancyFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Levels</option>
              <option value="low">Low (&lt;70%)</option>
              <option value="medium">Medium (70-89%)</option>
              <option value="high">High (≥90%)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary and Clear */}
        {(searchQuery || statusFilter !== 'all' || occupancyFilter !== 'all') && (
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
              {occupancyFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Occupancy: {occupancyFilter}
                </span>
              )}
              <span className="text-gray-500">
                ({filteredSections.length} of {sections.length} sections)
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
            Showing <span className="font-medium">{filteredSections.length}</span> of{' '}
            <span className="font-medium">{sections.length}</span> sections
          </div>
          {stats.total > 0 && (
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                <span className="text-gray-600">Active: {stats.active}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-gray-500 mr-1"></div>
                <span className="text-gray-600">Inactive: {stats.inactive}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-gray-600">Maintenance: {stats.maintenance}</span>
              </div>
            </div>
          )}
        </div>
        {filteredSections.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="name">Name</option>
              <option value="code">Code</option>
              <option value="capacity">Capacity</option>
              <option value="occupancy">Occupancy</option>
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

      {error ? (
        <div className="mt-8 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Sections</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  fetchData()
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="mt-8 flex items-center justify-center h-64">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-2 text-gray-600">Loading sections...</span>
          </div>
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium">
              {sections.length === 0 ? 'No sections found' : 'No sections match your search criteria'}
            </p>
            {sections.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Clear filters to see all sections
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSections.map((section) => {
            const occupancyRate = calculateOccupancyRate(section)
            const occupancyStatus = getOccupancyStatus(occupancyRate)
            const statusBadgeColor = getStatusBadgeColor(section.status)

            return (
              <div
                key={section.id}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{section.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{section.description}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 text-sm font-bold">
                      {section.code}
                    </span>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Stalls</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{section.total_stalls || 0}</dd>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <dt className="text-xs font-medium text-green-600 uppercase tracking-wide">Occupied</dt>
                    <dd className="mt-1 text-xl font-bold text-green-700">{section.occupied_stalls || 0}</dd>
                  </div>
                </div>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Vacant</div>
                    <div className="text-sm font-semibold text-gray-700">{section.vacant_stalls || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Maintenance</div>
                    <div className="text-sm font-semibold text-yellow-600">{section.maintenance_stalls || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Capacity</div>
                    <div className="text-sm font-semibold text-indigo-600">{section.capacity}</div>
                  </div>
                </div>

                {/* Occupancy Rate */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Occupancy Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${occupancyStatus.color}`}>
                        {occupancyStatus.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{occupancyRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${occupancyStatus.barColor} transition-all duration-300`}
                      style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Updated {new Date(section.updated_at).toLocaleDateString()}
                  </div>
                  <Link
                    to={`/admin/market/stalls?section=${section.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    View Stalls
                    <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSection}
      />
    </div>
  )
}