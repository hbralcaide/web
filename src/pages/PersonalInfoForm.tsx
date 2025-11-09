import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
// Removed unused type imports to fix TypeScript errors

export default function PersonalInfoForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleInitial: '',
        completeAddress: '',
        age: '',
        gender: '',
        birthDate: '',
        maritalStatus: '',
        spouse: '',
        actualOccupantFirstName: '',
        actualOccupantLastName: '',
        actualOccupantPhone: '',
        businessName: '',
        email: '',
        phoneNumber: ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Load saved data when component mounts, but only if we have an existing application ID
    useEffect(() => {
        const vendorApplicationId = localStorage.getItem('vendorApplicationId')

        // If there's no existing application ID, clear any old data and start fresh
        if (!vendorApplicationId) {
            localStorage.removeItem('vendorApplicationData')
            // Don't clear selectedStall - it's needed for the application form
            console.log('PersonalInfoForm: No vendorApplicationId, keeping selectedStall in localStorage')
            console.log('Current selectedStall:', localStorage.getItem('selectedStall'))
            return
        }

        // Only load saved data if we have an existing application
        const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
        if (applicationData.firstName || applicationData.lastName || applicationData.completeAddress) {
            setFormData({
                firstName: applicationData.firstName || '',
                lastName: applicationData.lastName || '',
                middleInitial: applicationData.middleInitial || '',
                completeAddress: applicationData.completeAddress || '',
                age: applicationData.age || '',
                gender: applicationData.gender || '',
                birthDate: applicationData.birthDate || '',
                maritalStatus: applicationData.maritalStatus || '',
                spouse: applicationData.spouse || '',
                actualOccupant: applicationData.actualOccupant || '',
                businessName: applicationData.businessName || '',
                email: applicationData.email || '',
                phoneNumber: applicationData.phoneNumber || ''
            })
        }
    }, [])

    // Function to generate unique application number using database function
    const generateApplicationNumber = async (): Promise<string> => {
        try {
            const { data, error } = await supabase.rpc('generate_application_number')
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error generating application number:', error)
            // Fallback to client-side generation if database function fails
            return Math.floor(100000 + Math.random() * 900000).toString()
        }
    }

    // Function to save/update vendor application in database
    const saveVendorApplication = async (data: any): Promise<string | null> => {
        try {

            // Check if we already have a vendor application ID
            let vendorApplicationId = localStorage.getItem('vendorApplicationId')

            if (vendorApplicationId) {
                // Update existing application
                const updateData = {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    middle_name: data.middleInitial || null,
                    age: data.age ? parseInt(data.age) : null,
                    gender: data.gender || null,
                    birth_date: data.birthDate || null,
                    marital_status: data.maritalStatus || null,
                    spouse_name: data.spouse || null,
                    complete_address: data.completeAddress,
                    actual_occupant_first_name: data.actualOccupantFirstName || null,
                    actual_occupant_last_name: data.actualOccupantLastName || null,
                    actual_occupant_phone: data.actualOccupantPhone ? `+63${data.actualOccupantPhone}` : null,
                    business_name: data.businessName || null,
                    email: data.email || null,
                    phone_number: data.phoneNumber ? `+63${data.phoneNumber}` : null,
                    updated_at: new Date().toISOString()
                }

                const { error } = await (supabase as any)
                    .from('vendor_applications')
                    .update(updateData)
                    .eq('id', vendorApplicationId)

                if (error) throw error
                return vendorApplicationId
            } else {
                // Create new application
                const applicationNumber = await generateApplicationNumber()

                const insertData = {
                    application_number: applicationNumber,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    middle_name: data.middleInitial || null,
                    age: data.age ? parseInt(data.age) : null,
                    gender: data.gender || null,
                    birth_date: data.birthDate || null,
                    marital_status: data.maritalStatus || null,
                    spouse_name: data.spouse || null,
                    complete_address: data.completeAddress,
                    actual_occupant_first_name: data.actualOccupantFirstName || null,
                    actual_occupant_last_name: data.actualOccupantLastName || null,
                    actual_occupant_phone: data.actualOccupantPhone ? `+63${data.actualOccupantPhone}` : null,
                    business_name: data.businessName || null,
                    email: data.email || null,
                    phone_number: data.phoneNumber ? `+63${data.phoneNumber}` : null,
                    status: 'draft'
                }

                const { data: newApplication, error } = await (supabase as any)
                    .from('vendor_applications')
                    .insert(insertData)
                    .select()
                    .single()

                if (error) throw error
                if (!newApplication) throw new Error('Failed to create application')

                // Store the application ID for future updates
                localStorage.setItem('vendorApplicationId', newApplication.id)
                return newApplication.id
            }
        } catch (error: any) {
            console.error('Error saving vendor application:', error)
            throw error
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        let formattedValue = value

        // Format name fields and address to uppercase all letters
        if (
            name === 'firstName' ||
            name === 'lastName' ||
            name === 'middleInitial' ||
            name === 'spouse' ||
            name === 'actualOccupant' ||
            name === 'actualOccupantFirstName' ||
            name === 'actualOccupantLastName' ||
            name === 'completeAddress'
        ) {
            formattedValue = value.toUpperCase()
        }

        // Format phone number - only allow numbers, max 10 digits, must start with 9
        if (name === 'phoneNumber' || name === 'actualOccupantPhone') {
            // Remove all non-numeric characters
            const numericValue = value.replace(/\D/g, '')

            // Only allow 10 digits
            if (numericValue.length <= 10) {
                formattedValue = numericValue
            } else {
                formattedValue = numericValue.slice(0, 10) // Limit to 10 digits
            }

            if (formattedValue && !formattedValue.startsWith('9')) {
                formattedValue = '' // Clear if it doesn't start with 9
            }
        }

        const newFormData = {
            ...formData,
            [name]: formattedValue
        }

        // Auto-calculate age when birth date is selected
        if (name === 'birthDate' && value) {
            const today = new Date()
            const birthDate = new Date(value)
            const age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()

            // Adjust age if birthday hasn't occurred this year
            const calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ? age - 1
                : age

            newFormData.age = calculatedAge.toString()
        }

        // If marital status changes to "Single", clear spouse name
        if (name === 'maritalStatus' && value === 'Single') {
            newFormData.spouse = ''
        }

        setFormData(newFormData)

        // Auto-save form data as user types
        const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
        const updatedData = { ...applicationData, ...newFormData }
        localStorage.setItem('vendorApplicationData', JSON.stringify(updatedData))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.completeAddress.trim()) newErrors.completeAddress = 'Address is required'
        if (!formData.age.trim()) newErrors.age = 'Age is required'
        if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 18)) {
            newErrors.age = 'Age must be 18 or above'
        }
        if (!formData.gender.trim()) newErrors.gender = 'Gender is required'
        if (!formData.birthDate.trim()) newErrors.birthDate = 'Birth date is required'
        if (!formData.maritalStatus.trim()) newErrors.maritalStatus = 'Marital status is required'
        if (formData.maritalStatus === 'Married' && !formData.spouse.trim()) {
            newErrors.spouse = 'Spouse name is required when married'
        }
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
        if (formData.phoneNumber && (formData.phoneNumber.length !== 10 || !formData.phoneNumber.startsWith('9'))) {
            newErrors.phoneNumber = 'Phone number must be 10 digits starting with 9'
        }
        // Actual occupant is optional - can be the applicant or someone they know

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                // Save to database
                await saveVendorApplication(formData)

                // Also save to localStorage for backup
                localStorage.setItem('vendorApplicationData', JSON.stringify(formData))

                // Navigate to next step
                navigate('/vendor-application/photo-person')
            } catch (error: any) {
                console.error('Error saving application:', error)
                alert('Failed to save application. Please try again.')
            }
        }
    }

    const handleBack = () => {
        // Save current form data before going back
        const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
        const updatedData = { ...applicationData, ...formData }
        localStorage.setItem('vendorApplicationData', JSON.stringify(updatedData))

        navigate('/vendor-application')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-3 sm:py-4">
                        <div className="flex items-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <span className="text-white font-bold text-base sm:text-lg">M</span>
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

            {/* Secondary Header */}
            <div className="bg-gray-700 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                        <h1 className="text-lg sm:text-xl font-semibold">Step 1: Personal Information</h1>
                        <Link
                            to="/vendor-application"
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            ← Back to Application
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progress Bar - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:block bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">1</div>
                            <span className="ml-2 text-sm font-medium text-gray-800">Personal Info</span>
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="h-1 bg-gray-200 rounded">
                                <div className="h-1 bg-gray-800 rounded" style={{ width: '16.66%' }}></div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500">Photo Person</span>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold ml-2">2</div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500">Barangay Clearance</span>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold ml-2">3</div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500">Government ID</span>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold ml-2">4</div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500">Birth Certificate</span>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold ml-2">5</div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500">Marriage Certificate</span>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold ml-2">6</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Progress Indicator */}
            <div className="md:hidden bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">Step 1 of 6</span>
                        <div className="flex-1 mx-4">
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div className="h-2 bg-gray-800 rounded-full" style={{ width: '16.66%' }}></div>
                            </div>
                        </div>
                        <span className="text-sm text-gray-600">Personal Info</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-8">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                        <p className="text-sm sm:text-base text-gray-600">Please provide your personal details for the vendor application.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label htmlFor="middleInitial" className="block text-sm font-medium text-gray-700 mb-2">
                                    Middle Initial
                                </label>
                                <input
                                    type="text"
                                    id="middleInitial"
                                    name="middleInitial"
                                    value={formData.middleInitial}
                                    onChange={handleInputChange}
                                    maxLength={1}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    placeholder="M"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your last name"
                                />
                                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="completeAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                Complete Address *
                            </label>
                            <textarea
                                id="completeAddress"
                                name="completeAddress"
                                value={formData.completeAddress}
                                onChange={handleInputChange}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.completeAddress ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your complete address"
                            />
                            {errors.completeAddress && <p className="mt-1 text-sm text-red-600">{errors.completeAddress}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Birth Date *
                                </label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.birthDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                                    Age *
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                                    placeholder="Auto-calculated"
                                />
                                <p className="mt-1 text-xs text-gray-500">Automatically calculated from birth date</p>
                                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Male', 'Female'].map((gender) => (
                                        <label key={gender} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={gender}
                                                checked={formData.gender === gender}
                                                onChange={handleInputChange}
                                                className="mr-2 text-gray-600 focus:ring-gray-500"
                                            />
                                            <span className="text-sm text-gray-700">{gender}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Marital Status *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Single', 'Married', 'Widow', 'Widower'].map((status) => (
                                    <label key={status} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="maritalStatus"
                                            value={status}
                                            checked={formData.maritalStatus === status}
                                            onChange={handleInputChange}
                                            className="mr-2 text-gray-600 focus:ring-gray-500"
                                        />
                                        <span className="text-sm text-gray-700">{status}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.maritalStatus && <p className="mt-1 text-sm text-red-600">{errors.maritalStatus}</p>}
                        </div>

                        {formData.maritalStatus === 'Married' && (
                            <div>
                                <label htmlFor="spouse" className="block text-sm font-medium text-gray-700 mb-2">
                                    Spouse Name *
                                </label>
                                <input
                                    type="text"
                                    id="spouse"
                                    name="spouse"
                                    value={formData.spouse}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.spouse ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter spouse name"
                                />
                                {errors.spouse && <p className="mt-1 text-sm text-red-600">{errors.spouse}</p>}
                            </div>
                        )}

                        {/* Business Information Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>

                            <div>
                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Name *
                                </label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.businessName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your business name"
                                />
                                {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 text-sm">+63</span>
                                        </div>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="9XXXXXXXXX"
                                            maxLength={10}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Enter 10-digit mobile number starting with 9</p>
                                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Actual Occupant (if not yourself)</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        id="actualOccupantFirstName"
                                        name="actualOccupantFirstName"
                                        value={formData.actualOccupantFirstName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        id="actualOccupantLastName"
                                        name="actualOccupantLastName"
                                        value={formData.actualOccupantLastName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        placeholder="Last Name"
                                    />
                                </div>
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 text-sm">+63</span>
                                        </div>
                                        <input
                                            type="tel"
                                            id="actualOccupantPhone"
                                            name="actualOccupantPhone"
                                            value={formData.actualOccupantPhone}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            placeholder="9XXXXXXXXX"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Leave blank if you will be the actual occupant</p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                            <button
                                onClick={handleBack}
                                className="w-full sm:w-auto px-6 py-3 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 active:scale-95 transition-all"
                            >
                                Next: Take Photo
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
