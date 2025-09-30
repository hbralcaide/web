import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function VendorCredentialSetup() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [applicationData, setApplicationData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form state
    const [generatedUsername, setGeneratedUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')

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

            // Check if vendor has won raffle and documents are approved
            if (application.status !== 'documents_approved') {
                setError('Your documents must be approved by admin before setting up credentials')
                return
            }

            setApplicationData(application)
            generateUsername(application.first_name, application.last_name)
        } catch (error) {
            console.error('Error in fetchApplicationData:', error)
            setError('Failed to load application data')
        } finally {
            setLoading(false)
        }
    }

    const generateUsername = (firstName: string, lastName: string) => {
        // Generate username: firstname + lastname + random 3 digits
        const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '')
        const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '')
        const randomDigits = Math.floor(100 + Math.random() * 900)
        const username = `${cleanFirstName}${cleanLastName}${randomDigits}`
        setGeneratedUsername(username)
    }

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long'
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Password must contain at least one lowercase letter'
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Password must contain at least one uppercase letter'
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Password must contain at least one number'
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        // Validate email
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address')
            return
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Validate password strength
        const passwordError = validatePassword(password)
        if (passwordError) {
            setError(passwordError)
            return
        }

        try {
            setSubmitting(true)

            // Check if username is already taken
            const { data: existingUser, error: checkError } = await (supabase as any)
                .from('vendor_profiles')
                .select('id')
                .eq('username', generatedUsername)
                .single()

            if (existingUser) {
                // Generate a new username if taken
                generateUsername(applicationData.first_name, applicationData.last_name)
                setError('Username was taken, generated a new one. Please try again.')
                return
            }

            // Create auth user account
            const { data: authUser, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: applicationData.first_name,
                        last_name: applicationData.last_name,
                        username: generatedUsername,
                        role: 'vendor'
                    }
                }
            })

            if (signUpError) {
                console.error('Error creating auth user:', signUpError)
                setError('Failed to create account: ' + signUpError.message)
                return
            }

            // Create vendor profile
            const { error: profileError } = await (supabase as any)
                .from('vendor_profiles')
                .insert({
                    auth_user_id: authUser.user?.id,
                    vendor_application_id: applicationData.id,
                    first_name: applicationData.first_name,
                    last_name: applicationData.last_name,
                    middle_name: applicationData.middle_name,
                    email: email,
                    username: generatedUsername,
                    phone_number: applicationData.phone_number,
                    complete_address: applicationData.complete_address,
                    business_name: applicationData.business_name,
                    business_type: applicationData.business_type,
                    application_status: 'approved',
                    status: 'Active',
                    role: 'vendor'
                })

            if (profileError) {
                console.error('Error creating vendor profile:', profileError)
                setError('Failed to create vendor profile. Please contact support.')
                return
            }

            // Update application status to activated
            const { error: updateError } = await (supabase as any)
                .from('vendor_applications')
                .update({
                    status: 'activated',
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationData.id)

            if (updateError) {
                console.error('Error updating application status:', updateError)
                // Don't fail here, just log the error
            }

            setSuccess('Account created successfully! You can now log in to the mobile app.')

            // Redirect after success
            setTimeout(() => {
                navigate(`/vendor-credential-success?app=${applicationData.application_number}&username=${generatedUsername}&email=${encodeURIComponent(email)}`)
            }, 2000)

        } catch (error) {
            console.error('Error setting up credentials:', error)
            setError('Failed to set up credentials. Please try again.')
        } finally {
            setSubmitting(false)
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
            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Account Setup</h1>
                        <p className="text-gray-600">Set up your mobile app credentials to complete your vendor activation</p>
            </div>

                    {/* Application Info */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">Congratulations!</h2>
                        <p className="text-green-700 text-sm mb-4">
                            Your documents have been approved and you can now set up your mobile app account.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-green-600">Application Number:</span>
                                <span className="ml-2 text-green-900 font-mono bg-green-100 px-2 py-1 rounded">
                                    {applicationData?.application_number}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-green-600">Name:</span>
                                <span className="ml-2 text-green-900">
                                    {applicationData?.first_name} {applicationData?.last_name}
                                </span>
                            </div>
                </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-green-700">{success}</p>
                        </div>
                    )}

                    {/* Credential Setup Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Generated Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Generated Username
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={generatedUsername}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => generateUsername(applicationData.first_name, applicationData.last_name)}
                                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Regenerate
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                This username will be used to log in to the mobile app
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email address"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                You'll receive notifications and account updates at this email
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
                            <div className="text-xs text-gray-500 mt-1 space-y-1">
                                <p>Password must contain:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li>At least 8 characters</li>
                                    <li>One uppercase letter</li>
                                    <li>One lowercase letter</li>
                                    <li>One number</li>
                                </ul>
                            </div>
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
                        <div className="flex justify-center gap-4">
                        <button
                            type="submit"
                                disabled={submitting || !password || !confirmPassword}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                                {submitting ? 'Creating Account...' : 'Create Account'}
                        </button>

                            <Link
                                to={`/vendor-status?app=${applicationData?.application_number}`}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Back to Status
                            </Link>
                        </div>
                    </form>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                        <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                        <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Your vendor account will be created and activated</li>
                            <li>• You can use your username and password to log in to the mobile app</li>
                            <li>• You'll be able to manage your stall and products through the app</li>
                            <li>• Your stall assignment will be finalized</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}