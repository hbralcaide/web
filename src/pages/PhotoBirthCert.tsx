// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { uploadPhoto } from '../utils/photoUpload'
import { supabase } from '../lib/supabase'

export default function PhotoBirthCert() {
    const navigate = useNavigate()
    const [photo, setPhoto] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [uploading, setUploading] = useState(false)
    const [maritalStatus, setMaritalStatus] = useState<string>('')

    // Load saved data when component mounts
    useEffect(() => {
        // Check if this is a re-upload scenario
        const isReupload = localStorage.getItem('reuploadDocumentType') === 'birth_certificate'
        
        if (isReupload) {
            // Don't load the previous photo for re-upload
            console.log('Re-upload mode: Starting fresh without previous photo')
            // Still load marital status for navigation
            const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
            if (applicationData.maritalStatus) {
                setMaritalStatus(applicationData.maritalStatus)
            }
            return
        }
        
        const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
        if (applicationData.birthCertificate) {
            setPreview(applicationData.birthCertificate.preview)
            // Create a mock file object for the saved photo
            const mockFile = new File([''], applicationData.birthCertificate.name, {
                type: applicationData.birthCertificate.type
            })
            setPhoto(mockFile)
        }
        // Load marital status for conditional navigation
        if (applicationData.maritalStatus) {
            setMaritalStatus(applicationData.maritalStatus)
        }
    }, [])

    const savePhotoToDatabase = async (photoUrl: string) => {
        try {
            const vendorApplicationId = localStorage.getItem('vendorApplicationId')
            if (!vendorApplicationId) {
                throw new Error('No application ID found')
            }

            // Check if this is a reupload
            const isReupload = localStorage.getItem('reuploadDocumentType') === 'birth_certificate'
            
            const updateData: any = {
                birth_certificate: photoUrl,
                birth_certificate_approved: null, // Reset approval status for re-review
            }
            
            // If reupload, mark as re-uploaded
            if (isReupload) {
                updateData.birth_certificate_reuploaded = true
            }

            const { error } = await supabase
                .from('vendor_applications')
                .update(updateData)
                .eq('id', vendorApplicationId)

            if (error) throw error
        } catch (error) {
            console.error('Error saving photo to database:', error)
            throw error
        }
    }

    const handlePhotoUpload = async (file: File) => {
        try {
            setUploading(true)
            setError('')

            const vendorApplicationId = localStorage.getItem('vendorApplicationId')
            if (!vendorApplicationId) {
                throw new Error('No application ID found')
            }

            // Upload photo to Supabase Storage
            const result = await uploadPhoto(file, vendorApplicationId, 'birth_certificate')

            if (result.success && result.url) {
                // Save photo URL to database
                await savePhotoToDatabase(result.url)

                // Save to localStorage for backup
                const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
                applicationData.birthCertificate = {
                    url: result.url,
                    name: file.name,
                    type: file.type,
                    preview: preview
                }
                localStorage.setItem('vendorApplicationData', JSON.stringify(applicationData))

                console.log('Photo uploaded successfully:', result.url)
            } else {
                throw new Error(result.error || 'Upload failed')
            }
        } catch (error: any) {
            console.error('Photo upload error:', error)
            setError(error.message || 'Failed to upload photo')
        } finally {
            setUploading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file')
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB')
                return
            }

            setPhoto(file)
            setError('')

            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)

            // Upload to Supabase Storage
            handlePhotoUpload(file)
        }
    }

    const handleTakePhoto = async () => {
        try {
            // Check if getUserMedia is supported
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Request camera access
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Back camera for documents
                })

                // Create a video element to show camera feed
                const video = document.createElement('video')
                video.srcObject = stream
                video.play()

                // Create a modal for camera preview
                const modal = document.createElement('div')
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                `

                const videoContainer = document.createElement('div')
                videoContainer.style.cssText = `
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                `

                video.style.cssText = `
                    width: 400px;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 8px;
                `

                const buttonContainer = document.createElement('div')
                buttonContainer.style.cssText = `
                    display: flex;
                    gap: 10px;
                `

                const captureBtn = document.createElement('button')
                captureBtn.textContent = 'Capture Photo'
                captureBtn.style.cssText = `
                    background: #1f2937;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                `

                const cancelBtn = document.createElement('button')
                cancelBtn.textContent = 'Cancel'
                cancelBtn.style.cssText = `
                    background: #6b7280;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                `

                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                captureBtn.onclick = () => {
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    ctx?.drawImage(video, 0, 0)

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
                            setPhoto(file)
                            setError('')

                            // Create preview
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                setPreview(e.target?.result as string)
                            }
                            reader.readAsDataURL(file)

                            // Upload to Supabase Storage
                            handlePhotoUpload(file)
                        }
                    }, 'image/jpeg', 0.8)

                    // Stop camera and remove modal
                    stream.getTracks().forEach(track => track.stop())
                    document.body.removeChild(modal)
                }

                cancelBtn.onclick = () => {
                    stream.getTracks().forEach(track => track.stop())
                    document.body.removeChild(modal)
                }

                buttonContainer.appendChild(captureBtn)
                buttonContainer.appendChild(cancelBtn)
                videoContainer.appendChild(video)
                videoContainer.appendChild(buttonContainer)
                modal.appendChild(videoContainer)
                document.body.appendChild(modal)

            } else {
                // Fallback to file input for older browsers
                const cameraInput = document.getElementById('photo-camera') as HTMLInputElement
                if (cameraInput) {
                    cameraInput.value = ''
                    cameraInput.click()
                }
            }
        } catch (error) {
            console.error('Error accessing camera:', error)
            setError('Unable to access camera. Please use "Upload Photo" instead.')
        }
    }

    const handleRetake = () => {
        setPhoto(null)
        setPreview(null)
        setError('')
    }

    const handleNext = () => {
        if (!photo) {
            setError('Please take or upload a photo before proceeding')
            return
        }

        // Check if this is a re-upload scenario
        const reuploadDocumentType = localStorage.getItem('reuploadDocumentType')
        const applicationNumber = localStorage.getItem('applicationNumber')

        if (reuploadDocumentType && applicationNumber) {
            // This is a re-upload, redirect back to vendor status page
            localStorage.removeItem('reuploadDocumentType')
            navigate(`/vendor-status?app=${applicationNumber}`)
            return
        }

        // Normal application flow
        const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
        applicationData.birthCertificate = {
            name: photo.name,
            size: photo.size,
            type: photo.type,
            preview: preview
        }
        localStorage.setItem('vendorApplicationData', JSON.stringify(applicationData))

        // Check marital status to determine next step
        if (applicationData.maritalStatus === 'Single') {
            // Skip marriage certificate page for single applicants
            navigate('/vendor-application/application-form')
        } else {
            // Go to marriage certificate page for married/widow/widower
            navigate('/vendor-application/photo-marriage-cert')
        }
    }

    const handlePrevious = () => {
        // Save current photo data before going back
        if (photo) {
            const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
            applicationData.birthCertificate = {
                name: photo.name,
                size: photo.size,
                type: photo.type,
                preview: preview
            }
            localStorage.setItem('vendorApplicationData', JSON.stringify(applicationData))
        }

        navigate('/vendor-application/photo-id')
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
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold">Step 5: Birth Certificate</h1>
                        <Link
                            to="/vendor-application/photo-id"
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            ← Back to Government ID
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-800">Personal Info</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-800">Photo Person</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-800">Barangay Clearance</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-800">Government ID</span>
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="h-1 bg-gray-200 rounded">
                                <div className="h-1 bg-green-600 rounded" style={{ width: maritalStatus === 'Single' ? '100%' : '83.33%' }}></div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-800">Birth Certificate</span>
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold ml-2">5</div>
                        </div>
                        {maritalStatus !== 'Single' && (
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500">Marriage Certificate</span>
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold ml-2">6</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Birth Certificate Photo</h2>
                        <p className="text-gray-600">Please take a clear photo of your PSA-certified Birth Certificate.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Instructions - Left Side */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Requirements:</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 mr-3 mt-0.5">1</span>
                                        <span>PSA-certified Birth Certificate only</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 mr-3 mt-0.5">2</span>
                                        <span>Document must be complete and readable</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 mr-3 mt-0.5">3</span>
                                        <span>No glare or shadows on the document</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 mr-3 mt-0.5">4</span>
                                        <span>File size must be less than 5MB</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Photo Upload Area - Right Side */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                {preview ? (
                                    <div className="space-y-4">
                                        <div className="mx-auto max-w-md">
                                            <img
                                                src={preview}
                                                alt="Birth certificate preview"
                                                className="w-full h-auto rounded-lg shadow-sm"
                                            />
                                        </div>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={handleRetake}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Retake Photo
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Use This Photo
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Take or Upload Photo</h3>
                                            <p className="text-gray-600 mb-4">Take a clear photo of your Birth Certificate or upload an existing photo</p>
                                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="photo-camera"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleTakePhoto}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Take Photo
                                                </button>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="photo-upload"
                                                />
                                                <label
                                                    htmlFor="photo-upload"
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Photo
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6">
                        <button
                            onClick={handlePrevious}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!photo || uploading}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Next →'
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
