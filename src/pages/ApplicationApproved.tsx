import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ApplicationApproved() {
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

                // If application is not approved, redirect appropriately
                if (vendorApp.status === 'pending_approval') {
                    navigate('/vendor-application/pending')
                } else if (vendorApp.status === 'rejected') {
                    navigate('/vendor-application/rejected')
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
                            <h1 className="text-2xl font-bold text-gray-900">Application Approved</h1>
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
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h2>
                        <p className="text-lg text-gray-600">
                            Your vendor application has been approved
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
                                <span className="font-medium text-gray-600">Approved:</span>
                                <span className="ml-2 text-gray-900">
                                    {applicationData.approvedAt ? new Date(applicationData.approvedAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-green-900 mb-4">Next Steps</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-green-600 text-sm font-semibold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-900">Payment</h4>
                                    <p className="text-green-700 text-sm">Visit the market office to pay the ₱400 registration fee and get your Official Receipt (O.R.).</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-green-600 text-sm font-semibold">2</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-900">Stall Assignment</h4>
                                    <p className="text-green-700 text-sm">After payment, you'll be assigned to an available stall in your preferred section.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-green-600 text-sm font-semibold">3</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-900">Start Business</h4>
                                    <p className="text-green-700 text-sm">Once assigned, you can start your business operations at Toril Public Market!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Important Information</h3>
                        <div className="space-y-2 text-sm text-yellow-800">
                            <p>• Please bring a valid ID when visiting the office for payment</p>
                            <p>• Payment must be made within 7 days of approval</p>
                            <p>• Stall assignment is subject to availability</p>
                            <p>• You will receive a copy of the lease agreement upon payment</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Office</h3>
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
                    <div className="flex justify-center mt-8">
                        <Link
                            to="/"
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

