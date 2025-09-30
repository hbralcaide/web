import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type MarketSection = Database['public']['Tables']['market_sections']['Row']
type Stall = Database['public']['Tables']['stalls']['Row']

interface SectionWithStalls extends MarketSection {
    stalls: Stall[]
    availableStalls: number
}

export default function PublicHomeDebug() {
    const [sections, setSections] = useState<SectionWithStalls[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    useEffect(() => {
        fetchMarketData()
    }, [])

    const fetchMarketData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch market sections
            const { data: sectionsData, error: sectionsError } = await supabase
                .from('market_sections')
                .select('*')
                .eq('status', 'active')
                .order('name') as { data: MarketSection[] | null; error: any }

            if (sectionsError) {
                throw sectionsError
            }

            // Fetch all stalls
            const { data: stallsData, error: stallsError } = await supabase
                .from('stalls')
                .select('*')
                .order('stall_number') as { data: Stall[] | null; error: any }

            if (stallsError) {
                throw stallsError
            }

            // Debug information
            const debug = {
                totalStalls: stallsData?.length || 0,
                totalSections: sectionsData?.length || 0,
                stallsBySection: {},
                sectionCodes: sectionsData?.map(s => s.code) || [],
                allStallNumbers: stallsData?.map(s => s.stall_number) || []
            }

            // Group stalls by section and calculate available stalls
            const sectionsWithStalls: SectionWithStalls[] = (sectionsData || []).map(section => {
                // Get all section codes to check for conflicts
                const allSectionCodes = (sectionsData || []).map(s => s.code).sort((a, b) => b.length - a.length) // Sort by length descending

                const sectionStalls = (stallsData || []).filter(stall => {
                    // Check if stall number starts with this section code
                    if (!stall.stall_number.startsWith(section.code)) {
                        return false
                    }

                    // Check if this stall number also starts with a longer section code
                    // This prevents "F" section from including "FV" stalls
                    const longerCode = allSectionCodes.find(code =>
                        code.length > section.code.length &&
                        stall.stall_number.startsWith(code)
                    )

                    return !longerCode
                })

                const availableStalls = sectionStalls.filter(stall =>
                    stall.status === 'vacant' || stall.status === 'available'
                ).length

                // Debug info for this section
                debug.stallsBySection[section.code] = {
                    sectionName: section.name,
                    sectionCode: section.code,
                    totalStalls: sectionStalls.length,
                    availableStalls: availableStalls,
                    stallNumbers: sectionStalls.map(s => s.stall_number),
                    statuses: sectionStalls.map(s => ({ number: s.stall_number, status: s.status }))
                }

                return {
                    ...section,
                    stalls: sectionStalls,
                    availableStalls
                } as SectionWithStalls
            })

            setDebugInfo(debug)
            setSections(sectionsWithStalls)

        } catch (err: any) {
            console.error('Error fetching market data:', err)
            setError(err.message || 'Failed to load market data')
        } finally {
            setLoading(false)
        }
    }

    // Calculate totals
    const totalAvailableStalls = sections.reduce((sum, section) => sum + section.availableStalls, 0)
    const totalOccupiedStalls = sections.reduce((sum, section) =>
        sum + (section.stalls.length - section.availableStalls), 0
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading market data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Data</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchMarketData}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug: Stall Counting Issue</h1>

                {/* Debug Information */}
                <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg mb-8">
                    <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                        <h3 className="text-xl font-bold text-center">DEBUG INFORMATION</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Database Totals</h4>
                                <p><strong>Total Stalls in DB:</strong> {debugInfo?.totalStalls}</p>
                                <p><strong>Total Sections:</strong> {debugInfo?.totalSections}</p>
                                <p><strong>Section Codes:</strong> {debugInfo?.sectionCodes?.join(', ')}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Calculated Totals</h4>
                                <p><strong>Total Available Stalls:</strong> {totalAvailableStalls}</p>
                                <p><strong>Total Occupied Stalls:</strong> {totalOccupiedStalls}</p>
                                <p><strong>Total Stalls (Calculated):</strong> {totalAvailableStalls + totalOccupiedStalls}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Details */}
                <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg">
                    <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                        <h3 className="text-xl font-bold text-center">SECTION BREAKDOWN</h3>
                    </div>
                    <div className="p-6">
                        {sections.map((section) => (
                            <div key={section.id} className="mb-6 p-4 border border-gray-300 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                    {section.name} (Code: {section.code})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p><strong>Total Stalls:</strong> {section.stalls.length}</p>
                                        <p><strong>Available Stalls:</strong> {section.availableStalls}</p>
                                        <p><strong>Occupied Stalls:</strong> {section.stalls.length - section.availableStalls}</p>
                                    </div>
                                    <div>
                                        <p><strong>Stall Numbers:</strong></p>
                                        <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                                            {section.stalls.map(stall => (
                                                <span key={stall.id} className="inline-block mr-2 mb-1">
                                                    {stall.stall_number}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p><strong>Status Breakdown:</strong></p>
                                        <div className="text-sm text-gray-600">
                                            {Object.entries(
                                                section.stalls.reduce((acc, stall) => {
                                                    acc[stall.status] = (acc[stall.status] || 0) + 1
                                                    return acc
                                                }, {} as Record<string, number>)
                                            ).map(([status, count]) => (
                                                <p key={status}>{status}: {count}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Raw Debug Data */}
                <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg mt-8">
                    <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                        <h3 className="text-xl font-bold text-center">RAW DEBUG DATA</h3>
                    </div>
                    <div className="p-6">
                        <pre className="text-sm text-gray-600 overflow-auto max-h-96">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
