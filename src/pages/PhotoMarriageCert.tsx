// @ts-nocheck
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { uploadPhoto } from '../utils/photoUpload'

export default function PhotoMarriageCert() {
    const navigate = useNavigate()
    const [photo, setPhoto] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [uploading, setUploading] = useState(false)

    // Load saved data when component mounts
    useEffect(() => {
        // Check if this is a re-upload scenario
        const isReupload = localStorage.getItem('reuploadDocumentType') === 'marriage_certificate'
        
        if (isReupload) {
            // Don't load the previous photo for re-upload
            console.log('Re-upload mode: Starting fresh without previous photo')
            return
        }
        
        const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
        if (applicationData.marriageCertificate) {
            setPreview(applicationData.marriageCertificate.preview)
            // Create a mock file object for the saved photo
            const mockFile = new File([''], applicationData.marriageCertificate.name, {
                type: applicationData.marriageCertificate.type
            })
            setPhoto(mockFile)
        }
    }, [])

    const savePhotoToDatabase = async (photoUrl: string) => {
        try {
            const vendorApplicationId = localStorage.getItem('vendorApplicationId')
            if (!vendorApplicationId) {
                throw new Error('No application ID found')
            }

            // Check if this is a reupload
            const isReupload = localStorage.getItem('reuploadDocumentType') === 'marriage_certificate'
            
            const updateData: any = {
                marriage_certificate: photoUrl,
                marriage_certificate_approved: null, // Reset approval status for re-review
            }
            
            // If reupload, mark as re-uploaded
            if (isReupload) {
                updateData.marriage_certificate_reuploaded = true
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB')
                return
            }

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
            const result = await uploadPhoto(file, vendorApplicationId, 'marriage_certificate')

            if (result.success && result.url) {
                // Save photo URL to database
                await savePhotoToDatabase(result.url)

                // Save to localStorage for backup
                const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
                applicationData.marriageCertificate = {
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
                            const file = new File([blob], 'marriage-cert-photo.jpg', { type: 'image/jpeg' })
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
        applicationData.marriageCertificate = {
            name: photo.name,
            size: photo.size,
            type: photo.type,
            preview: preview
        }
        localStorage.setItem('vendorApplicationData', JSON.stringify(applicationData))

        navigate('/vendor-application/application-form')
    }

    const handlePrevious = () => {
        // Save current photo data before going back
        if (photo) {
            const applicationData = JSON.parse(localStorage.getItem('vendorApplicationData') || '{}')
            applicationData.marriageCertificate = {
                name: photo.name,
                size: photo.size,
                type: photo.type,
                preview: preview
            }
            localStorage.setItem('vendorApplicationData', JSON.stringify(applicationData))
        }

        navigate('/vendor-application/photo-birth-cert')
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
                        <h1 className="text-xl font-semibold">Step 6: Marriage Certificate</h1>
                        <Link
                            to="/vendor-application/photo-birth-cert"
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            ← Back to Birth Certificate
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
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-800">Birth Certificate</span>
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="h-1 bg-gray-200 rounded">
                                <div className="h-1 bg-green-600 rounded" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-800">Marriage Certificate</span>
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold ml-2">6</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Marriage Certificate Photo</h2>
                        <p className="text-gray-600">Please take a clear photo of your PSA-certified Marriage Certificate.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Instructions - Left Side */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Requirements:</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 mr-3 mt-0.5">1</span>
                                        <span>PSA-certified Marriage Certificate only</span>
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
                                                alt="Marriage certificate preview"
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Take or Upload Photo</h3>
                                            <p className="text-gray-600 mb-4">Take a clear photo of your Marriage Certificate or upload an existing photo</p>
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
                                'Complete Application →'
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}