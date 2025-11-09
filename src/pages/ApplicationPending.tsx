import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ApplicationPending() {
    const navigate = useNavigate()
    const [applicationData, setApplicationData] = useState<any>(null)

    useEffect(() => {
        // Load application data from database
        const loadApplicationData = async () => {
            try {
                // Get the vendor application ID from localStorage
                const vendorApplicationId = localStorage.getItem('vendorApplicationId')
                if (!vendorApplicationId) {
                    console.log('No vendor application ID in localStorage, redirecting to vendor application')
                    navigate('/vendor-application')
                    return
                }

                console.log('Loading application data for ID:', vendorApplicationId)

                // Fetch the actual application data from database
                const { data: vendorApps, error: vendorError } = await supabase
                    .from('vendor_applications')
                    .select('*')
                    .eq('id', vendorApplicationId)

                if (vendorError) {
                    console.error('Error fetching vendor application:', vendorError)
                    navigate('/vendor-application')
                    return
                }

                if (!vendorApps || vendorApps.length === 0) {
                    console.error('No vendor application found with ID:', vendorApplicationId)
                    navigate('/vendor-application')
                    return
                }

                const vendorApp = vendorApps[0]
                console.log('Successfully loaded vendor application:', vendorApp)

                // If application is not pending approval, redirect appropriately
                if (vendorApp.status === 'approved') {
                    navigate('/vendor-application/approved')
                } else if (vendorApp.status === 'approved_for_raffle') {
                    navigate('/vendor-application/completion')
                } else if (vendorApp.status === 'rejected') {
                    navigate('/vendor-application/rejected')
                } else if (vendorApp.status === 'partially_approved') {
                    navigate(`/vendor-status?app=${vendorApp.application_number}`)
                } else if (vendorApp.status === 'pending_notarization') {
                    navigate('/vendor-application/application-form')
                } else if (vendorApp.status === 'draft') {
                    navigate('/vendor-application')
                }

                // Set the application data from database
                setApplicationData(vendorApp)

            } catch (error) {
                console.error('Error loading application data:', error)
                navigate('/vendor-application')
            }
        }

        loadApplicationData()
    }, [navigate])

    if (!applicationData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading application data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-2 sm:space-y-0">
                        <div className="flex items-center">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Application Status</h1>
                        </div>
                        <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-8">
                    {/* Status Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Application Under Review</h2>
                        <p className="text-base sm:text-lg text-gray-600">
                            Your application is being reviewed by our admin team
                        </p>
                    </div>

                    {/* Application Details */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Application Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div className="md:col-span-2">
                                <span className="font-medium text-gray-600">Application Number:</span>
                                <span className="ml-2 text-gray-900 font-mono bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded text-base sm:text-lg font-bold break-all">
                                    {applicationData.application_number || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Name:</span>
                                <span className="ml-2 text-gray-900">
                                    {applicationData.first_name} {applicationData.middle_name} {applicationData.last_name}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Submitted:</span>
                                <span className="ml-2 text-gray-900">
                                    {applicationData.submitted_at ? new Date(applicationData.submitted_at).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                        <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">What happens next?</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900 text-sm sm:text-base">Admin Review</h4>
                                    <p className="text-blue-700 text-xs sm:text-sm">Our admin team will review your application and documents within 3-5 business days.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">2</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900 text-sm sm:text-base">Notification</h4>
                                    <p className="text-blue-700 text-xs sm:text-sm">You will be notified via phone call or email about the decision.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">3</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900 text-sm sm:text-base">Next Steps</h4>
                                    <p className="text-blue-700 text-xs sm:text-sm">If approved, you'll receive instructions for payment and stall assignment.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Need Help?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                                <p className="text-gray-600 text-sm">Phone: (123) 456-7890</p>
                                <p className="text-gray-600 text-sm">Email: admin@torilmarket.com</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Office Hours</h4>
                                <p className="text-gray-600 text-sm">Monday - Friday: 8:00 AM - 5:00 PM</p>
                                <p className="text-gray-600 text-sm">Saturday: 8:00 AM - 12:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link
                            to={`/vendor-status?app=${applicationData.application_number}`}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                        >
                            Check Application Status
                        </Link>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

