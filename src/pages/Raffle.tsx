import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface VendorProfile {
    id: string
    first_name: string
    last_name: string
    business_name: string
    application_number: string
    stall_number: string
    category: string
    sectionName: string
    sectionCode: string
}

interface StallWithApplicants {
    id: string
    stall_number: string
    market_sections: {
        name: string
        code: string
    }
    applicants: {
        id: string
        first_name: string
        last_name: string
        business_name: string
    }[]
}

export default function Raffle() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [vendor, setVendor] = useState<VendorProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [availableStalls, setAvailableStalls] = useState<StallWithApplicants[]>([])
    const [selectedStall, setSelectedStall] = useState<StallWithApplicants | null>(null)
    const [selectedApplicant, setSelectedApplicant] = useState<{ id: string, first_name: string, last_name: string, business_name: string } | null>(null)
    const [raffling, setRaffling] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [showWinnerModal, setShowWinnerModal] = useState(false)

    const vendorId = searchParams.get('vendorId')

    // Your existing fetch functions remain the same
    const fetchVendorData = async () => {
        try {
            setLoading(true)

            const { data: vendorApp, error: vendorError } = await (supabase as any)
                .from('vendor_applications')
                .select(`
          *,
          stall_applications (
            *,
            stalls (
              *
            )
          )
        `)
                .eq('id', vendorId)
                .single()

            if (vendorError) {
                console.error('Error fetching vendor:', vendorError)
                alert('Failed to load vendor data')
                navigate('/admin/vendors')
                return
            }

            const transformedVendor: VendorProfile = {
                id: vendorApp.id,
                first_name: vendorApp.first_name || '',
                last_name: vendorApp.last_name || '',
                business_name: vendorApp.business_name || '',
                application_number: vendorApp.application_number,
                stall_number: vendorApp.stall_applications?.[0]?.stalls?.stall_number || '',
                category: '',
                sectionName: '',
                sectionCode: ''
            }

            if (transformedVendor.stall_number) {
                if (transformedVendor.stall_number.startsWith('F-')) {
                    transformedVendor.sectionName = 'Fish'
                    transformedVendor.sectionCode = 'F'
                } else if (transformedVendor.stall_number.startsWith('FV-')) {
                    transformedVendor.sectionName = 'Fruits & Vegetables'
                    transformedVendor.sectionCode = 'FV'
                } else if (transformedVendor.stall_number.startsWith('M-')) {
                    transformedVendor.sectionName = 'Meat'
                    transformedVendor.sectionCode = 'M'
                } else if (transformedVendor.stall_number.startsWith('G-')) {
                    transformedVendor.sectionName = 'General Merchandise'
                    transformedVendor.sectionCode = 'G'
                }
            }

            setVendor(transformedVendor)
        } catch (error) {
            console.error('Error in fetchVendorData:', error)
            alert('An error occurred while loading vendor data')
            navigate('/admin/vendors')
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableStalls = async () => {
        try {
            setLoading(true)

            const { data: stallApplications, error: applicationsError } = await (supabase as any)
                .from('stall_applications')
                .select(`
                    *,
                    vendor_applications (
                        id,
                        first_name,
                        last_name,
                        business_name,
                        status
                    ),
                    stalls (
                        id,
                        stall_number,
                        status,
                        section_id
                    )
                `)

            if (applicationsError) {
                console.error('Error fetching stall applications:', applicationsError)
                return
            }

            const { data: marketSections, error: sectionsError } = await (supabase as any)
                .from('market_sections')
                .select('id, name, code')

            if (sectionsError) {
                console.error('Error fetching market sections:', sectionsError)
                return
            }

            const sectionsMap = new Map()
            if (marketSections) {
                marketSections.forEach((section: any) => {
                    sectionsMap.set(section.id, section)
                })
            }

            const stallsMap = new Map()

            if (stallApplications) {
                stallApplications.forEach((app: any) => {
                    const stall = app.stalls
                    const vendor = app.vendor_applications

                    if (!stall || !vendor) return

                    const stallId = stall.id

                    if (vendor.status !== 'approved_for_raffle') return
                    if (vendor.status === 'won_raffle') return

                    if (!stallsMap.has(stallId)) {
                        const marketSection = sectionsMap.get(stall.section_id)
                        stallsMap.set(stallId, {
                            id: stall.id,
                            stall_number: stall.stall_number,
                            market_sections: marketSection || { name: 'Unknown Section', code: 'UNK' },
                            applicants: []
                        })
                    }

                    const stallData = stallsMap.get(stallId)
                    if (stallData) {
                        stallData.applicants.push({
                            id: vendor.id,
                            first_name: vendor.first_name,
                            last_name: vendor.last_name,
                            business_name: vendor.business_name
                        })
                    }
                })
            }

            const stallsWithApplicants = Array.from(stallsMap.values()).sort((a, b) =>
                a.stall_number.localeCompare(b.stall_number)
            )

            setAvailableStalls(stallsWithApplicants)
        } catch (error) {
            console.error('Error in fetchAvailableStalls:', error)
        } finally {
            setLoading(false)
        }
    }

    // Scroll Selector Functions
    const updateActive = (newIndex: number) => {
        setActiveIndex(newIndex)
    }

    const startAutoSpin = () => {
        if (!selectedStall || selectedStall.applicants.length === 0) return

        setSpinning(true)
        const spinDuration = 4000
        let currentSpinIndex = 0
        const startTime = Date.now()
        let currentInterval = 200
        const minInterval = 50
        const slowdownPoint = 0.7

        function spin() {
            const elapsed = Date.now() - startTime
            const progress = elapsed / spinDuration

            if (progress >= 1) {
                setSpinning(false)
                if (selectedStall) {
                    const finalIndex = Math.floor(Math.random() * selectedStall.applicants.length)
                    setActiveIndex(finalIndex + 1) // +1 to account for START being at index 0
                    setSelectedApplicant(selectedStall.applicants[finalIndex])
                }

                // Show winner highlighted for 1 second then show modal for 2 seconds
                setTimeout(() => {
                    setShowWinnerModal(true)
                    // Auto-close modal after 2 seconds
                    setTimeout(() => {
                        setShowWinnerModal(false)
                    }, 2000)
                }, 1000)
                return
            }

            if (progress < 0.3) {
                currentInterval = Math.max(minInterval, 200 - (progress * 500))
            } else if (progress > slowdownPoint) {
                const slowdownProgress = (progress - slowdownPoint) / (1 - slowdownPoint)
                currentInterval = minInterval + (slowdownProgress * 300)
            }

            if (selectedStall) {
                currentSpinIndex = (currentSpinIndex + 1) % selectedStall.applicants.length
                setActiveIndex(currentSpinIndex + 1) // +1 to skip START during spinning
            }

            setTimeout(spin, currentInterval)
        }

        spin()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!selectedStall || selectedStall.applicants.length === 0) return

        if (e.key === 'ArrowUp' && activeIndex > 0) {
            updateActive(activeIndex - 1)
        } else if (e.key === 'ArrowDown' && activeIndex < selectedStall.applicants.length - 1) {
            updateActive(activeIndex + 1)
        } else if (e.key === 'Enter') {
            if (activeIndex === 0 && selectedStall.applicants[0]?.first_name === 'START') {
                startAutoSpin()
            } else {
                setSelectedApplicant(selectedStall.applicants[activeIndex])
                setShowWinnerModal(true)

                // Auto-close modal after 2 seconds
                setTimeout(() => {
                    setShowWinnerModal(false)
                }, 2000)
            }
        }
    }

    const handleRaffle = async () => {
        if (!selectedStall || !selectedApplicant) return

        try {
            setRaffling(true)

            const certificateData = {
                vendor_id: selectedApplicant.id,
                vendor_name: `${selectedApplicant.first_name} ${selectedApplicant.last_name}`,
                business_name: selectedApplicant.business_name,
                stall_number: selectedStall.stall_number,
                section_name: selectedStall.market_sections?.name || 'Unknown Section',
                assigned_date: new Date().toISOString(),
                certificate_number: `CERT-${Date.now()}-${selectedStall.stall_number.replace('-', '')}`,
                raffle_conducted_by: 'Admin',
                status: 'active'
            }

            const { error: updateError } = await (supabase as any)
                .from('vendor_applications')
                .update({
                    status: 'won_raffle',
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedApplicant.id)

            if (updateError) {
                console.error('Failed to update application status:', updateError)
                alert('Failed to update application status.')
                return
            }

            const { data: raffleEvent, error: raffleEventError } = await (supabase as any)
                .from('raffle_events')
                .insert({
                    stall_id: selectedStall.id,
                    event_name: `Raffle for ${selectedStall.stall_number}`,
                    description: `Raffle conducted for stall ${selectedStall.stall_number}`,
                    status: 'completed',
                    conducted_at: new Date().toISOString(),
                    conducted_by: null
                })
                .select()
                .single()

            if (raffleEventError) {
                console.error('Failed to create raffle event:', raffleEventError)
                alert('Failed to create raffle event.')
                return
            }

            const { error: participantError } = await (supabase as any)
                .from('raffle_participants')
                .insert({
                    raffle_event_id: raffleEvent.id,
                    vendor_application_id: selectedApplicant.id,
                    is_winner: true,
                    selected_at: new Date().toISOString()
                })

            if (participantError) {
                console.error('Failed to create raffle participant:', participantError)
                alert('Failed to create raffle participant.')
                return
            }

            const { error: stallUpdateError } = await (supabase as any)
                .from('stalls')
                .update({
                    status: 'occupied',
                    vendor_profile_id: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedStall.id)

            if (stallUpdateError) {
                console.error('Failed to update stall status:', stallUpdateError)
                alert('Failed to update stall status.')
                return
            }

            const { error: certificateError } = await (supabase as any)
                .from('assignment_certificates')
                .insert([certificateData])

            if (certificateError) {
                console.error('Failed to create certificate:', certificateError)
            }

            const otherApplicantIds = selectedStall.applicants
                .filter(applicant => applicant.id !== selectedApplicant.id)
                .map(applicant => applicant.id)

            if (otherApplicantIds.length > 0) {
                const { error: otherApplicantsError } = await (supabase as any)
                    .from('vendor_applications')
                    .update({
                        status: 'not_selected',
                        updated_at: new Date().toISOString()
                    })
                    .in('id', otherApplicantIds)

                if (otherApplicantsError) {
                    console.error('Failed to update other applicants:', otherApplicantsError)
                }
            }

            alert(`Stall assigned successfully! ${selectedApplicant.first_name} ${selectedApplicant.last_name} has been assigned to ${selectedStall.stall_number}. A certificate has been generated and the vendor will be notified.`)
            navigate('/admin/vendors')
        } catch (error) {
            console.error('Error in handleRaffle:', error)
            alert('An error occurred during stall assignment.')
        } finally {
            setRaffling(false)
        }
    }

    useEffect(() => {
        fetchAvailableStalls()
        if (vendorId) {
            fetchVendorData()
        }
    }, [vendorId, navigate])

    useEffect(() => {
        // Reset active index when stall changes
        if (selectedStall) {
            setActiveIndex(0)
            setSelectedApplicant(null)
        }
    }, [selectedStall])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading raffle data...</p>
                </div>
            </div>
        )
    }

    if (vendorId && !vendor) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h1>
                    <p className="text-gray-600 mb-4">The vendor you're looking for could not be found.</p>
                    <button
                        onClick={() => navigate('/admin/vendors')}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Vendors
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Stall Assignment - Raffle</h1>
                            <p className="text-gray-600">Assign a stall to the approved vendor</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/vendors')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Vendors
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Market Sections and Stalls */}
                    <div className="space-y-6">
                        {/* Market Sections */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Sections</h2>

                            {availableStalls.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No stalls with applicants found.</p>
                                    <p className="text-sm text-gray-400 mt-2">Only stalls with approved vendors will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(
                                        availableStalls.reduce((acc, stall) => {
                                            const sectionName = stall.market_sections?.name || 'Unknown Section'
                                            if (!acc[sectionName]) {
                                                acc[sectionName] = []
                                            }
                                            acc[sectionName].push(stall)
                                            return acc
                                        }, {} as Record<string, StallWithApplicants[]>)
                                    ).map(([sectionName, stalls]) => (
                                        <div key={sectionName} className="border border-gray-200 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">{sectionName}</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                                {stalls.map((stall) => (
                                                    <div
                                                        key={stall.id}
                                                        className={`border-2 rounded-lg p-3 cursor-pointer transition-colors text-center ${selectedStall?.id === stall.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedStall(stall)
                                                            setSelectedApplicant(null)
                                                        }}
                                                    >
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {stall.stall_number}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {stall.applicants.length} applicant{stall.applicants.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Stall Applicants */}
                        {selectedStall && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Applicants for {selectedStall.stall_number}
                                </h2>
                                <div className="space-y-3">
                                    {selectedStall.applicants.length > 0 ? (
                                        selectedStall.applicants.map((applicant) => (
                                            <div key={applicant.id} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="font-medium text-gray-900">
                                                    {applicant.first_name} {applicant.last_name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {applicant.business_name}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 italic text-center py-4">
                                            No applicants for this stall
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Scroll Selector */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 w-full max-w-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Name Selector</h2>

                            {/* Scroll Selector with Lever */}
                            {selectedStall && selectedStall.applicants.length > 0 && (
                                <div className="relative flex items-center">
                                    {/* Main Selector */}
                                    <div
                                        className="selector-container bg-black rounded-3xl p-6 mb-6 relative focus:outline-none"
                                        tabIndex={0}
                                        onKeyDown={handleKeyDown}
                                        style={{
                                            width: '300px',
                                            height: '400px',
                                            background: 'linear-gradient(135deg, #000, #1a1a1a)',
                                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
                                            border: '2px solid #444',
                                        }}
                                    >
                                        {/* Lever Handle */}
                                        <button
                                            onClick={startAutoSpin}
                                            disabled={spinning}
                                            className="absolute -right-8 top-1/2 transform -translate-y-1/2 z-10 focus:outline-none"
                                            title="Pull to spin!"
                                        >
                                            <div className="flex flex-col items-center">
                                                {/* Lever arm */}
                                                <div
                                                    className={`w-2 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full transition-all duration-300 ${spinning ? 'animate-bounce' : ''}`}
                                                    style={{
                                                        height: '120px',
                                                        boxShadow: '2px 0 8px rgba(0,0,0,0.3), inset -1px 0 2px rgba(255,255,255,0.3)'
                                                    }}
                                                />
                                                {/* Lever handle */}
                                                <div
                                                    className={`w-8 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-red-700 cursor-pointer transform transition-all duration-200 hover:scale-105 ${spinning ? 'animate-pulse' : 'hover:shadow-lg hover:shadow-red-500/30'}`}
                                                    style={{
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)'
                                                    }}
                                                >
                                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 relative">
                                                        <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full" />
                                                    </div>
                                                </div>
                                                {/* Lever text */}
                                                <div className="text-xs text-gray-400 mt-1 font-medium">
                                                    {spinning ? 'SPINNING!' : 'PULL!'}
                                                </div>
                                            </div>
                                        </button>
                                        <div className="text-center mb-4 text-green-400 font-semibold text-sm">
                                            SELECT APPLICANT
                                        </div>

                                        <div className="relative overflow-hidden" style={{ height: '280px' }}>
                                            <div
                                                className={`transition-transform duration-300 ${spinning ? 'transition-transform duration-100' : ''}`}
                                                style={{
                                                    transform: `translateY(${-activeIndex * 55 + 140}px)`,
                                                }}
                                            >
                                                {[{ first_name: 'START', last_name: '', business_name: '', id: 'start' }, ...selectedStall.applicants].map((applicant, index) => (
                                                    <div
                                                        key={applicant.id}
                                                        className={`
                                                        p-4 text-center cursor-pointer transition-all duration-300 border-b border-gray-800
                                                        ${index === activeIndex
                                                                ? 'bg-gradient-to-r from-green-500 to-green-400 text-white font-bold text-lg transform scale-105 border-none rounded-lg' + (spinning ? ' shadow-lg shadow-green-500/50' : '')
                                                                : Math.abs(index - activeIndex) === 1
                                                                    ? 'text-gray-400 opacity-80'
                                                                    : 'text-gray-600 opacity-50'
                                                            }
                                                    `}
                                                        onClick={() => {
                                                            if (applicant.id === 'start') {
                                                                startAutoSpin()
                                                            } else {
                                                                setActiveIndex(index)
                                                                setSelectedApplicant(applicant)
                                                                setShowWinnerModal(true)

                                                                // Auto-close modal after 2 seconds
                                                                setTimeout(() => {
                                                                    setShowWinnerModal(false)
                                                                }, 2000)
                                                            }
                                                        }}
                                                    >
                                                        {applicant.id === 'start' ? (
                                                            <div className="text-lg font-bold">START</div>
                                                        ) : (
                                                            <>
                                                                <div className="font-semibold">
                                                                    {applicant.first_name} {applicant.last_name}
                                                                </div>
                                                                <div className="text-xs opacity-75">
                                                                    {applicant.business_name}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-xs">
                                            Use ↑↓ arrow keys • Enter to select
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!selectedStall && (
                                <div className="text-center py-16 text-gray-500">
                                    Please select a stall first
                                </div>
                            )}

                            {selectedStall && selectedStall.applicants.length === 0 && (
                                <div className="text-center py-16 text-gray-500">
                                    No applicants for selected stall
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleRaffle}
                                disabled={!selectedStall || !selectedApplicant || raffling}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                                {raffling ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                                        Assigning Stall...
                                    </>
                                ) : !selectedStall ? (
                                    'Select a stall first'
                                ) : !selectedApplicant ? (
                                    'Select an applicant first'
                                ) : (
                                    `Assign to ${selectedStall.stall_number} stall`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Winner Modal */}
            {showWinnerModal && selectedApplicant && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
                    onClick={() => setShowWinnerModal(false)}
                >
                    <div
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center max-w-md w-90 mx-4 border-2 border-green-500 transform scale-100 transition-transform duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-green-500 text-2xl font-bold mb-4 drop-shadow-lg">
                            🎉 SELECTED! 🎉
                        </div>
                        <div className="text-white text-2xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent animate-pulse">
                            {selectedApplicant.first_name} {selectedApplicant.last_name}
                        </div>
                        <div className="text-gray-300 mb-6">
                            {selectedApplicant.business_name}
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setShowWinnerModal(false)
                                }}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}