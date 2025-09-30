import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ApplicationRejected() {
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

                // If application is not rejected, redirect appropriately
                if (vendorApp.status === 'pending_approval') {
                    navigate('/vendor-application/pending')
                } else if (vendorApp.status === 'approved') {
                    navigate('/vendor-application/approved')
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
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
                        </div>
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                    {/* Status Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-red-600 mb-2">Application Not Approved</h2>
                        <p className="text-lg text-gray-600">
                            Unfortunately, your application was not approved at this time
                        </p>
                    </div>

                    {/* Application Details */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="md:col-span-2">
                                <span className="font-medium text-gray-600">Application Number:</span>
                                <span className="ml-2 text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded text-lg font-bold">
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
                                <span className="font-medium text-gray-600">Reviewed:</span>
                                <span className="ml-2 text-gray-900">
                                    {applicationData.rejectedAt ? new Date(applicationData.rejectedAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Information */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-red-900 mb-4">Common Reasons for Rejection</h3>
                        <div className="space-y-2 text-sm text-red-800">
                            <p>• Incomplete or unclear documents</p>
                            <p>• Missing required information</p>
                            <p>• Documents not properly notarized</p>
                            <p>• No available stalls in requested section</p>
                            <p>• Previous violations or issues</p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">What you can do</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900">Contact the Office</h4>
                                    <p className="text-blue-700 text-sm">Call or visit the market office to understand the specific reason for rejection.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">2</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900">Address Issues</h4>
                                    <p className="text-blue-700 text-sm">If possible, address any issues mentioned and gather additional documents.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">3</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900">Reapply</h4>
                                    <p className="text-blue-700 text-sm">You can submit a new application after addressing the issues.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Need More Information?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            to="/vendor-application"
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Start New Application
                        </Link>
                        <Link
                            to="/"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

