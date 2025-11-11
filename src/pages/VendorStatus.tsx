import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Simplified type definitions for nested relationships
interface Stall {
    id: string;
    stall_number: string;
    section_id: string;
}

interface StallApplication {
    id: string;
    stall_id: string;
    applied_at: string;
    stalls: Stall;
}

interface VendorApplication {
    id: string;
    application_number: string;
    assigned_stall_id?: string;
    assigned_section_name?: string;
    stall_applications?: StallApplication[];
    status?: string; // Allow any status string
    person_photo_approved?: boolean;
    person_photo_rejection_reason?: string;
    barangay_clearance_approved?: boolean;
    barangay_clearance_rejection_reason?: string;
    id_front_photo_approved?: boolean;
    id_front_photo_rejection_reason?: string;
    id_back_photo_approved?: boolean;
    id_back_photo_rejection_reason?: string;
    birth_certificate_approved?: boolean;
    birth_certificate_rejection_reason?: string;
    marriage_certificate_approved?: boolean;
    marriage_certificate_rejection_reason?: string;
    notarized_document_approved?: boolean;
    notarized_document_rejection_reason?: string;
    business_permit_approved?: boolean;
    business_permit_rejection_reason?: string;
    cedula_approved?: boolean;
    cedula_rejection_reason?: string;
}

// Refactor Application type to ensure compatibility
interface Application {
    id: string;
    application_number: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    complete_address?: string;
    age?: number;
    business_name?: string;
    phone_number?: string;
    actual_occupant_first_name?: string;
    actual_occupant_last_name?: string;
    actual_occupant_phone?: string;
    assigned_stall_id?: string;
    assigned_section_name?: string;
    status?: string; // Allow any status string
    username?: string;
    activated_at?: string;
    person_photo_approved?: boolean;
    person_photo_rejection_reason?: string;
    barangay_clearance_approved?: boolean;
    barangay_clearance_rejection_reason?: string;
    id_front_photo_approved?: boolean;
    id_front_photo_rejection_reason?: string;
    id_back_photo_approved?: boolean;
    id_back_photo_rejection_reason?: string;
    birth_certificate_approved?: boolean;
    birth_certificate_rejection_reason?: string;
    marriage_certificate_approved?: boolean;
    marriage_certificate_rejection_reason?: string;
    notarized_document_approved?: boolean;
    notarized_document_rejection_reason?: string;
    business_permit_approved?: boolean;
    business_permit_rejection_reason?: string;
    cedula_approved?: boolean;
    cedula_rejection_reason?: string;
}

