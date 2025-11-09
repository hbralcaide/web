import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResumeApplication() {
    const navigate = useNavigate()
    const [applicationId, setApplicationId] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleResumeApplication = async () => {
        if (!applicationId.trim()) {
            setError('Please enter your Application ID')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Search for application in database by application_number
            const { data: applications, error } = await supabase
                .from('vendor_applications')
                .select('*')
                .eq('application_number', applicationId)

            if (error) {
                console.error('Error searching for application:', error)
                setError('Error searching for application. Please try again.')
                return
            }

            if (!applications || applications.length === 0) {
                setError('Application number not found. Please check your number and try again.')
                return
            }

            const application = applications[0]
            console.log('Found application:', application)

            // Store the application ID in localStorage for the application flow
            localStorage.setItem('vendorApplicationId', application.id)

            // Check application status and navigate accordingly
            if (application.status === 'pending_approval') {
                navigate('/vendor-application/pending')
            } else if (application.status === 'approved') {
                navigate('/vendor-application/approved')
            } else if (application.status === 'approved_for_raffle') {
                navigate('/vendor-application/completion')
            } else if (application.status === 'won_raffle') {
                // Raffle winners need to submit Business Permit and Cedula
                navigate(`/raffle-winner-documents?app=${application.application_number}`)
            } else if (application.status === 'documents_submitted') {
                // Documents submitted, show status page
                navigate(`/vendor-status?app=${application.application_number}`)
            } else if (application.status === 'rejected') {
                navigate('/vendor-application/rejected')
            } else if (application.status === 'partially_approved') {
                navigate(`/vendor-status?app=${application.application_number}`)
            } else if (application.status === 'pending_notarization') {
                // Navigate to ApplicationForm page to upload notarized document
                navigate('/vendor-application/application-form')
            } else if (application.status === 'draft') {
                // Navigate to the appropriate step based on progress
                // For now, go to personal info form
                navigate('/vendor-application/personal-info')
            } else {
                // Default fallback
                navigate('/vendor-application')
            }

        } catch (error) {
            console.error('Error resuming application:', error)
            setError('Error resuming application. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleStartNew = () => {
        // Clear any existing application data
        localStorage.removeItem('vendorApplicationId')
        localStorage.removeItem('vendorApplicationData')
        localStorage.removeItem('selectedStall')
        navigate('/vendor-application')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-3">
                        <div className="flex items-center">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Resume Application</h1>
                        </div>
                        <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Continue Your Application</h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Enter your 6-digit Application Number to continue where you left off
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
                                Application Number
                            </label>
                            <input
                                type="text"
                                id="applicationId"
                                value={applicationId}
                                onChange={(e) => setApplicationId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter your 6-digit number (e.g., 123456)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-center text-xl sm:text-2xl font-mono tracking-widest"
                                maxLength={6}
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600">{error}</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={handleResumeApplication}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
                            >
                                {loading ? 'Loading...' : 'Resume Application'}
                            </button>
                            <button
                                onClick={handleStartNew}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
                            >
                                Start New Application
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h3>
                        <p className="text-xs sm:text-sm text-blue-700">
                            Your 6-digit Application Number was shown when you saved your application.
                            If you can't find it, you can start a new application instead.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
