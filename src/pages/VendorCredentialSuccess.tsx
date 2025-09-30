import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function VendorCredentialSuccess() {
    const [searchParams] = useSearchParams()
    const [applicationData, setApplicationData] = useState<any>(null)
    const [raffleData, setRaffleData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const applicationNumber = searchParams.get('app')
    const username = searchParams.get('username')
    const email = searchParams.get('email')

    useEffect(() => {
        if (applicationNumber) {
            fetchApplicationData()
        }
    }, [applicationNumber])

    const fetchApplicationData = async () => {
        try {
            setLoading(true)
            const { data: application, error: appError } = await (supabase as any)
                .from('vendor_applications')
                .select('*')
                .eq('application_number', applicationNumber)
                .single()

            if (appError) {
                console.error('Error fetching application:', appError)
                return
            }

            setApplicationData(application)

            // Fetch raffle data
            const { data: raffleParticipant, error: participantError } = await (supabase as any)
                .from('raffle_participants')
                .select(`
                    *,
                    raffle_events (
                        id,
                        event_name,
                        description,
                        conducted_at,
                        stalls (
                            id,
                            stall_number,
                            market_sections (
                                id,
                                name,
                                code
                            )
                        )
                    )
                `)
                .eq('vendor_application_id', application.id)
                .eq('is_winner', true)
                .single()

            if (!participantError && raffleParticipant) {
                setRaffleData(raffleParticipant)
            }
        } catch (error) {
            console.error('Error in fetchApplicationData:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
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

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Successfully Created!</h1>
                        <p className="text-gray-600">Your vendor account has been activated and you can now access the mobile app</p>
                    </div>

                    {/* Account Details */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">Your Account Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-green-600">Application Number:</span>
                                <span className="ml-2 text-green-900 font-mono bg-green-100 px-2 py-1 rounded">
                                    {applicationData?.application_number}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-green-600">Username:</span>
                                <span className="ml-2 text-green-900 font-mono bg-green-100 px-2 py-1 rounded font-bold">
                                    {username}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-green-600">Name:</span>
                                <span className="ml-2 text-green-900">
                                    {applicationData?.first_name} {applicationData?.last_name}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-green-600">Email:</span>
                                <span className="ml-2 text-green-900">{email || applicationData?.email}</span>
                            </div>
                            <div>
                                <span className="font-medium text-green-600">Business Name:</span>
                                <span className="ml-2 text-green-900">{applicationData?.business_name || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-green-600">Status:</span>
                                <span className="ml-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Active
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stall Assignment */}
                    {raffleData && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-purple-800 mb-4">Your Assigned Stall</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-purple-600">Stall Number:</span>
                                    <span className="ml-2 text-purple-900 font-bold text-lg">
                                        {raffleData.raffle_events?.stalls?.stall_number || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-purple-600">Market Section:</span>
                                    <span className="ml-2 text-purple-900">
                                        {raffleData.raffle_events?.stalls?.market_sections?.name || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-purple-600">Section Code:</span>
                                    <span className="ml-2 text-purple-900">
                                        {raffleData.raffle_events?.stalls?.market_sections?.code || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-purple-600">Won Date:</span>
                                    <span className="ml-2 text-purple-900">
                                        {raffleData.selected_at ?
                                            new Date(raffleData.selected_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile App Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">📱 Mobile App Access</h2>
                        <div className="space-y-4 text-sm text-blue-700">
                            <div className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <div>
                                    <p className="font-medium">Download the Mapalengke Mobile App</p>
                                    <p>Search for "Mapalengke" in your app store or get the APK from the admin</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <div>
                                    <p className="font-medium">Log in with your credentials</p>
                                    <div className="mt-2 bg-blue-100 p-3 rounded border">
                                        <p><strong>Username:</strong> <span className="font-mono">{username}</span></p>
                                        <p><strong>Password:</strong> [The password you just created]</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <div>
                                    <p className="font-medium">Start managing your stall</p>
                                    <p>Add products, manage inventory, and serve customers through the app</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-amber-800 mb-4">⚠️ Important Notes</h2>
                        <ul className="text-amber-700 text-sm space-y-2">
                            <li>• Keep your username and password secure - you'll need them to access the mobile app</li>
                            <li>• Your stall assignment is now final and cannot be changed</li>
                            <li>• You can start setting up your stall and adding products through the mobile app</li>
                            <li>• Contact the market admin if you have any issues accessing your account</li>
                            <li>• Remember to follow all market rules and regulations</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/"
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Return to Home
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Print Details
                        </button>
                    </div>

                    {/* Contact Information */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Need help? Contact the Toril Public Market administration office or visit us in person.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}