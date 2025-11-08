import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Stall = Database['public']['Tables']['stalls']['Row']
type MarketSection = Database['public']['Tables']['market_sections']['Row']

interface PreparationModalProps {
    isOpen: boolean
    onClose: () => void
    onProceed: () => void
}

const PreparationModal: React.FC<PreparationModalProps> = ({ isOpen, onClose, onProceed }) => {
    if (!isOpen) return null

    const requirements = [
        'Valid Government Issued ID (Driver\'s License, Passport, Postal ID, etc.)',
        'Barangay Clearance (Original)',
        'Birth Certificate (PSA Certified)',
        'Marriage Certificate (PSA Certified) - If Married',
        '2x2 ID Photo (Recent)',
        'Proof of Address (Utility Bill, Bank Statement, etc.)',
        'Business Permit (If applicable)',
        'Tax Identification Number (TIN)'
    ]

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Vendor Application Requirements</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Please prepare the following documents:</h3>
                        <ul className="space-y-3">
                            {requirements.map((requirement, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700">{requirement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Important Notes:</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>All documents must be original and valid</li>
                                        <li>Photos will be taken during the application process</li>
                                        <li>Application fee: ₱400.00 (Official Receipt will be provided)</li>
                                        <li>Application must be notarized before payment</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onProceed}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            I Have All Requirements - Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function VendorApplication() {
    const [showModal, setShowModal] = useState(true)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    // Get stall and section IDs from URL parameters
    const stallId = searchParams.get('stall')
    const sectionId = searchParams.get('section')

    const [stall, setStall] = useState<Stall | null>(null)
    const [section, setSection] = useState<MarketSection | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (stallId) {
            fetchStallAndSectionInfo()
        } else {
            setError('No stall selected. Please go back and select a specific stall.')
            setLoading(false)
        }
    }, [stallId, sectionId])

    const fetchStallAndSectionInfo = async () => {
        try {
            setLoading(true)
            setError(null)

            if (!stallId) {
                throw new Error('No stall ID provided')
            }

            // Fetch stall information
            const { data: stallData, error: stallError } = await supabase
                .from('stalls')
                .select('*')
                .eq('id', stallId)
                .single() as { data: Stall | null; error: any }

            if (stallError || !stallData) {
                throw new Error('Stall not found')
            }

            // Check if stall is available
            if (stallData.status !== 'vacant' && stallData.status !== 'available') {
                throw new Error('This stall is no longer available')
            }

            // Get section ID from stall or URL parameter
            const actualSectionId = sectionId || stallData.section_id

            // Fetch section information
            const { data: sectionData, error: sectionError } = await supabase
                .from('market_sections')
                .select('*')
                .eq('id', actualSectionId)
                .single() as { data: MarketSection | null; error: any }

            if (sectionError || !sectionData) {
                throw new Error('Market section not found')
            }

            setStall(stallData)
            setSection(sectionData)

            // Store stall and section info in localStorage for the application flow
            const stallInfo = {
                id: stallData.id,
                stall_number: stallData.stall_number,
                section_id: sectionData.id,
                section_name: sectionData.name,
                section_code: sectionData.code
            }
            localStorage.setItem('selectedStall', JSON.stringify(stallInfo))
            console.log('Stored selectedStall in localStorage:', stallInfo)

        } catch (err: any) {
            console.error('Error fetching stall information:', err)
            setError(err.message || 'Failed to load stall information')
        } finally {
            setLoading(false)
        }
    }

    const handleProceed = () => {
        // Clear any existing application data to start fresh
        localStorage.removeItem('vendorApplicationId')
        localStorage.removeItem('vendorApplicationData')

        setShowModal(false)
        navigate('/vendor-application/personal-info')
    }

    const handleClose = () => {
        // Clear stored stall selection
        localStorage.removeItem('selectedStall')
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-4">
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
                    </div>
                </div>
            </header>

            {/* Secondary Header */}
            <div className="bg-gray-700 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold">Vendor Application Form</h1>
                        <Link
                            to="/"
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading stall information...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Link
                                to="/"
                                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vendor Application</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                You are applying for a specific stall at Toril Public Market.
                                Please ensure you have all required documents ready before proceeding.
                            </p>

                            {/* Selected Stall Information */}
                            {stall && section && (
                                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
                                    <h3 className="text-xl font-bold text-green-900 mb-4">Selected Stall Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                        <div className="bg-white rounded-lg p-4 border border-green-200">
                                            <div className="text-sm text-green-600 font-semibold mb-1">STALL NUMBER</div>
                                            <div className="text-2xl font-bold text-green-800">{stall.stall_number}</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-green-200">
                                            <div className="text-sm text-green-600 font-semibold mb-1">MARKET SECTION</div>
                                            <div className="text-lg font-bold text-green-800">{section.name}</div>
                                            <div className="text-sm text-green-600">{section.description}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-green-700 font-medium">
                                            ✅ This stall is available for application
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Process Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div className="flex items-center">
                                        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">1</span>
                                        <span className="text-gray-700">Personal Information</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">2</span>
                                        <span className="text-gray-700">Photo Documentation</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">3</span>
                                        <span className="text-gray-700">Document Verification</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">4</span>
                                        <span className="text-gray-700">Payment & Completion</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                            >
                                Start Application Process
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <PreparationModal
                isOpen={showModal}
                onClose={handleClose}
                onProceed={handleProceed}
            />
        </div>
    )
}

