import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RaffleWinnerDocuments() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [applicationData, setApplicationData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Preview and submission states
    const [previewImage, setPreviewImage] = useState<{ type: 'business_permit' | 'cedula', url: string } | null>(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Camera states
    const [showCamera, setShowCamera] = useState<'business_permit' | 'cedula' | null>(null)
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const applicationNumber = searchParams.get('app')

    useEffect(() => {
        if (applicationNumber) {
            fetchApplicationData()
        } else {
            setError('No application number provided')
            setLoading(false)
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
                setError('Application not found')
                return
            }

            // Allow raffle winners and those who have submitted documents (for resubmission)
            if (application.status !== 'won_raffle' && application.status !== 'documents_submitted') {
                setError('This page is only accessible to raffle winners')
                return
            }

            setApplicationData(application)
        } catch (error) {
            console.error('Error in fetchApplicationData:', error)
            setError('Failed to load application data')
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: 'business_permit' | 'cedula') => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, etc.)')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB')
            return
        }

        try {
            setError(null)

            // Convert file to base64 for preview
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = reader.result as string
                setPreviewImage({ type: documentType, url: base64String })
            }

            reader.onerror = () => {
                setError('Error reading file. Please try again.')
            }

            reader.readAsDataURL(file)
        } catch (error) {
            console.error('Error uploading file:', error)
            setError('Failed to process file. Please try again.')
        }
    }

    const handleSubmitDocument = async () => {
        if (!previewImage) return

        try {
            setUploading(true)
            setError(null)

            const documentType = previewImage.type
            const updateField = documentType === 'business_permit' ? 'business_permit_document' : 'cedula_document'
            const approvalField = documentType === 'business_permit' ? 'business_permit_approved' : 'cedula_approved'
            const rejectionField = documentType === 'business_permit' ? 'business_permit_rejection_reason' : 'cedula_rejection_reason'
            
            const { error: updateError } = await (supabase as any)
                .from('vendor_applications')
                .update({
                    [updateField]: previewImage.url,
                    [approvalField]: null, // Reset to pending when resubmitting
                    [rejectionField]: null, // Clear rejection reason
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationData.id)

            if (updateError) {
                console.error('Error updating document:', updateError)
                setError('Failed to upload document. Please try again.')
                return
            }

            // Update local state
            const updatedData = {
                ...applicationData,
                [updateField]: previewImage.url,
                [approvalField]: null,
                [rejectionField]: null
            }
            setApplicationData(updatedData)

            // Clear preview
            setPreviewImage(null)

            // Show a simple success message for individual document upload
            setSuccess(`${documentType === 'business_permit' ? 'Business Permit' : 'Cedula'} uploaded successfully!`)
            setTimeout(() => setSuccess(null), 3000)
        } catch (error) {
            console.error('Error uploading file:', error)
            setError('Failed to upload document. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    // Camera functions
    const startCamera = async (documentType: 'business_permit' | 'cedula') => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Use back camera if available
            })
            setCameraStream(stream)
            setShowCamera(documentType)
            setError(null)

            // Wait for video element to be available
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            }, 100)
        } catch (err) {
            console.error('Error accessing camera:', err)
            setError('Unable to access camera. Please check permissions or use file upload instead.')
        }
    }

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop())
            setCameraStream(null)
        }
        setShowCamera(null)
    }

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || !showCamera) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (!context) return

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (!blob) return

            try {
                setError(null)

                // Convert blob to base64 for preview
                const reader = new FileReader()
                reader.onload = () => {
                    const base64String = reader.result as string
                    setPreviewImage({ type: showCamera!, url: base64String })
                    stopCamera()
                }

                reader.onerror = () => {
                    setError('Error processing photo. Please try again.')
                }

                reader.readAsDataURL(blob)
            } catch (error) {
                console.error('Error capturing photo:', error)
                setError('Failed to capture photo. Please try again.')
            }
        }, 'image/jpeg', 0.8)
    }

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop())
            }
        }
    }, [cameraStream])

    const handleSubmitDocuments = async () => {
        if (!applicationData.business_permit_document || !applicationData.cedula_document) {
            setError('Please upload both Business Permit and Cedula before submitting.')
            return
        }

        try {
            setUploading(true)
            setError(null)

            // Update status to indicate documents have been submitted for approval
            const { error: updateError } = await (supabase as any)
                .from('vendor_applications')
                .update({
                    status: 'documents_submitted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationData.id)

            if (updateError) {
                console.error('Error submitting documents:', updateError)
                setError('Failed to submit documents. Please try again.')
                return
            }

            // Show success modal
            setShowSuccessModal(true)

        } catch (error) {
            console.error('Error submitting documents:', error)
            setError('Failed to submit documents. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const getDocumentStatus = (documentType: 'business_permit' | 'cedula') => {
        const approvedField = documentType === 'business_permit' ? 'business_permit_approved' : 'cedula_approved'
        const rejectionField = documentType === 'business_permit' ? 'business_permit_rejection_reason' : 'cedula_rejection_reason'

        const isApproved = applicationData?.[approvedField]
        const rejectionReason = applicationData?.[rejectionField]

        if (isApproved === true) {
            return { status: 'approved', reason: null }
        } else if (isApproved === false) {
            return { status: 'rejected', reason: rejectionReason }
        } else {
            return { status: 'pending', reason: null }
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Approved</span>
            case 'rejected':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">✗ Rejected</span>
            case 'pending':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⏳ Pending Review</span>
            default:
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Submitted</span>
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

    if (error && !applicationData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link
                        to="/vendor-application"
                        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        )
    }

    const businessPermitStatus = getDocumentStatus('business_permit')
    const cedulaStatus = getDocumentStatus('cedula')
    const allDocumentsApproved = businessPermitStatus.status === 'approved' && cedulaStatus.status === 'approved'
    
    // Check if any document was rejected (for resubmission flow)
    const hasRejectedDocuments = businessPermitStatus.status === 'rejected' || cedulaStatus.status === 'rejected'
    
    // Check if documents have been uploaded (either initially or re-uploaded)
    const hasUploadedDocuments = applicationData?.business_permit_document && applicationData?.cedula_document

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-4">
                        <div className="flex items-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                <span className="text-white font-bold text-sm sm:text-lg">M</span>
                            </div>
                            <div>
                                <div className="text-sm sm:text-lg font-bold">REPUBLIC OF THE PHILIPPINES</div>
                                <div className="text-xs sm:text-sm font-semibold">DEPARTMENT OF TRADE AND INDUSTRY</div>
                                <div className="text-xs hidden sm:block">TORIL PUBLIC MARKET - MAPALENGKE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">🏆 Raffle Winner - Additional Documents</h1>
                        <p className="text-sm sm:text-base text-gray-600">Submit your Business Permit and Cedula to complete your vendor activation</p>
                    </div>

                    {/* Application Info */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-purple-800 mb-3 sm:mb-4">Application Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-medium text-purple-600">Application Number:</span>
                                <span className="mt-1 sm:mt-0 sm:ml-2 text-purple-900 font-mono bg-purple-100 px-2 py-1 rounded inline-block">
                                    {applicationData?.application_number}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-medium text-purple-600">Name:</span>
                                <span className="mt-1 sm:mt-0 sm:ml-2 text-purple-900">
                                    {applicationData?.first_name} {applicationData?.last_name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                            <p className="text-sm sm:text-base text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                            <p className="text-sm sm:text-base text-green-700">{success}</p>
                        </div>
                    )}

                    {/* Documents Section - Side by Side on Desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Business Permit - Only show if not approved */}
                        {businessPermitStatus.status !== 'approved' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Business Permit</h3>
                                        {getStatusBadge(businessPermitStatus.status)}
                                    </div>
                                </div>

                                {businessPermitStatus.reason && (
                                    <div className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded mb-3 sm:mb-4">
                                        <strong>Rejection Reason:</strong> {businessPermitStatus.reason}
                                    </div>
                                )}

                                {applicationData?.business_permit_document && (
                                    <div className="mb-3 sm:mb-4">
                                        <img
                                            src={applicationData.business_permit_document}
                                            alt="Business Permit"
                                            className="w-full max-w-[200px] h-auto aspect-square object-cover rounded border mx-auto"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                        Upload Business Permit:
                                    </label>
                                    <div className="space-y-2 sm:space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'business_permit')}
                                            disabled={uploading}
                                            className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                                        />
                                        <div className="text-center">
                                            <span className="text-gray-500 text-xs sm:text-sm">or</span>
                                        </div>
                                        <button
                                            onClick={() => startCamera('business_permit')}
                                            disabled={uploading}
                                            className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="hidden sm:inline">Take Photo with Camera</span>
                                            <span className="sm:hidden">Take Photo</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cedula - Only show if not approved */}
                        {cedulaStatus.status !== 'approved' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Cedula (CTC)</h3>
                                        {getStatusBadge(cedulaStatus.status)}
                                    </div>
                                </div>

                                {cedulaStatus.reason && (
                                    <div className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded mb-3 sm:mb-4">
                                        <strong>Rejection Reason:</strong> {cedulaStatus.reason}
                                    </div>
                                )}

                                {applicationData?.cedula_document && (
                                    <div className="mb-3 sm:mb-4">
                                        <img
                                            src={applicationData.cedula_document}
                                            alt="Cedula"
                                            className="w-full max-w-[200px] h-auto aspect-square object-cover rounded border mx-auto"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                        Upload Cedula:
                                    </label>
                                    <div className="space-y-2 sm:space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'cedula')}
                                            disabled={uploading}
                                            className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                                        />
                                        <div className="text-center">
                                            <span className="text-gray-500 text-xs sm:text-sm">or</span>
                                        </div>
                                        <button
                                            onClick={() => startCamera('cedula')}
                                            disabled={uploading}
                                            className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="hidden sm:inline">Take Photo with Camera</span>
                                            <span className="sm:hidden">Take Photo</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                        {/* Show submit button if:
                            1. Documents are not all approved, AND
                            2. Either: status is not 'documents_submitted' OR documents were rejected and re-uploaded
                        */}
                        {!allDocumentsApproved && (
                            applicationData?.status !== 'documents_submitted' || 
                            (hasRejectedDocuments && hasUploadedDocuments)
                        ) ? (
                            <button
                                onClick={handleSubmitDocuments}
                                disabled={uploading || !applicationData?.business_permit_document || !applicationData?.cedula_document}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95"
                            >
                                {uploading ? 'Processing...' : hasRejectedDocuments ? 'Resubmit Documents for Review' : 'Submit Documents for Review'}
                            </button>
                        ) : null}

                        {allDocumentsApproved && (
                            <button
                                onClick={() => navigate(`/vendor-credential-setup?app=${applicationData.application_number}`)}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors active:scale-95"
                            >
                                Continue to Account Setup
                            </button>
                        )}

                        <Link
                            to={`/`}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center active:scale-95"
                        >
                            Back to Status
                        </Link>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mt-6 sm:mt-8">
                        <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Document Requirements</h3>
                        <ul className="text-blue-700 text-xs sm:text-sm space-y-1">
                            <li>• Business Permit: Clear photo of your valid business permit</li>
                            <li>• Cedula: Clear photo of your Community Tax Certificate (Cedula)</li>
                            <li>• Both documents must be readable and valid</li>
                            <li>• Maximum file size: 5MB per document</li>
                            <li>• Supported formats: JPG, PNG, GIF</li>
                        </ul>
                    </div>
                </div>
            </main>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-semibold">
                                Take Photo - {showCamera === 'business_permit' ? 'Business Permit' : 'Cedula'}
                            </h3>
                            <button
                                onClick={stopCamera}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-64 sm:h-80 bg-black rounded-lg object-cover"
                            />
                            <canvas
                                ref={canvasRef}
                                className="hidden"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                            <button
                                onClick={capturePhoto}
                                disabled={uploading}
                                className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Capture Photo
                                    </>
                                )}
                            </button>
                            <button
                                onClick={stopCamera}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center">
                            <p>Position the document clearly in the camera view and click "Capture Photo"</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Preview {previewImage.type === 'business_permit' ? 'Business Permit' : 'Cedula'}
                            </h2>
                            <div className="mb-4 sm:mb-6">
                                <img
                                    src={previewImage.url}
                                    alt="Preview"
                                    className="w-full rounded-lg border border-gray-300"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitDocument}
                                    disabled={uploading}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95"
                                >
                                    {uploading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit Document'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-4 sm:p-6 text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Document Submitted!</h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                Your document has been successfully submitted and is now waiting for admin review.
                            </p>
                            <button
                                onClick={() => navigate(`/`)}
                                className="inline-block w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium active:scale-95"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
