import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function VendorStatus() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [applicationData, setApplicationData] = useState<any>(null)
    const [raffleData, setRaffleData] = useState<any>(null)
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
            }

            // Add optional fields if they exist
            try {
                if (applicationData.id) profileData.vendor_application_id = applicationData.id
                if (applicationData.middle_name) profileData.middle_name = applicationData.middle_name
                if (applicationData.complete_address) profileData.complete_address = applicationData.complete_address
            } catch (e) {
                console.warn('Some profile fields may not be supported:', e)
            }

            console.log('Creating vendor profile with data:', profileData)
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
            if (applicationData.assigned_stall) {
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
                        .eq('id', applicationData.assigned_stall)

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

    // Custom print function for certificate only
    const printCertificate = () => {
        const certificateElement = document.getElementById('certificate-to-print')
        if (!certificateElement) return

        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const certificateHTML = certificateElement.outerHTML

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certificate - ${applicationData.first_name} ${applicationData.last_name}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Times New Roman', serif;
                        background: white;
                        padding: 0;
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.4;
                    }
                    .certificate-container {
                        width: 100%;
                        max-width: none;
                        margin: 0;
                        padding: 30px 40px;
                        background: white;
                        border: 3px solid black;
                        border-radius: 0;
                        min-height: auto;
                        box-sizing: border-box;
                        page-break-inside: avoid;
                    }
                    
                    /* Header styles */
                    .flex {
                        display: flex;
                    }
                    .items-start {
                        align-items: flex-start;
                    }
                    .items-center {
                        align-items: center;
                    }
                    .justify-between {
                        justify-content: space-between;
                    }
                    .justify-center {
                        justify-content: center;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .text-left {
                        text-align: left;
                    }
                    .text-justify {
                        text-align: justify;
                    }
                    .flex-shrink-0 {
                        flex-shrink: 0;
                    }
                    .flex-grow {
                        flex-grow: 1;
                    }
                    .mx-4 {
                        margin-left: 1rem;
                        margin-right: 1rem;
                    }
                    .mb-1 {
                        margin-bottom: 0.3rem;
                    }
                    .mb-2 {
                        margin-bottom: 0.4rem;
                    }
                    .mb-4 {
                        margin-bottom: 0.8rem;
                    }
                    .mb-6 {
                        margin-bottom: 1rem;
                    }
                    .mb-8 {
                        margin-bottom: 1.5rem;
                    }
                    .mb-16 {
                        margin-bottom: 2rem;
                    }
                    
                    /* Logo styles */
                    .w-20 {
                        width: 5rem;
                    }
                    .h-20 {
                        height: 5rem;
                    }
                    .rounded-full {
                        border-radius: 50%;
                    }
                    .border-4 {
                        border-width: 4px;
                    }
                    .bg-amber-100 {
                        background-color: #fef3c7;
                    }
                    .bg-green-100 {
                        background-color: #dcfce7;
                    }
                    .border-amber-600 {
                        border-color: #d97706;
                        border-style: solid;
                    }
                    .border-green-600 {
                        border-color: #16a34a;
                        border-style: solid;
                    }
                    .text-amber-800 {
                        color: #92400e;
                    }
                    .text-green-800 {
                        color: #166534;
                    }
                    
                    /* Typography */
                    .text-xs {
                        font-size: 0.75rem;
                    }
                    .text-sm {
                        font-size: 0.875rem;
                    }
                    .text-lg {
                        font-size: 1.125rem;
                    }
                    .text-xl {
                        font-size: 1.25rem;
                    }
                    .text-2xl {
                        font-size: 1.5rem;
                    }
                    .font-bold {
                        font-weight: bold;
                    }
                    .font-medium {
                        font-weight: 500;
                    }
                    .leading-relaxed {
                        line-height: 1.625;
                    }
                    .underline {
                        text-decoration: underline;
                    }
                    
                    /* Colors */
                    .text-gray-700,
                    .text-gray-800,
                    .text-black {
                        color: black;
                    }
                    .border-gray-400 {
                        border-color: black;
                    }
                    .border-black {
                        border-color: black;
                        border-style: solid;
                    }
                    .border {
                        border-width: 1px;
                    }
                    
                    /* Layout utilities */
                    .px-3 {
                        padding-left: 0.75rem;
                        padding-right: 0.75rem;
                    }
                    .py-1 {
                        padding-top: 0.25rem;
                        padding-bottom: 0.25rem;
                    }
                    .inline-block {
                        display: inline-block;
                    }
                    
                    @page {
                        margin: 0.3in;
                        size: A4 landscape;
                    }
                    
                    @media print {
                        body {
                            padding: 0;
                            margin: 0;
                        }
                        .certificate-container {
                            padding: 25px 35px;
                            border: 2px solid black;
                            width: 100%;
                            max-width: none;
                            box-sizing: border-box;
                            page-break-inside: avoid;
                            height: auto;
                            min-height: auto;
                        }
                        .mb-1 {
                            margin-bottom: 0.2rem !important;
                        }
                        .mb-2 {
                            margin-bottom: 0.3rem !important;
                        }
                        .mb-4 {
                            margin-bottom: 0.6rem !important;
                        }
                        .mb-6 {
                            margin-bottom: 0.8rem !important;
                        }
                        .mb-8 {
                            margin-bottom: 1rem !important;
                        }
                        .mb-16 {
                            margin-bottom: 1.5rem !important;
                        }
                        /* Prevent page breaks */
                        .flex, .text-center, .text-justify {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                ${certificateHTML}
            </body>
            </html>
        `)

        printWindow.document.close()
        printWindow.focus()

        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print()
            printWindow.close()
        }, 250)
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
            setLoading(true)

            // Use the same query as Vendors.tsx - include stall_applications relationship
            const { data: application, error: appError } = await (supabase as any)
                .from('vendor_applications')
                .select(`
                    *,
                    stall_applications(
                        id,
                        stall_id,
                        applied_at,
                        stalls(
                            id,
                            stall_number,
                            section_id
                        )
                    )
                `)
                .eq('application_number', applicationNumber)
                .single()

            if (appError) {
                console.error('Error fetching application:', appError)
                setError('Application not found')
                return
            }

            setApplicationData(application)

            // Check if stall info is directly in vendor_applications table first
            if (application.assigned_stall && application.assigned_section) {
                setStallData({
                    stalls: {
                        stall_number: application.assigned_stall,
                        market_sections: {
                            name: application.assigned_section
                        }
                    }
                })
            } else if (application.stall_applications && application.stall_applications.length > 0) {
                // Use the same logic as Vendors.tsx to get stall info from the relationship
                const stallData = application.stall_applications[0];

                if (stallData.stalls && stallData.stalls.stall_number) {
                    const stallNumber = stallData.stalls.stall_number;

                    // Determine section from stall number prefix (same logic as Vendors.tsx)
                    let sectionName = '';
                    if (stallNumber.startsWith('F-')) {
                        sectionName = 'Fish';
                    } else if (stallNumber.startsWith('FV-')) {
                        sectionName = 'Fruits & Vegetables';
                    } else if (stallNumber.startsWith('M-')) {
                        sectionName = 'Meat';
                    } else if (stallNumber.startsWith('D-')) {
                        sectionName = 'Dry Goods';
                    } else if (stallNumber.startsWith('G-')) {
                        sectionName = 'General Merchandise';
                    } else {
                        sectionName = 'Unknown';
                    }

                    setStallData({
                        stalls: {
                            stall_number: stallNumber,
                            market_sections: {
                                name: sectionName
                            }
                        }
                    })
                }
            }

            // If the vendor has won a raffle, fetch raffle details
            if (application.status === 'won_raffle' || application.status === 'documents_submitted' || application.status === 'activated') {
                await fetchRaffleData(application.id)
            }
        } catch (error) {
            console.error('Error in fetchApplicationData:', error)
            setError('Failed to load application data')
        } finally {
            setLoading(false)
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

            setRaffleData(raffleParticipant)
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
        switch (status) {
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
            case 'pending_approval':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">⏳ Under Review</span>
            case 'rejected':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">✗ Rejected</span>
            case 'draft':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">📝 Draft</span>
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Unknown</span>
        }
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
                        to="/vendor-application"
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
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex-shrink-0"
                                            >
                                                Re-upload Photo
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
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex-shrink-0"
                                            >
                                                Re-upload Document
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
                                                onClick={() => navigateToPhotoPage('id_front_photo')}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex-shrink-0"
                                            >
                                                Re-upload ID
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
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex-shrink-0"
                                            >
                                                Re-upload Document
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
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex-shrink-0"
                                            >
                                                Re-upload Document
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
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex-shrink-0"
                                            >
                                                Re-upload Document
                                            </button>
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

                    {/* Certificate Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Certificate Information</h2>
                            {(applicationData.status === 'won_raffle' || applicationData.status === 'documents_submitted' || applicationData.status === 'documents_approved' || applicationData.status === 'activated') && stallData && (
                                <button
                                    onClick={printCertificate}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Certificate
                                </button>
                            )}
                        </div>

                        {/* Show Certificate for Raffle Winners and Activated Vendors */}
                        {(applicationData.status === 'won_raffle' || applicationData.status === 'documents_submitted' || applicationData.status === 'documents_approved' || applicationData.status === 'activated') ? (
                            <div id="certificate-to-print" className="certificate-container bg-white border-2 border-gray-400 rounded-none p-8 mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
                                {/* Header with Logos and Title */}
                                <div className="flex items-start justify-between mb-6">
                                    {/* Left Logo - Davao City */}
                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-600 flex items-center justify-center">
                                            <div className="text-amber-800 font-bold text-xs text-center">
                                                <div>LUNGSOD</div>
                                                <div>NG DAVAO</div>
                                                <div className="text-xs">SAGISAG</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Header Text */}
                                    <div className="text-center flex-grow mx-4">
                                        <div className="text-sm text-gray-700 mb-1">City of Davao</div>
                                        <div className="text-sm text-gray-700 mb-1">Office of the City Administrator</div>
                                        <div className="text-lg font-bold text-black mb-1">CITY ECONOMIC ENTERPRISE</div>
                                        <div className="text-lg font-bold text-black mb-2">TORIL PUBLIC MARKET</div>
                                        <div className="text-sm text-gray-700">Contact No.: (082) 315-9348</div>
                                    </div>

                                    {/* Right Logo - Philippines */}
                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-600 flex items-center justify-center">
                                            <div className="text-green-800 font-bold text-xs text-center">
                                                <div>REPUBLIKA</div>
                                                <div>NG</div>
                                                <div>PILIPINAS</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Number */}
                                <div className="text-left mb-6">
                                    <div className="border border-black px-3 py-1 inline-block text-sm">
                                        Market Operation Form No. 3 ver. 1
                                    </div>
                                </div>

                                {/* Certification Title */}
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl font-bold underline text-black">CERTIFICATION</h1>
                                </div>

                                {/* Certificate Content */}
                                <div className="text-justify leading-relaxed mb-8 text-black">
                                    <p className="mb-4">
                                        This is to certify that <strong className="font-bold">{applicationData.first_name?.toUpperCase()} {applicationData.last_name?.toUpperCase()}</strong> is the AWARDEE of <strong>Stall No. {stallData?.stalls?.stall_number || 'N/A'}, {stallData?.stalls?.market_sections?.name?.toUpperCase() || 'N/A'} SECTION, Market Building 2, Toril Public Market</strong>.
                                    </p>

                                    <p className="mb-4">
                                        He/She has no outstanding obligation as of <strong className="font-bold">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}</strong>.
                                    </p>

                                    <p className="mb-6">
                                        This certification is issued upon the request of <strong className="font-bold">{applicationData.first_name?.toUpperCase()} {applicationData.last_name?.toUpperCase()}</strong> in connection with his/her <strong>application for renewal of business permit for CY {new Date().getFullYear()}</strong>.
                                    </p>

                                    <p className="mb-8">
                                        Given this <strong>{new Date().getDate()}<sup>{new Date().getDate() === 1 || new Date().getDate() === 21 || new Date().getDate() === 31 ? 'st' : new Date().getDate() === 2 || new Date().getDate() === 22 ? 'nd' : new Date().getDate() === 3 || new Date().getDate() === 23 ? 'rd' : 'th'}</sup></strong> day of <strong>{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}, Davao City, Philippines</strong>.
                                    </p>
                                </div>

                                {/* Signatures */}
                                <div className="flex justify-between items-end mb-8">
                                    <div className="text-center">
                                        <div className="mb-16">
                                            <div className="font-bold text-black">ELAINE JOY Y. LAHORA</div>
                                            <div className="text-sm text-black">District Treasurer</div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="mb-16">
                                            <div className="font-bold text-black">JANE A. FERNANDEZ</div>
                                            <div className="text-sm text-black">Officer-in-Charge</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section */}
                                <div className="flex justify-between items-end">
                                    <div className="text-sm text-black">
                                        <div>O.R. No.: <strong>{applicationData.application_number}D</strong></div>
                                        <div>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
                                        <div>Amount: <strong>100.00</strong></div>
                                    </div>

                                    <div className="border border-black px-4 py-1 text-sm">
                                        FILE COPY
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">📄</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Certificate Available</h3>
                                    <p className="text-gray-600 text-sm">
                                        Certificate information will be available after winning the raffle and completing the activation process.
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* Certificate Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Next Steps</h2>


                            {/* Document Submission Requirements - Show after certificate */}
                            {applicationData.status === 'won_raffle' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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

                            {/* Documents Under Review */}
                            {applicationData.status === 'documents_submitted' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
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

                            {/* Documents Approved - Ready for Credential Setup */}
                            {applicationData.status === 'documents_approved' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
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
                            )}

                            {/* Certificate Activated */}
                            {applicationData.status === 'activated' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">✅</div>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">Certificate Activated</h3>
                                        <p className="text-green-700 text-sm mb-4">
                                            Your vendor certificate is now fully activated! You can access the mobile app and start managing your stall.
                                        </p>
                                        <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                                            <p className="text-green-800 text-sm font-medium">Mobile App Access:</p>
                                            <p className="text-green-700 text-sm mt-1">
                                                Use your credentials to log in to the Mapalengke mobile app and start operating your stall.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </main>

            {/* Credential Setup Modal */}
            {showCredentialModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Set Up Account Credentials</h3>
                                <button
                                    onClick={() => setShowCredentialModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Success Message */}
                            {credentialSuccess && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">{credentialSuccess}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {credentialError && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">{credentialError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleCredentialSetup} className="space-y-6">
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
    )
}
