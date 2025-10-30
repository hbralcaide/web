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
            {/* Government-style Header */}
            <header className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <div>
                                <div className="text-lg font-bold">REPUBLIC OF THE PHILIPPINES</div>
                                <div className="text-sm font-semibold">DEPARTMENT OF TRADE AND INDUSTRY</div>
                                <div className="text-xs">TORIL PUBLIC MARKET - MAPALENGKE</div>
                            </div>
                        </div>

                        {/* Admin Login Button */}
                        <div className="ml-auto">
                            <Link
                                to="/login"
                                className="bg-white text-gray-800 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Secondary Header */}
            <div className="bg-gray-700 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold">Available Stalls for Vendor Applications</h1>
                        <div className="text-sm text-gray-300">
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
                            <h3 className="text-xl font-bold text-center">OFFICIAL MARKET STATISTICS</h3>
                            <p className="text-sm text-center text-gray-300">As of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                            <div className="text-center border-r border-gray-300 pr-6">
                                <div className="text-4xl font-bold text-green-600 mb-2">{totalAvailableStalls}</div>
                                <div className="text-gray-800 font-semibold text-lg mb-1">AVAILABLE STALLS</div>
                                <div className="text-gray-600 text-sm">For new vendor applications</div>
                            </div>
                            <div className="text-center border-r border-gray-300 pr-6">
                                <div className="text-4xl font-bold text-blue-600 mb-2">{sections.length}</div>
                                <div className="text-gray-800 font-semibold text-lg mb-1">MARKET SECTIONS</div>
                                <div className="text-gray-600 text-sm">Operational areas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-600 mb-2">{totalOccupiedStalls}</div>
                                <div className="text-gray-800 font-semibold text-lg mb-1">ACTIVE VENDORS</div>
                                <div className="text-gray-600 text-sm">Currently operating</div>
                            </div>
                        </div>
                    </div>

                    {/* Official Vendor Application Notice */}
                    <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg mb-8">
                        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                            <h3 className="text-xl font-bold text-center">VENDOR APPLICATION PROCESS</h3>
                            <p className="text-sm text-center text-gray-300">Department of Trade and Industry - Toril Public Market</p>
                        </div>
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">APPLY FOR A MARKET STALL</h2>
                                <p className="text-lg text-gray-700 mb-6">
                                    The Department of Trade and Industry invites qualified individuals to apply for available market stalls at Toril Public Market.
                                    Currently, <strong>{totalAvailableStalls} stalls</strong> are available across <strong>{sections.length} market sections</strong>.
                                </p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg mb-8">
                                <div className="text-center">
                                    <h4 className="text-lg font-bold text-yellow-900 mb-3">⚠️ IMPORTANT NOTICE</h4>
                                    <p className="text-yellow-800 mb-4">
                                        <strong>You must select a specific stall before applying.</strong> Please browse the Market Sections Directory below to choose your preferred stall and section.
                                    </p>
                                    <p className="text-yellow-700 text-sm">
                                        Applications without a specific stall selection will not be processed.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                                    <h4 className="text-lg font-bold text-blue-900 mb-3">NEW APPLICANTS</h4>
                                    <p className="text-blue-800 mb-4">First, select a stall from the directory below, then submit your complete vendor application.</p>
                                    <div className="text-blue-700 text-sm font-semibold">
                                        Step 1: Choose a stall below<br />
                                        Step 2: Click "APPLY FOR [SECTION] STALL"<br />
                                        Step 3: Complete your application
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                                    <h4 className="text-lg font-bold text-green-900 mb-3">EXISTING APPLICANTS</h4>
                                    <p className="text-green-800 mb-4">Continue your pending application using your application reference number.</p>
                                    <Link
                                        to="/resume-application"
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
                                    >
                                        RESUME APPLICATION
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg text-center">
                                <p className="text-gray-700">
                                    <strong>For inquiries and assistance:</strong><br />
                                    Contact the Market Administration Office at <strong>(123) 456-7890</strong><br />
                                    Email: <strong>admin@mapalengke.com</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Indoor Map */}
                    <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg mb-8">
                        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                            <h3 className="text-xl font-bold text-center">TORIL PUBLIC MARKET MAP</h3>
                            <p className="text-sm text-center text-gray-300">
                                Explore the market and click available stalls to apply
                            </p>
                        </div>
                        <div className="p-4">
                            <MappedinMap 
                                stalls={sections.flatMap(s => s.stalls)}
                                onStallClick={(stall) => {
                                    if (stall.status === 'vacant' || stall.status === 'available') {
                                        window.location.href = `/vendor-application?stall=${stall.id}`;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Official Market Sections Directory */}
                    <div className="bg-white border-2 border-gray-400 rounded-lg shadow-lg">
                        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                            <h3 className="text-xl font-bold text-center">MARKET SECTIONS DIRECTORY</h3>
                            <p className="text-sm text-center text-gray-300">Select a specific stall number to begin your application</p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sections.filter(section => section.availableStalls > 0).map((section) => (
                                    <div key={section.id} className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        {/* Section Header */}
                                        <div className="bg-gray-700 text-white p-4 rounded-t-lg">
                                            <h4 className="text-lg font-bold text-center">{section.name.toUpperCase()}</h4>
                                            <p className="text-sm text-center text-gray-300 mt-1">{section.description}</p>
                                        </div>

                                        <div className="p-4">
                                            {/* Available Stalls Count */}
                                            <div className="text-center mb-4">
                                                <div className="text-3xl font-bold text-green-600 mb-1">{section.availableStalls}</div>
                                                <div className="text-gray-700 font-semibold">AVAILABLE STALLS</div>
                                                <div className="text-gray-500 text-sm">out of {section.stalls.length} total</div>
                                            </div>

                                            {/* Action Buttons */}
                                            {section.availableStalls > 0 ? (
                                                <div className="space-y-3">
                                                    <div className="text-center mb-3">
                                                        <p className="text-sm text-gray-600 font-medium">
                                                            ⚠️ You must select a specific stall number first
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            const stallsContainer = document.getElementById(`stalls-${section.id}`);
                                                            if (stallsContainer) {
                                                                stallsContainer.classList.toggle('hidden');
                                                            }
                                                        }}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                                    >
                                                        SELECT STALL NUMBER
                                                    </button>

                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-500">
                                                            Click above to see available stall numbers
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <div className="text-gray-500 font-semibold">NO STALLS AVAILABLE</div>
                                                    <div className="text-gray-400 text-sm">Please check back later</div>
                                                </div>
                                            )}

                                            {/* Stalls List - Collapsible */}
                                            <div id={`stalls-${section.id}`} className="hidden mt-4">
                                                <div className="border-t border-gray-300 pt-4">
                                                    <h5 className="text-sm font-semibold text-gray-700 mb-3 text-center">AVAILABLE STALL NUMBERS:</h5>
                                                    <p className="text-xs text-gray-600 text-center mb-3">
                                                        Click on any stall number below to start your application
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {section.stalls
                                                            .filter(stall => stall.status === 'vacant' || stall.status === 'available')
                                                            .map((stall) => (
                                                                <button
                                                                    key={stall.id}
                                                                    onClick={() => {
                                                                        window.location.href = `/vendor-application?stall=${stall.id}&section=${section.id}`;
                                                                    }}
                                                                    className="bg-green-100 border-2 border-green-400 text-green-800 font-bold py-3 px-3 rounded-lg text-sm hover:bg-green-200 hover:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                    title={`Click to apply for ${stall.stall_number}`}
                                                                >
                                                                    {stall.stall_number}
                                                                </button>
                                                            ))}
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <p className="text-xs text-gray-500">
                                                            ✅ Click any stall number above to begin your application
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Official Footer */}
                    <footer className="mt-12 bg-gray-800 text-white py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <div className="mb-4">
                                    <h4 className="text-lg font-bold mb-2">TORIL PUBLIC MARKET - MAPALENGKE</h4>
                                    <p className="text-gray-300">Department of Trade and Industry</p>
                                    <p className="text-gray-300">Republic of the Philippines</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <h5 className="font-semibold mb-2">CONTACT INFORMATION</h5>
                                        <p className="text-sm text-gray-300">Phone: (123) 456-7890</p>
                                        <p className="text-sm text-gray-300">Email: admin@mapalengke.com</p>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">OFFICE HOURS</h5>
                                        <p className="text-sm text-gray-300">Monday - Friday: 8:00 AM - 5:00 PM</p>
                                        <p className="text-sm text-gray-300">Saturday: 8:00 AM - 12:00 PM</p>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-2">APPLICATION SUPPORT</h5>
                                        <p className="text-sm text-gray-300">For technical assistance</p>
                                        <p className="text-sm text-gray-300">and application inquiries</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-600 pt-4">
                                    <p className="text-sm text-gray-400">
                                        © 2025 Department of Trade and Industry - Toril Public Market. All rights reserved.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        This is an official government website. For official business only.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    )
}