export default function VendorStatus() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [applicationData, setApplicationData] = useState<any>(null)
    const [stallData, setStallData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Credential setup modal state
    const [showCredentialModal, setShowCredentialModal] = useState(false)
    const [generatedUsername, setGeneratedUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [credentialError, setCredentialError] = useState<string | null>(null)
    const [credentialSuccess, setCredentialSuccess] = useState<string | null>(null)

    // Add print styles
    const printStyles = `
        @media print {
            /* Hide everything */
            * {
                visibility: hidden !important;
            }
            
            /* Show only the certificate and its children */
            .certificate-container,
            .certificate-container * {
                visibility: visible !important;
            }
            
            /* Position certificate to fill the page */
            .certificate-container {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 20px !important;
                background: white !important;
                box-shadow: none !important;
            }
            
            /* Hide all other elements during print */
            .print\\:hidden,
            header,
            .min-h-screen > *:not(.certificate-container),
            .mb-8:not(.certificate-container),
            .max-w-4xl > *:not(.certificate-container) {
                display: none !important;
            }
            
            /* Ensure certificate colors print properly */
            .bg-gray-100 {
                background-color: white !important;
            }
            .border-gray-400 {
                border-color: black !important;
            }
            .text-gray-700,
            .text-gray-800 {
                color: black !important;
            }
            .bg-amber-100 {
                background-color: #fef3c7 !important;
            }
            .bg-green-100 {
                background-color: #dcfce7 !important;
            }
            .border-amber-600 {
                border-color: #d97706 !important;
            }
            .border-green-600 {
                border-color: #16a34a !important;
            }
            .text-amber-800 {
                color: #92400e !important;
            }
            .text-green-800 {
                color: #166534 !important;
            }
            
            /* Page settings */
            @page {
                margin: 0.5in;
                size: A4 portrait;
            }
            
            /* Remove any rounded corners for printing */
            .rounded-none {
                border-radius: 0 !important;
            }
        }
    `

    const applicationNumber = searchParams.get('app')

    // Generate username function (synchronous version that returns the username)
    const generateUsernameSync = async (firstName: string, lastName: string): Promise<string> => {
        const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '')
        const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '')

        // Create base username: first letter of first name + last name
        const baseUsername = `${cleanFirstName.charAt(0)}${cleanLastName}`

        try {
            // Check if base username exists - handle potential database schema issues
            const { data: existingUsers, error } = await (supabase as any)
                .from('vendor_profiles')
                .select('username')
                .ilike('username', `${baseUsername}%`)

            if (error) {
                console.warn('Error checking existing usernames, using random suffix:', error)
                // If there's a database error (like missing columns), use a random suffix
                return `${baseUsername}${Math.floor(Math.random() * 1000)}`
            }

            let finalUsername = baseUsername

            if (existingUsers && existingUsers.length > 0) {
                // Find the highest number suffix
                let maxNumber = 0
                existingUsers.forEach((user: any) => {
                    if (user.username === baseUsername) {
                        maxNumber = Math.max(maxNumber, 0)
                    } else if (user.username.startsWith(baseUsername)) {
                        const suffix = user.username.replace(baseUsername, '')
                        const num = parseInt(suffix)
                        if (!isNaN(num)) {
                            maxNumber = Math.max(maxNumber, num)
                        }
                    }
                })

                // If base username exists, add the next number
                if (maxNumber >= 0 && existingUsers.some((user: any) => user.username === baseUsername)) {
                    finalUsername = `${baseUsername}${maxNumber + 1}`
                }
            }

            return finalUsername
        } catch (error) {
            console.error('Error generating username:', error)
            // Fallback to a random username
            return `${baseUsername}${Math.floor(Math.random() * 1000)}`
        }
    }

    // Generate username function (sets state)
    const generateUsername = async (firstName: string, lastName: string) => {
        const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '')
        const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '')

        // Create base username: first letter of first name + last name
        const baseUsername = `${cleanFirstName.charAt(0)}${cleanLastName}`

        try {
            // Check if base username exists - handle potential database schema issues
            const { data: existingUsers, error } = await (supabase as any)
                .from('vendor_profiles')
                .select('username')
                .ilike('username', `${baseUsername}%`)

            if (error) {
                console.warn('Error checking existing usernames, using random suffix:', error)
                // If there's a database error (like missing columns), use a random suffix
                setGeneratedUsername(`${baseUsername}${Math.floor(Math.random() * 1000)}`)
                return
            }

            let finalUsername = baseUsername

            if (existingUsers && existingUsers.length > 0) {
                // Find the highest number suffix
                let maxNumber = 0
                existingUsers.forEach((user: any) => {
                    if (user.username === baseUsername) {
                        maxNumber = Math.max(maxNumber, 0)
                    } else if (user.username.startsWith(baseUsername)) {
                        const suffix = user.username.replace(baseUsername, '')
                        const num = parseInt(suffix)
                        if (!isNaN(num)) {
                            maxNumber = Math.max(maxNumber, num)
                        }
                    }
                })

                // If base username exists, add the next number
                if (maxNumber >= 0 && existingUsers.some((user: any) => user.username === baseUsername)) {
                    finalUsername = `${baseUsername}${maxNumber + 1}`
                }
            }

            setGeneratedUsername(finalUsername)
        } catch (error) {
            console.error('Error generating username:', error)
            // Fallback to a random username
            setGeneratedUsername(`${baseUsername}${Math.floor(Math.random() * 1000)}`)
        }
    }

    // Validate password function (no restrictions)
    const validatePassword = (password: string) => {
        if (password.length < 1) {
            return 'Password cannot be empty'
        }
        return null
    }

    // Handle credential setup
    const handleCredentialSetup = async (e: React.FormEvent) => {
        e.preventDefault()
        setCredentialError(null)
        setCredentialSuccess(null)


        // Validate passwords match
        if (password !== confirmPassword) {
            setCredentialError('Passwords do not match')
            return
        }

        // Validate password strength
        const passwordError = validatePassword(password)
        if (passwordError) {
            setCredentialError(passwordError)
            return
        }

        try {
            setSubmitting(true)

            // Generate username if not already generated
            let usernameToUse = generatedUsername
            if (!usernameToUse) {
                usernameToUse = await generateUsernameSync(applicationData.first_name, applicationData.last_name)
                setGeneratedUsername(usernameToUse)
            }

            // Check if username is already taken (handle potential database errors)
            try {
                const { data: existingUser, error: checkError } = await (supabase as any)
                    .from('vendor_profiles')
                    .select('id')
                    .eq('username', usernameToUse)
                    .single()

                if (checkError && checkError.code !== 'PGRST116') {
                    // PGRST116 is "not found" which is what we want
                    console.warn('Error checking existing username:', checkError)
                    // Continue anyway - we'll handle conflicts during creation
                }

                if (existingUser) {
                    usernameToUse = await generateUsernameSync(applicationData.first_name, applicationData.last_name)
                    setGeneratedUsername(usernameToUse)
                    setCredentialError('Username was taken, generated a new one. Please try again.')
                    return
                }
            } catch (error) {
                console.warn('Error checking username availability:', error)
                // Continue anyway - we'll handle conflicts during creation
            }

            // Use the vendor's actual email from their application
            const vendorEmail = applicationData.email
            const { data: authUser, error: signUpError } = await supabase.auth.signUp({
                email: vendorEmail,
                password: password,
                options: {
                    data: {
                        first_name: applicationData.first_name,
                        last_name: applicationData.last_name,
                        username: usernameToUse,
                        role: 'vendor'
                    }
                }
            })

            if (signUpError) {
                console.error('Error creating auth user:', signUpError)

                // Handle "User already registered" error
                if (signUpError.message.includes('User already registered') || signUpError.message.includes('already been registered')) {
                    setCredentialError('This email address is already registered. Please contact support if you need to reset your account.')
                    return
                } else {
                    setCredentialError('Failed to create account: ' + signUpError.message)
                    return
                }
            }

            // Ensure we have a username before creating the profile
            if (!usernameToUse) {
                setCredentialError('Username generation failed. Please try again.')
                return
            }

            // Create vendor profile - include all required NOT NULL fields
            const profileData: any = {
                auth_user_id: authUser.user?.id,
                first_name: applicationData.first_name || 'N/A',
                last_name: applicationData.last_name || 'N/A',
                email: vendorEmail,
                phone_number: applicationData.phone_number || 'N/A',
                username: usernameToUse, // This is required (NOT NULL)
                business_name: applicationData.business_name || 'N/A', // Required (NOT NULL)
                business_type: applicationData.business_type || 'N/A', // Required (NOT NULL)
                application_status: 'approved',
                status: 'Active',
                role: 'vendor'
            };

            const { error: profileError } = await (supabase as any)
                .from('vendor_profiles')
                .insert(profileData)

            if (profileError) {
                console.error('Error creating vendor profile:', profileError)
                console.error('Profile data that failed:', profileData)
                setCredentialError(`Failed to create vendor profile: ${profileError.message || 'Unknown error'}`)
                return
            }

            // Update the assigned stall to link it to the vendor profile
            if (applicationData.assigned_stall_id) {
                // First, get the vendor profile ID that was just created
                const { data: vendorProfile, error: profileFetchError } = await (supabase as any)
                    .from('vendor_profiles')
                    .select('id')
                    .eq('auth_user_id', authUser.user?.id)
                    .single()

                if (vendorProfile && !profileFetchError) {
                    const { error: stallUpdateError } = await (supabase as any)
                        .from('stalls')
                        .update({
                            vendor_profile_id: vendorProfile.id,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', applicationData.assigned_stall_id)

                    if (stallUpdateError) {
                        console.error('Error updating stall with vendor profile:', stallUpdateError)
                        // Don't fail the whole process, just log the error
                    }
                } else {
                    console.error('Error fetching vendor profile for stall update:', profileFetchError)
                }
            }

            // Update application status to activated and store username
            const { error: updateError } = await (supabase as any)
                .from('vendor_applications')
                .update({
                    status: 'activated',
                    username: usernameToUse,
                    activated_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationData.id)

            if (updateError) {
                console.error('Error updating application status:', updateError)
                setCredentialError('Failed to update application status.')
                return
            }

            setCredentialSuccess('Account created successfully! You can now log in to the mobile app.')

            // Refresh the application data to show the new status
            setTimeout(() => {
                fetchApplicationData()
                setShowCredentialModal(false)
            }, 2000)

        } catch (error) {
            console.error('Error setting up credentials:', error)
            setCredentialError('Failed to set up credentials. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (applicationNumber) {
            fetchApplicationData()
        } else {
            setError('No application number provided')
            setLoading(false)
        }
    }, [applicationNumber])

    // Refresh data when the page becomes visible (e.g., when returning from document submission)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && applicationNumber) {
                fetchApplicationData()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [applicationNumber])


    const fetchApplicationData = async () => {
        try {
            setLoading(true);

            if (!applicationNumber) {
                setError('Invalid application number');
                return;
            }

            // Explicitly cast the application object to the Application type
            const { data, error: appError } = await supabase
                .from('vendor_applications')
                .select(`
                    id,
                    application_number,
                    first_name,
                    middle_name,
                    last_name,
                    complete_address,
                    age,
                    assigned_stall_id,
                    assigned_section_name,
                    status,
                    username,
                    business_name,
                    phone_number,
                    actual_occupant_first_name,
                    actual_occupant_last_name,
                    actual_occupant_phone,
                    person_photo_approved,
                    person_photo_rejection_reason,
                    person_photo_reuploaded,
                    barangay_clearance_approved,
                    barangay_clearance_rejection_reason,
                    barangay_clearance_reuploaded,
                    id_front_photo_approved,
                    id_front_photo_rejection_reason,
                    id_front_photo_reuploaded,
                    id_back_photo_approved,
                    id_back_photo_rejection_reason,
                    id_back_photo_reuploaded,
                    birth_certificate_approved,
                    birth_certificate_rejection_reason,
                    birth_certificate_reuploaded,
                    marriage_certificate_approved,
                    marriage_certificate_rejection_reason,
                    marriage_certificate_reuploaded,
                    notarized_document_approved,
                    notarized_document_rejection_reason,
                    business_permit_approved,
                    business_permit_rejection_reason,
                    business_permit_document,
                    cedula_approved,
                    cedula_rejection_reason,
                    cedula_document
                `)
                .eq('application_number', applicationNumber)
                .single();

            if (appError || !data) {
                console.error('Error fetching application:', appError);
                setError('Application not found');
                return;
            }

            const application = data as Application; // Explicit cast
            setApplicationData(application);

            // Check if stall info is directly in vendor_applications table
            if (application.assigned_stall_id && application.assigned_section_name) {
                setStallData({
                    stalls: {
                        stall_number: application.assigned_stall_id,
                        market_sections: {
                            name: application.assigned_section_name,
                        },
                    },
                });
            }

            // If the vendor has won a raffle, fetch raffle details for relevant statuses
            // Note: partially_approved is for regular applications with rejected docs, not raffle winners
            if (
                application.status === 'won_raffle' ||
                application.status === 'documents_submitted' ||
                application.status === 'documents_approved' ||
                application.status === 'activated'
            ) {
                await fetchRaffleData(application.id);
            }
        } catch (error) {
            console.error('Error in fetchApplicationData:', error);
            setError('Failed to load application data');
        } finally {
            setLoading(false);
        }
    }

    const fetchRaffleData = async (vendorApplicationId: string) => {
        try {
            // Get raffle participant data with raffle event and stall information
            const { data: raffleParticipant, error: participantError } = await (supabase as any)
                .from('raffle_participants')
                .select(`
                    *,
                    raffle_events (
                        id,
                        event_name,
                        description,
                        conducted_at
                    )
                `)
                .eq('vendor_application_id', vendorApplicationId)
                .eq('is_winner', true)
                .single()

            if (participantError) {
                console.error('Error fetching raffle data:', participantError)
                return
            }

        } catch (error) {
            console.error('Error in fetchRaffleData:', error)
        }
    }

    const navigateToPhotoPage = (documentType: string) => {
        // Store the application ID, document type, and application number for the photo page
        localStorage.setItem('vendorApplicationId', applicationData.id)
        localStorage.setItem('reuploadDocumentType', documentType)
        localStorage.setItem('applicationNumber', applicationData.application_number)

        // Navigate to the appropriate photo page
        switch (documentType) {
            case 'person_photo':
                navigate('/vendor-application/photo-person')
                break
            case 'barangay_clearance':
                navigate('/vendor-application/photo-barangay')
                break
            case 'id_front_photo':
            case 'id_back_photo':
                navigate('/vendor-application/photo-id')
                break
            case 'birth_certificate':
                navigate('/vendor-application/photo-birth-cert')
                break
            case 'marriage_certificate':
                navigate('/vendor-application/photo-marriage-cert')
                break
            case 'notarized_document':
                navigate('/vendor-application/application-form')
                break
            default:
                console.error('Unknown document type:', documentType)
        }
    }


    const getApplicationStatusBadge = (status: string) => {
        const normalizedStatus = status?.toLowerCase();
        switch (normalizedStatus) {
            case 'approved':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">✓ Approved</span>
            case 'approved_for_raffle':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">🎲 Approved for Raffle</span>
            case 'won_raffle':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">🏆 Won Raffle</span>
            case 'documents_submitted':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">📋 Documents Submitted</span>
            case 'documents_approved':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">✅ Documents Approved</span>
            case 'activated':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">🎉 Activated</span>
            case 'partially_approved':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">⚠ Partially Approved</span>
            case 'pending':
            case 'pending_approval':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">⏳ Under Review</span>
            case 'rejected':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">✗ Rejected</span>
            case 'draft':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">📝 Draft</span>
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">{status || 'Unknown'}</span>
        }
    }

    const renderApplicationStatus = () => {
        return (
            <div className="application-status">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Status</h1>
                    <p className="text-gray-600">Track your vendor application progress</p>
                    <button
                        onClick={() => {
                            setLoading(true)
                            fetchApplicationData()
                        }}
                        disabled={loading}
                        className="mt-4 inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Refreshing...' : 'Refresh Status'}
                    </button>
                    {/* Debug info - remove this later */}
                    <div className="mt-2 text-xs text-gray-500">
                        Debug: Status = "{applicationData?.status}" | Stall: {stallData?.stalls?.stall_number || 'Loading'} | Section: {stallData?.stalls?.market_sections?.name || 'Loading'} | Has Business Permit: {applicationData?.business_permit_document ? 'Yes' : 'No'} | Has Cedula: {applicationData?.cedula_document ? 'Yes' : 'No'}
                    </div>
                </div>

                {/* Application Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">Application Number:</span>
                            <span className="ml-2 text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                                {applicationData.application_number}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Status:</span>
                            <span className="ml-2">
                                {getApplicationStatusBadge(applicationData.status)}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Name:</span>
                            <span className="ml-2 text-gray-900">{applicationData.first_name} {applicationData.last_name}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Age:</span>
                            <span className="ml-2 text-gray-900">{applicationData.age}</span>
                        </div>
                        <div className="md:col-span-2">
                            <span className="font-medium text-gray-600">Address:</span>
                            <span className="ml-2 text-gray-900">{applicationData.complete_address}</span>
                        </div>
                        {applicationData.spouse_name && (
                            <div>
                                <span className="font-medium text-gray-600">Spouse:</span>
                                <span className="ml-2 text-gray-900">{applicationData.spouse_name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rejected Documents Section - Show when status is partially_approved */}
                {applicationData.status === 'partially_approved' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-orange-800 mb-4">Action Required - Re-upload Documents</h2>
                        <p className="text-orange-700 text-sm mb-4">
                            Some of your documents have been rejected and need to be re-uploaded. Please see the details below and re-upload the rejected documents.
                        </p>

                        <div className="space-y-4">
                            {/* Check each document type for rejection */}
                            {applicationData.person_photo_approved === false && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Person Photo</h4>
                                            <p className="text-sm text-red-600 mt-1">
                                                <strong>Rejection Reason:</strong> {applicationData.person_photo_rejection_reason}
                                            </p>
                                            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                <p className="text-xs text-blue-700">
                                                    <strong>Required:</strong> Clear photo of yourself (face visible, good lighting, no sunglasses)
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigateToPhotoPage('person_photo')}
                                            disabled={applicationData.person_photo_reuploaded}
                                            className={`px-4 py-2 rounded-lg text-sm flex-shrink-0 transition-colors ${
                                                applicationData.person_photo_reuploaded
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {applicationData.person_photo_reuploaded ? 'Re-uploaded' : 'Re-upload Photo'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {applicationData.barangay_clearance_approved === false && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Barangay Clearance</h4>
                                            <p className="text-sm text-red-600 mt-1">
                                                <strong>Rejection Reason:</strong> {applicationData.barangay_clearance_rejection_reason}
                                            </p>
                                            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                <p className="text-xs text-blue-700">
                                                    <strong>Required:</strong> Photo of the official Barangay Clearance document with stamps and signatures
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigateToPhotoPage('barangay_clearance')}
                                            disabled={applicationData.barangay_clearance_reuploaded}
                                            className={`px-4 py-2 rounded-lg text-sm flex-shrink-0 transition-colors ${
                                                applicationData.barangay_clearance_reuploaded
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {applicationData.barangay_clearance_reuploaded ? 'Re-uploaded' : 'Re-upload Document'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(applicationData.id_front_photo_approved === false || applicationData.id_back_photo_approved === false) && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Government ID</h4>
                                            <div className="text-sm text-red-600 mt-1 space-y-1">
                                                {applicationData.id_front_photo_approved === false && (
                                                    <p><strong>Front ID Rejection:</strong> {applicationData.id_front_photo_rejection_reason}</p>
                                                )}
                                                {applicationData.id_back_photo_approved === false && (
                                                    <p><strong>Back ID Rejection:</strong> {applicationData.id_back_photo_rejection_reason}</p>
                                                )}
                                            </div>
                                            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                <p className="text-xs text-blue-700">
                                                    <strong>Required:</strong> Clear photos of both front and back of a valid government ID (not a selfie holding the ID)
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Determine which ID photo was rejected
                                                if (applicationData.id_front_photo_approved === false && applicationData.id_back_photo_approved === false) {
                                                    // Both rejected - pass 'both'
                                                    navigateToPhotoPage('id_both_photo')
                                                } else if (applicationData.id_front_photo_approved === false) {
                                                    // Only front rejected
                                                    navigateToPhotoPage('id_front_photo')
                                                } else {
                                                    // Only back rejected
                                                    navigateToPhotoPage('id_back_photo')
                                                }
                                            }}
                                            disabled={applicationData.id_front_photo_reuploaded && applicationData.id_back_photo_reuploaded}
                                            className={`px-4 py-2 rounded-lg text-sm flex-shrink-0 transition-colors ${
                                                applicationData.id_front_photo_reuploaded && applicationData.id_back_photo_reuploaded
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {applicationData.id_front_photo_reuploaded && applicationData.id_back_photo_reuploaded ? 'Re-uploaded' : 'Re-upload ID'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {applicationData.birth_certificate_approved === false && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Birth Certificate</h4>
                                            <p className="text-sm text-red-600 mt-1">
                                                <strong>Rejection Reason:</strong> {applicationData.birth_certificate_rejection_reason}
                                            </p>
                                            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
                                                <p className="text-sm text-red-800 font-medium mb-2">⚠️ Important:</p>
                                                <p className="text-xs text-red-700">
                                                    Upload a photo of your <strong>PSA-certified Birth Certificate document</strong>, not a photo of yourself.
                                                    The document should be the official paper with government seal and signatures.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigateToPhotoPage('birth_certificate')}
                                            disabled={applicationData.birth_certificate_reuploaded}
                                            className={`px-4 py-2 rounded-lg text-sm flex-shrink-0 transition-colors ${
                                                applicationData.birth_certificate_reuploaded
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {applicationData.birth_certificate_reuploaded ? 'Re-uploaded' : 'Re-upload Document'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {applicationData.marriage_certificate_approved === false && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Marriage Certificate</h4>
                                            <p className="text-sm text-red-600 mt-1">
                                                <strong>Rejection Reason:</strong> {applicationData.marriage_certificate_rejection_reason}
                                            </p>
                                            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                <p className="text-xs text-blue-700">
                                                    <strong>Required:</strong> Photo of the official Marriage Certificate document with government seals and signatures
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigateToPhotoPage('marriage_certificate')}
                                            disabled={applicationData.marriage_certificate_reuploaded}
                                            className={`px-4 py-2 rounded-lg text-sm flex-shrink-0 transition-colors ${
                                                applicationData.marriage_certificate_reuploaded
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {applicationData.marriage_certificate_reuploaded ? 'Re-uploaded' : 'Re-upload Document'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {applicationData.notarized_document_approved === false && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Notarized Document</h4>
                                            <p className="text-sm text-red-600 mt-1">
                                                <strong>Rejection Reason:</strong> {applicationData.notarized_document_rejection_reason}
                                            </p>
                                            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                <p className="text-xs text-blue-700">
                                                    <strong>Required:</strong> Photo of the completed and notarized application form with notary seal and signature
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigateToPhotoPage('notarized_document')}
                                            disabled={applicationData.notarized_document_reuploaded}
                                            className={`px-4 py-2 rounded-lg text-sm flex-shrink-0 transition-colors ${
                                                applicationData.notarized_document_reuploaded
                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {applicationData.notarized_document_reuploaded ? 'Re-uploaded' : 'Re-upload Document'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {applicationData.business_permit_approved === false && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Business Permit</h4>
                                            <p className="text-sm text-red-600 mt-1">
                                                <strong>Rejection Reason:</strong> {applicationData.business_permit_rejection_reason}
                                            </p>
                                            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                <p className="text-xs text-blue-700">
                                                    <strong>Required:</strong> Clear photo of your valid Business Permit document
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/raffle-winner-documents?app=${applicationData.application_number}`}
                                            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm flex-shrink-0 transition-colors"
                                        >
                                            Re-upload Document
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {applicationData.cedula_approved === false && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h4 className="font-medium text-red-800">Cedula (Community Tax Certificate)</h4>
                                            <p className="text-sm text-red-600 mt-1">
                                                <strong>Rejection Reason:</strong> {applicationData.cedula_rejection_reason}
                                            </p>
                                            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                <p className="text-xs text-blue-700">
                                                    <strong>Required:</strong> Clear photo of your valid Cedula (Community Tax Certificate)
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/raffle-winner-documents?app=${applicationData.application_number}`}
                                            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm flex-shrink-0 transition-colors"
                                        >
                                            Re-upload Document
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 p-4 bg-orange-100 border border-orange-300 rounded-lg">
                            <h4 className="font-medium text-orange-800 mb-2">Important Notes:</h4>
                            <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                                <li><strong>Upload photos of actual documents</strong> - not selfies or photos of yourself</li>
                                <li>For certificates: Take photos of the official paper documents with stamps/seals</li>
                                <li>For ID: Photo the ID card itself (both front and back), not yourself holding it</li>
                                <li>Ensure documents are clear, readable, and well-lit</li>
                                <li>Make sure all information is visible and not cut off</li>
                                <li>After re-uploading, your application will be reviewed again</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Next Steps - Show for won_raffle status */}
                {applicationData.status === 'won_raffle' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Additional Documents Required</h3>
                            <p className="text-blue-700 text-sm mb-4">
                                To activate your vendor certificate and complete the process, please submit:
                            </p>
                            <ul className="list-disc list-inside text-blue-700 text-sm mb-6 space-y-1">
                                <li>Business Permit</li>
                                <li>Cedula (Community Tax Certificate)</li>
                            </ul>
                            <Link
                                to={`/raffle-winner-documents?app=${applicationData.application_number}`}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Submit Required Documents
                            </Link>
                        </div>
                    </div>
                )}

                {/* Documents Under Review - Show for documents_submitted status */}
                {applicationData.status === 'documents_submitted' && (
                    <>
                        {/* Check if any raffle winner documents are rejected */}
                        {(applicationData.business_permit_approved === false || applicationData.cedula_approved === false) ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                                <h2 className="text-xl font-semibold text-orange-800 mb-4">Action Required - Re-upload Documents</h2>
                                <p className="text-orange-700 text-sm mb-4">
                                    Some of your documents have been rejected and need to be re-uploaded. Please see the details below and re-upload the rejected documents.
                                </p>

                                <div className="space-y-4">
                                    {applicationData.business_permit_approved === false && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 mr-4">
                                                    <h4 className="font-medium text-red-800">Business Permit</h4>
                                                    <p className="text-sm text-red-600 mt-1">
                                                        <strong>Rejection Reason:</strong> {applicationData.business_permit_rejection_reason}
                                                    </p>
                                                    <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                        <p className="text-xs text-blue-700">
                                                            <strong>Required:</strong> Clear photo of your valid Business Permit document
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/raffle-winner-documents?app=${applicationData.application_number}`}
                                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm flex-shrink-0 transition-colors"
                                                >
                                                    Re-upload Document
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {applicationData.cedula_approved === false && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 mr-4">
                                                    <h4 className="font-medium text-red-800">Cedula (Community Tax Certificate)</h4>
                                                    <p className="text-sm text-red-600 mt-1">
                                                        <strong>Rejection Reason:</strong> {applicationData.cedula_rejection_reason}
                                                    </p>
                                                    <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                                        <p className="text-xs text-blue-700">
                                                            <strong>Required:</strong> Clear photo of your valid Cedula (Community Tax Certificate)
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/raffle-winner-documents?app=${applicationData.application_number}`}
                                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm flex-shrink-0 transition-colors"
                                                >
                                                    Re-upload Document
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 p-4 bg-orange-100 border border-orange-300 rounded-lg">
                                    <h4 className="font-medium text-orange-800 mb-2">Important Notes:</h4>
                                    <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                                        <li>Upload photos of actual documents - not selfies or photos of yourself</li>
                                        <li>Ensure documents are clear, readable, and well-lit</li>
                                        <li>Make sure all information is visible and not cut off</li>
                                        <li>After re-uploading, your documents will be reviewed again</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">⏳</div>
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Documents Under Review</h3>
                                    <p className="text-yellow-700 text-sm">
                                        Your Business Permit and Cedula are being reviewed by the admin.
                                        You will be notified once they are approved and you can proceed to account setup.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Documents Approved - Ready for Credential Setup */}
                {applicationData.status === 'documents_approved' && (
                    <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🎉</div>
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Documents Approved!</h3>
                                <p className="text-green-700 text-sm mb-4">
                                    Congratulations! Your Business Permit and Cedula have been approved.
                                    You can now set up your account credentials to access the mobile app.
                                </p>
                                <button
                                    onClick={async () => {
                                        await generateUsername(applicationData.first_name, applicationData.last_name)
                                        setShowCredentialModal(true)
                                    }}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Set Up Account Credentials
                                </button>
                            </div>
                        </div>

                        {/* Show Vendor Credentials */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Primary Vendor</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {applicationData.first_name} {applicationData.middle_name} {applicationData.last_name}
                                    </p>
                                </div>
                                {applicationData.actual_occupant_first_name && applicationData.actual_occupant_last_name && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-600 mb-1">Actual Occupant</p>
                                        <p className="text-base font-semibold text-blue-900">
                                            {applicationData.actual_occupant_first_name} {applicationData.actual_occupant_last_name}
                                        </p>
                                        {applicationData.actual_occupant_phone && (
                                            <p className="text-sm text-blue-700 mt-1">
                                                📱 {applicationData.actual_occupant_phone}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Business Name</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {applicationData.business_name || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Contact Number</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {applicationData.phone_number || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Certificate Activated - Show for activated status */}
                {applicationData.status === 'activated' && (
                    <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                            <div className="text-center">
                                <div className="text-4xl mb-4">✅</div>
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Certificate Activated</h3>
                                <p className="text-green-700 text-sm mb-4">
                                    Your vendor certificate is now fully activated! You can access the mobile app and start managing your stall.
                                </p>
                                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                                    <p className="text-green-800 text-sm font-medium mb-2">Mobile App Login Credentials:</p>
                                    <div className="bg-white rounded-lg p-3 mb-2">
                                        <p className="text-xs text-gray-600 mb-1">Username:</p>
                                        <p className="text-base font-mono font-bold text-green-800">{applicationData.username || 'N/A'}</p>
                                    </div>
                                    <p className="text-green-700 text-xs mt-2">
                                        Use this username and your password to log in to the Mapalengke mobile app.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Show Vendor Credentials for Activated Status */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Primary Vendor</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {applicationData.first_name} {applicationData.middle_name} {applicationData.last_name}
                                    </p>
                                </div>
                                {applicationData.actual_occupant_first_name && applicationData.actual_occupant_last_name && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-600 mb-1">Actual Occupant</p>
                                        <p className="text-base font-semibold text-blue-900">
                                            {applicationData.actual_occupant_first_name} {applicationData.actual_occupant_last_name}
                                        </p>
                                        {applicationData.actual_occupant_phone && (
                                            <p className="text-sm text-blue-700 mt-1">
                                                📱 {applicationData.actual_occupant_phone}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Business Name</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {applicationData.business_name || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Contact Number</p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {applicationData.phone_number || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading application status...</p>
                </div>
            </div>
        )
    }

    if (error || !applicationData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h1>
                    <p className="text-gray-600 mb-4">{error || 'The application number you provided is invalid.'}</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Start New Application
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <style dangerouslySetInnerHTML={{ __html: printStyles }} />
            {/* Header */}
            <header className="bg-gray-800 text-white print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-4">
                        <div className="flex items-center">
                            <a href="/" className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                <span className="text-white font-bold text-sm sm:text-lg">M</span>
                            </a>
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
                    {renderApplicationStatus()}

                    {/* Credential Setup Modal */}
                    {showCredentialModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
                            <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    {/* Modal Header */}
                                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Set Up Account Credentials</h3>
                                        <button
                                            onClick={() => setShowCredentialModal(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                                        >
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Success Message */}
                                    {credentialSuccess && (
                                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs sm:text-sm font-medium text-green-800">{credentialSuccess}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Error Message */}
                                    {credentialError && (
                                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs sm:text-sm font-medium text-red-800">{credentialError}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Form */}
                                    <form onSubmit={handleCredentialSetup} className="space-y-4 sm:space-y-6">
                                        {/* Generated Username */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Generated Username
                                            </label>
                                            <input
                                                type="text"
                                                value={generatedUsername}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                This username will be used to log in to the mobile app
                                            </p>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your password"
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Confirm your password"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowCredentialModal(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {submitting ? 'Creating Account...' : 'Create Account'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

        </div>
    )
}

