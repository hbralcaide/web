import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'
import MappedinMap from "../components/MappedinMap"

type MarketSection = Database['public']['Tables']['market_sections']['Row']
type Stall = Database['public']['Tables']['stalls']['Row']

interface SectionWithStalls extends MarketSection {
    stalls: Stall[]
    availableStalls: number
}

export default function PublicHome() {
    const [sections, setSections] = useState<SectionWithStalls[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSectionCode, setSelectedSectionCode] = useState<string | null>(null)

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

                return {
                    ...section,
                    stalls: sectionStalls,
                    availableStalls
                } as SectionWithStalls
            })

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
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                <span className="text-white font-bold text-sm sm:text-lg">TPM</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="text-sm sm:text-lg font-bold">CITY ECONOMICS ENTERPRISE</div>
                                <div className="text-xs sm:text-sm font-semibold">TORIL PUBLIC MARKET (TPM)</div>
                                <div className="text-xs hidden sm:block">Toril Pob., Toril, Davao City, 8000 Philippines</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Thesis Disclaimer */}
            <div className="bg-yellow-100 border-b-2 border-yellow-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <p className="text-center text-xs sm:text-sm text-yellow-900">
                        <strong>⚠️ NOTICE:</strong> This is an academic thesis project for research purposes and is NOT an official government website.
                    </p>
                </div>
            </div>

            {/* Secondary Header */}
            <div className="bg-gray-700 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <h1 className="text-base sm:text-xl font-semibold text-center sm:text-left">Available Stalls for Vendor Applications</h1>
                        <div className="text-xs sm:text-sm text-gray-300">
                            Last Updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Official Market Statistics */}
                    <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg mb-8">
                        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg sm:text-xl font-bold text-center">OFFICIAL MARKET STATISTICS</h3>
                            <p className="text-xs sm:text-sm text-center text-gray-300">As of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                            <div className="text-center sm:border-r border-gray-300 sm:pr-6 pb-4 sm:pb-0 border-b sm:border-b-0">
                                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">{totalAvailableStalls}</div>
                                <div className="text-gray-800 font-semibold text-base sm:text-lg mb-1">AVAILABLE STALLS</div>
                                <div className="text-gray-600 text-xs sm:text-sm">For new vendor applications</div>
                            </div>
                            <div className="text-center sm:border-r border-gray-300 sm:pr-6 pb-4 sm:pb-0 border-b sm:border-b-0">
                                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{sections.length}</div>
                                <div className="text-gray-800 font-semibold text-base sm:text-lg mb-1">MARKET SECTIONS</div>
                                <div className="text-gray-600 text-xs sm:text-sm">Operational areas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-gray-600 mb-2">{totalOccupiedStalls}</div>
                                <div className="text-gray-800 font-semibold text-base sm:text-lg mb-1">ACTIVE VENDORS</div>
                                <div className="text-gray-600 text-xs sm:text-sm">Currently operating</div>
                            </div>
                        </div>
                    </div>

                    {/* Vendor Application Notice */}
                    <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg mb-8">
                        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg sm:text-xl font-bold text-center">VENDOR APPLICATION PROCESS</h3>
                            <p className="text-xs sm:text-sm text-center text-gray-300">Toril Public Market</p>
                        </div>
                        <div className="p-4 sm:p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">APPLY FOR A MARKET STALL</h2>
                                <p className="text-sm sm:text-lg text-gray-700 mb-6">
                                    Toril Public Market invites qualified individuals to apply for available market stalls.
                                    Currently, <strong>{totalAvailableStalls} stalls</strong> are available across <strong>{sections.length} market sections</strong>.
                                </p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-300 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
                                <div className="text-center">
                                    <h4 className="text-base sm:text-lg font-bold text-yellow-900 mb-3">⚠️ IMPORTANT NOTICE</h4>
                                    <p className="text-sm sm:text-base text-yellow-800 mb-4">
                                        <strong>You must select a specific stall before applying.</strong> Please browse the Market Sections Directory below to choose your preferred stall and section.
                                    </p>
                                    <p className="text-yellow-700 text-xs sm:text-sm">
                                        Applications without a specific stall selection will not be processed.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-lg">
                                    <h4 className="text-base sm:text-lg font-bold text-blue-900 mb-3">NEW APPLICANTS</h4>
                                    <p className="text-sm sm:text-base text-blue-800 mb-4">First, select a stall from the directory below, then submit your complete vendor application.</p>
                                    <div className="text-blue-700 text-xs sm:text-sm font-semibold">
                                        Step 1: Choose a stall below<br />
                                        Step 2: Click "APPLY FOR [SECTION] STALL"<br />
                                        Step 3: Complete your application
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 p-4 sm:p-6 rounded-lg">
                                    <h4 className="text-base sm:text-lg font-bold text-green-900 mb-3">EXISTING APPLICANTS</h4>
                                    <p className="text-sm sm:text-base text-green-800 mb-4">Continue your pending application using your application reference number.</p>
                                    <Link
                                        to="/resume-application"
                                        className="block text-center bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        RESUME APPLICATION
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg text-center">
                                <p className="text-gray-700">
                                    <strong>For inquiries and assistance:</strong><br />
                                    Contact the Market Administration Office at <strong>0999 880 6475</strong><br />
                                    Tel. No.: <strong>(082) 3159348</strong><br />
                                    Email: <strong>tpm.gov.22@gmail.com</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Indoor Map */}
                    <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg mb-8">
                        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg sm:text-xl font-bold text-center">TORIL PUBLIC MARKET MAP</h3>
                            <p className="text-xs sm:text-sm text-center text-gray-300">
                                Explore the market and click available stalls to apply
                            </p>
                        </div>
                        
                        {/* Map Legend */}
                        <div className="bg-green-50 border-b-2 border-green-200 p-3 sm:p-4">
                            <div className="max-w-5xl mx-auto">
                                <h4 className="text-center font-bold text-green-900 mb-3 text-sm sm:text-base">MAP LEGEND</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-lg border border-green-300">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded flex-shrink-0" style={{backgroundColor: '#10B981'}}></div>
                                        <span className="font-semibold text-green-900 text-xs sm:text-sm">AVAILABLE - Click to Apply</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-lg border border-gray-300">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-gray-400 flex-shrink-0"></div>
                                        <span className="font-semibold text-gray-700 text-xs sm:text-sm">OCCUPIED - Not Available</span>
                                    </div>
                                </div>
                                
                                {/* Vacant Stalls by Section Indicator */}
                                <div className="bg-white border border-green-300 rounded-lg p-3 sm:p-4 mt-4">
                                    <h5 className="text-center font-bold text-gray-800 mb-2 text-sm sm:text-base">AVAILABLE STALLS BY SECTION</h5>
                                    <p className="text-center text-xs text-gray-600 mb-3">
                                        Click on a section to highlight it on the map
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                        {sections.filter(s => s.availableStalls > 0).map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => {
                                                    // Toggle selection: if already selected, deselect it
                                                    if (selectedSectionCode === section.code) {
                                                        setSelectedSectionCode(null);
                                                    } else {
                                                        setSelectedSectionCode(section.code);
                                                    }
                                                }}
                                                className={`
                                                    rounded-lg p-2 sm:p-3 text-center transition-all duration-200 cursor-pointer
                                                    ${selectedSectionCode === section.code 
                                                        ? 'bg-green-500 border-2 border-green-700 shadow-lg transform scale-105' 
                                                        : 'bg-green-50 border border-green-200 hover:bg-green-100 hover:shadow-md active:scale-95'
                                                    }
                                                `}
                                            >
                                                <div className={`text-xl sm:text-2xl font-bold mb-1 ${
                                                    selectedSectionCode === section.code ? 'text-white' : 'text-green-700'
                                                }`}>
                                                    {section.availableStalls}
                                                </div>
                                                <div className={`text-xs font-semibold ${
                                                    selectedSectionCode === section.code ? 'text-white' : 'text-gray-700'
                                                }`}>
                                                    {section.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {selectedSectionCode && (
                                        <div className="text-center mt-3">
                                            <button
                                                onClick={() => setSelectedSectionCode(null)}
                                                className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 underline"
                                            >
                                                Clear filter
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-center text-xs sm:text-sm text-green-800 mt-3 font-medium">
                                    🖱️ Click any <span className="text-green-600 font-bold">GREEN stall</span> on the map to start your application
                                </p>
                            </div>
                        </div>
                        
                        <div className="p-2 sm:p-4">
                            <MappedinMap 
                                stalls={sections.flatMap(s => s.stalls)}
                                colorMode="simple"
                                showStallLabels={true}
                                highlightedSectionCode={selectedSectionCode}
                                onStallClick={(stall) => {
                                    if (stall.status === 'vacant' || stall.status === 'available') {
                                        // Pass both stall ID and section ID
                                        window.location.href = `/vendor-application?stall=${stall.id}&section=${stall.section_id}`;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-12 bg-gray-800 text-white py-6 sm:py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <div className="mb-4">
                                    <h4 className="text-lg font-bold mb-2">CITY ECONOMICS ENTERPRISE</h4>
                                    <p className="text-gray-300">Toril Public Market (TPM)</p>
                                    <p className="text-gray-300">Toril Pob., Toril, Davao City, 8000 Philippines</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <h5 className="font-semibold mb-2">CONTACT INFORMATION</h5>
                                        <p className="text-sm text-gray-300">Mobile: 0999 880 6475</p>
                                        <p className="text-sm text-gray-300">Tel: (082) 3159348</p>
                                        <p className="text-sm text-gray-300">Email: tpm.gov.22@gmail.com</p>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">OFFICE HOURS</h5>
                                        <p className="text-sm text-gray-300">Monday - Sunday</p>
                                        <p className="text-sm text-gray-300">8:00 AM - 5:00 PM</p>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">APPLICATION SUPPORT</h5>
                                        <p className="text-sm text-gray-300">For technical assistance</p>
                                        <p className="text-sm text-gray-300">and application inquiries</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-600 pt-4">
                                    <p className="text-sm text-gray-400">
                                        © 2025 City Economics Enterprise - Toril Public Market. All rights reserved.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 bg-yellow-900 bg-opacity-30 py-2 px-4 rounded inline-block">
                                        ⚠️ This is an academic thesis project and NOT an official government website.
                                    </p>
                                    {/* Subtle Admin Login Link */}
                                    <div className="mt-4">
                                        <Link 
                                            to="/login" 
                                            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                                        >
                                            Admin
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    )
}
