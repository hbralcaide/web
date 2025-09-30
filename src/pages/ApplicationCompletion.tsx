import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AssignmentCertificate from '../components/AssignmentCertificate'

interface PaymentDialogProps {
    isOpen: boolean
    onClose: () => void
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Application Completion Instructions</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Notarization Section */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Step 1: Notarization Required</h3>
                                    <p className="text-yellow-700">
                                        Before proceeding to payment, you must have your application form notarized by a licensed notary public.
                                        This is a legal requirement for all vendor applications.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Step 2: Payment at Office</h3>
                                    <div className="text-blue-700 space-y-2">
                                        <p>After notarization, please visit our office to complete your application:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Bring your notarized application form</li>
                                            <li>Bring all original documents for verification</li>
                                            <li>Payment amount: <strong>₱400.00</strong></li>
                                            <li>Official Receipt (O.R.) will be provided upon payment</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Office Information */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Office Information</h3>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Toril Public Market Administration Office</p>
                                        <p>Toril, Davao City, Philippines</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Office Hours</p>
                                        <p>Monday to Friday: 8:00 AM - 5:00 PM</p>
                                        <p>Saturday: 8:00 AM - 12:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Contact Information</p>
                                        <p>Phone: (082) 123-4567</p>
                                        <p>Email: admin@mapalengke.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-red-800 mb-2">Important Reminders</h3>
                                    <ul className="text-red-700 space-y-1">
                                        <li>• Application is valid for 30 days from submission</li>
                                        <li>• All documents must be original and valid</li>
                                        <li>• Payment must be made in cash only</li>
                                        <li>• Keep your Official Receipt for your records</li>
                                        <li>• Processing time: 3-5 business days after payment</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ApplicationCompletion() {
    const navigate = useNavigate()
    const [showDialog, setShowDialog] = useState(false)
    const [applicationData, setApplicationData] = useState<any>(null)
    const [certificateData, setCertificateData] = useState<any>(null)
    const [showCertificate, setShowCertificate] = useState(false)

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

                // Set the application data from database
                setApplicationData(vendorApp)

                // If approved, fetch certificate data
                if (vendorApp.status === 'approved') {
                    const { data: certificate, error: certError } = await supabase
                        .from('assignment_certificates')
                        .select('*')
                        .eq('vendor_id', vendorApplicationId)
                        .single()

                    if (!certError && certificate) {
                        setCertificateData(certificate)
                    }
                }

            } catch (error) {
                console.error('Error loading application data:', error)
                navigate('/vendor-application')
            }
        }

        loadApplicationData()
    }, [navigate])

    const handleStartNewApplication = () => {
        localStorage.removeItem('vendorApplicationId')
        localStorage.removeItem('vendorApplicationData')
        localStorage.removeItem('selectedStall')
        navigate('/')
    }

    const handleViewRequirements = () => {
        setShowDialog(true)
    }

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
                        <h1 className="text-xl font-semibold">Application Submitted Successfully</h1>
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {applicationData.status === 'pending_approval' ? (
                            <>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Under Review!</h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Your vendor application has been submitted successfully and is now under review. Please wait for approval notification.
                                </p>
                            </>
                        ) : applicationData.status === 'approved' ? (
                            <>
                                {certificateData ? (
                                    // New certificate system - with stall assignment
                                    <>
                                        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Stall Assigned!</h2>
                                        <p className="text-lg text-gray-600 mb-4">
                                            Congratulations! Your vendor application has been approved and you have been assigned to:
                                        </p>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-800 mb-2">
                                                    Stall {certificateData.stall_number}
                                                </div>
                                                <div className="text-lg text-green-700">
                                                    {certificateData.section_name} Section
                                                </div>
                                            </div>
                                        </div>
                                        {certificateData && (
                                            <div className="text-center mb-6">
                                                <button
                                                    onClick={() => setShowCertificate(true)}
                                                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg flex items-center gap-3 mx-auto"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    View Assignment Certificate
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-600">
                                            Please keep your certificate safe as proof of your stall assignment.
                                        </p>
                                    </>
                                ) : (
                                    // Legacy approved vendors - without stall assignment
                                    <>
                                        <h2 className="text-3xl font-bold text-green-600 mb-4">Application Approved!</h2>
                                        <p className="text-lg text-gray-600 mb-6">
                                            Congratulations! Your vendor application has been approved.
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                            <div className="flex items-start">
                                                <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Awaiting Stall Assignment</h3>
                                                    <p className="text-blue-700">
                                                        Your application has been approved! Please wait for stall assignment through the raffle system.
                                                        You will be notified once a stall has been assigned to you.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Keep checking your application status for updates on stall assignment.
                                        </p>
                                    </>
                                )}
                            </>
                        ) : applicationData.status === 'approved_for_raffle' ? (
                            <>
                                <h2 className="text-3xl font-bold text-blue-600 mb-4">Approved for Raffle!</h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Congratulations! Your vendor application has been approved and you are now participating in the stall raffle. Please wait for the raffle results.
                                </p>
                            </>
                        ) : applicationData.status === 'rejected' ? (
                            <>
                                <h2 className="text-3xl font-bold text-red-600 mb-4">Application Rejected</h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Unfortunately, your application has been rejected. Please contact the office for more information.
                                </p>
                            </>
                        ) : applicationData.status === 'partially_approved' ? (
                            <>
                                <h2 className="text-3xl font-bold text-orange-600 mb-4">Application Partially Approved</h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Your application is partially approved. Some documents need to be re-uploaded. Please check your status and re-upload rejected documents.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Your vendor application has been submitted successfully. Please follow the instructions below to complete the process.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Application Summary */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Application Summary</h3>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${applicationData.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                                applicationData.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    applicationData.status === 'approved_for_raffle' ? 'bg-blue-100 text-blue-800' :
                                        applicationData.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            applicationData.status === 'partially_approved' ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-800'
                                }`}>
                                {applicationData.status === 'pending_approval' ? 'Under Review' :
                                    applicationData.status === 'approved' ? 'Approved' :
                                        applicationData.status === 'approved_for_raffle' ? 'Approved for Raffle' :
                                            applicationData.status === 'rejected' ? 'Rejected' :
                                                applicationData.status === 'partially_approved' ? 'Partially Approved' :
                                                    'Draft'}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="md:col-span-2">
                                <span className="font-medium text-gray-600">Application Number:</span>
                                <span className="ml-2 text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded text-lg font-bold">
                                    {applicationData.application_number || 'N/A'}
                                </span>
                            </div>
                            
                            {/* Personal Information */}
                            <div>
                                <span className="font-medium text-gray-600">First Name:</span>
                                <span className="ml-2 text-gray-900">{applicationData.first_name || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Last Name:</span>
                                <span className="ml-2 text-gray-900">{applicationData.last_name || 'N/A'}</span>
                            </div>
                            {applicationData.middle_name && (
                                <div>
                                    <span className="font-medium text-gray-600">Middle Name:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.middle_name}</span>
                                </div>
                            )}
                            <div>
                                <span className="font-medium text-gray-600">Age:</span>
                                <span className="ml-2 text-gray-900">{applicationData.age || 'N/A'}</span>
                            </div>
                            {applicationData.gender && (
                                <div>
                                    <span className="font-medium text-gray-600">Gender:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.gender}</span>
                                </div>
                            )}
                            {applicationData.birth_date && (
                                <div>
                                    <span className="font-medium text-gray-600">Birth Date:</span>
                                    <span className="ml-2 text-gray-900">{new Date(applicationData.birth_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            {applicationData.marital_status && (
                                <div>
                                    <span className="font-medium text-gray-600">Marital Status:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.marital_status}</span>
                                </div>
                            )}
                            {applicationData.spouse_name && (
                                <div>
                                    <span className="font-medium text-gray-600">Spouse Name:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.spouse_name}</span>
                                </div>
                            )}
                            
                            {/* Contact Information */}
                            <div className="md:col-span-2">
                                <span className="font-medium text-gray-600">Complete Address:</span>
                                <span className="ml-2 text-gray-900">{applicationData.complete_address || 'N/A'}</span>
                            </div>
                            {applicationData.email && (
                                <div>
                                    <span className="font-medium text-gray-600">Email:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.email}</span>
                                </div>
                            )}
                            {applicationData.phone_number && (
                                <div>
                                    <span className="font-medium text-gray-600">Phone Number:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.phone_number}</span>
                                </div>
                            )}
                            
                            {/* Business Information */}
                            {applicationData.business_name && (
                                <div>
                                    <span className="font-medium text-gray-600">Business Name:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.business_name}</span>
                                </div>
                            )}
                            {applicationData.business_type && (
                                <div>
                                    <span className="font-medium text-gray-600">Business Type:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.business_type}</span>
                                </div>
                            )}
                            {applicationData.products_services_description && (
                                <div className="md:col-span-2">
                                    <span className="font-medium text-gray-600">Products/Services Description:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.products_services_description}</span>
                                </div>
                            )}
                            
                            {/* Occupant Information */}
                            {applicationData.actual_occupant && (
                                <div>
                                    <span className="font-medium text-gray-600">Actual Occupant:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.actual_occupant}</span>
                                </div>
                            )}
                            {applicationData.actual_occupant_first_name && (
                                <div>
                                    <span className="font-medium text-gray-600">Actual Occupant First Name:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.actual_occupant_first_name}</span>
                                </div>
                            )}
                            {applicationData.actual_occupant_last_name && (
                                <div>
                                    <span className="font-medium text-gray-600">Actual Occupant Last Name:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.actual_occupant_last_name}</span>
                                </div>
                            )}
                            {applicationData.actual_occupant_username && (
                                <div>
                                    <span className="font-medium text-gray-600">Actual Occupant Username:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.actual_occupant_username}</span>
                                </div>
                            )}
                            {applicationData.actual_occupant_phone && (
                                <div>
                                    <span className="font-medium text-gray-600">Actual Occupant Phone:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.actual_occupant_phone}</span>
                                </div>
                            )}
                            
                            {/* Application Dates */}
                            <div>
                                <span className="font-medium text-gray-600">Application Created:</span>
                                <span className="ml-2 text-gray-900">{new Date(applicationData.created_at).toLocaleDateString()}</span>
                            </div>
                            {applicationData.submitted_at && (
                                <div>
                                    <span className="font-medium text-gray-600">Application Submitted:</span>
                                    <span className="ml-2 text-gray-900">{new Date(applicationData.submitted_at).toLocaleDateString()}</span>
                                </div>
                            )}
                            {applicationData.approved_at && (
                                <div>
                                    <span className="font-medium text-gray-600">Application Approved:</span>
                                    <span className="ml-2 text-gray-900">{new Date(applicationData.approved_at).toLocaleDateString()}</span>
                                </div>
                            )}
                            {applicationData.rejected_at && (
                                <div>
                                    <span className="font-medium text-gray-600">Application Rejected:</span>
                                    <span className="ml-2 text-gray-900">{new Date(applicationData.rejected_at).toLocaleDateString()}</span>
                                </div>
                            )}
                            {applicationData.rejection_reason && (
                                <div className="md:col-span-2">
                                    <span className="font-medium text-gray-600">Rejection Reason:</span>
                                    <span className="ml-2 text-gray-900">{applicationData.rejection_reason}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents Submitted */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents Submitted</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Person Photo</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Barangay Clearance</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Government ID</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Birth Certificate</span>
                            </div>
                            <div className="flex items-center">
                                {applicationData.marriage_certificate ? (
                                    <>
                                        <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">Marriage Certificate</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-gray-500">Marriage Certificate (Not provided)</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center">
                                {applicationData.notarized_document ? (
                                    <>
                                        <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">Notarized Application Form</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-gray-500">Notarized Application Form (Not provided)</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Next Steps</h3>
                        {applicationData.status === 'pending_approval' ? (
                            <div className="space-y-3 text-blue-700">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Your application is under review</p>
                                        <p className="text-sm">Processing time: 3-5 business days</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Keep your application number safe</p>
                                        <p className="text-sm">Use <strong>{applicationData.application_number}</strong> for any inquiries</p>
                                    </div>
                                </div>
                            </div>
                        ) : applicationData.status === 'approved' ? (
                            <div className="space-y-3 text-green-700">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Congratulations! Your application is approved</p>
                                        <p className="text-sm">You will receive further instructions via email</p>
                                    </div>
                                </div>
                            </div>
                        ) : applicationData.status === 'approved_for_raffle' ? (
                            <div className="space-y-3 text-blue-700">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">You are participating in the raffle</p>
                                        <p className="text-sm">Your application has been approved for stall assignment</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Wait for raffle results</p>
                                        <p className="text-sm">You will be notified of your stall assignment</p>
                                    </div>
                                </div>
                            </div>
                        ) : applicationData.status === 'rejected' ? (
                            <div className="space-y-3 text-red-700">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Application rejected</p>
                                        <p className="text-sm">Please contact the office for more information</p>
                                    </div>
                                </div>
                            </div>
                        ) : applicationData.status === 'partially_approved' ? (
                            <div className="space-y-3 text-orange-700">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-orange-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Some documents need to be re-uploaded</p>
                                        <p className="text-sm">Please check your application status and re-upload rejected documents</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-orange-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Use your application number to check status</p>
                                        <p className="text-sm">Application Number: <strong>{applicationData.application_number}</strong></p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <ol className="space-y-3 text-blue-700">
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">1</span>
                                    <span>Have your application form notarized by a licensed notary public</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">2</span>
                                    <span>Visit the Toril Public Market Administration Office</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">3</span>
                                    <span>Pay the application fee of ₱400.00 and receive your Official Receipt</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">4</span>
                                    <span>Wait for processing (3-5 business days)</span>
                                </li>
                            </ol>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {applicationData.status === 'partially_approved' ? (
                            <Link
                                to={`/vendor-status?app=${applicationData.application_number}`}
                                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center"
                            >
                                Check Status & Re-upload Documents
                            </Link>
                        ) : applicationData.status === 'pending_approval' ? (
                            <>
                                <button
                                    onClick={handleViewRequirements}
                                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    View Complete Instructions
                                </button>
                                <button
                                    onClick={handleStartNewApplication}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Start New Application
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </main>

            <PaymentDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
            />

            {showCertificate && certificateData && (
                <AssignmentCertificate
                    certificateData={certificateData}
                    onClose={() => setShowCertificate(false)}
                />
            )}
        </div>
    )
}
