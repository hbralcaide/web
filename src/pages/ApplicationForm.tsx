// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { uploadPhoto } from '../utils/photoUpload'
import { supabase } from '../lib/supabase'
import jsPDF from 'jspdf'

interface VendorApplication {
    id: string;
    application_number: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    age?: number;
    marital_status?: string;
    spouse_name?: string;
    complete_address: string;
    status?: string;
    submitted_at?: string;
    updated_at?: string;
    person_photo?: string;
    barangay_clearance?: string;
    id_front_photo?: string;
    id_back_photo?: string;
    birth_certificate?: string;
    marriage_certificate?: string;
    notarized_document?: string;
    assigned_stall_id?: string;
    assigned_stall_number?: string;
    assigned_section_name?: string;
    stall_assigned_at?: string;
    [key: string]: any;
}

interface VerificationModalProps {
    isOpen: boolean
    onClose: () => void
    applicationNumber: string
    onContinue: () => void
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, applicationNumber, onContinue }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Saved!</h2>
                        <p className="text-gray-600 mb-4">
                            Your application has been saved successfully. Please write down your application number and keep it safe.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="text-center">
                            <p className="text-sm text-blue-700 mb-2">Your Application Number:</p>
                            <div className="text-3xl font-bold text-blue-900 font-mono tracking-wider">
                                {applicationNumber}
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Important:</strong> You can return later to upload your notarized document using this application number.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Continue Application
                        </button>
                        <button
                            onClick={onContinue}
                            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ApplicationForm() {
    const navigate = useNavigate()
    const [applicationData, setApplicationData] = useState<VendorApplication | null>(null)
    const [selectedStall, setSelectedStall] = useState<any>(null)
    const [notarizedDocument, setNotarizedDocument] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [applicationId, setApplicationId] = useState<string>('')
    const [uploading, setUploading] = useState(false)
    const [showVerificationModal, setShowVerificationModal] = useState(false)

    // Generate simple, short application ID
    const generateApplicationId = () => {
        // Generate a simple 6-digit number
        const randomNum = Math.floor(100000 + Math.random() * 900000)
        return randomNum.toString()
    }

    useEffect(() => {
        // Load application data from database instead of localStorage
        const loadApplicationData = async () => {
            try {
                // Get the vendor application ID from localStorage (we still need this for now)
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
                    // Clear the invalid ID from localStorage
                    localStorage.removeItem('vendorApplicationId')
                    navigate('/vendor-application')
                    return
                }

                if (!vendorApps || vendorApps.length === 0) {
                    console.error('No vendor application found with ID:', vendorApplicationId)
                    console.log('Clearing invalid vendor application ID from localStorage')
                    // Clear the invalid ID from localStorage
                    localStorage.removeItem('vendorApplicationId')
                    localStorage.removeItem('vendorApplicationData')
                    localStorage.removeItem('selectedStall')
                    alert('Invalid application data found. Redirecting to start a new application.')
                    navigate('/vendor-application')
                    return
                }

                const vendorApp = vendorApps[0]
                console.log('Successfully loaded vendor application:', vendorApp)
                console.log('Application data fields:', {
                    first_name: vendorApp.first_name,
                    last_name: vendorApp.last_name,
                    middle_name: vendorApp.middle_name,
                    age: vendorApp.age,
                    marital_status: vendorApp.marital_status,
                    spouse_name: vendorApp.spouse_name,
                    complete_address: vendorApp.complete_address
                })

                // Set the application data from database
                setApplicationData(vendorApp)
                setApplicationId(vendorApp.application_number)

                // Load selected stall information from localStorage (we still need this for now)
                const stallData = localStorage.getItem('selectedStall')
                if (stallData) {
                    const parsedStallData = JSON.parse(stallData)
                    console.log('Selected stall data:', parsedStallData)
                    setSelectedStall(parsedStallData)
                } else {
                    console.log('No selected stall data found in localStorage')
                    console.log('Available localStorage keys:', Object.keys(localStorage))
                }

            } catch (error) {
                console.error('Error loading application data:', error)
                // Clear the invalid ID from localStorage
                localStorage.removeItem('vendorApplicationId')
                localStorage.removeItem('vendorApplicationData')
                localStorage.removeItem('selectedStall')
                alert('Error loading application data. Redirecting to start a new application.')
                navigate('/vendor-application')
            }
        }

        loadApplicationData()
    }, [navigate])

    const savePhotoToDatabase = async (photoUrl: string) => {
        try {
            // Use the application data from state (loaded from database)
            if (!applicationData || !applicationData.id) {
                throw new Error('No application data found. Please refresh the page.')
            }

            const vendorApplicationId = applicationData.id
            const { error } = await supabase
                .from('vendor_applications')
                .update({ notarized_document: photoUrl })
                .eq('id', vendorApplicationId)

            if (error) throw error
        } catch (error: any) {
            console.error('Error saving photo to database:', error)
            throw error
        }
    }

    const handlePhotoUpload = async (file: File) => {
        try {
            setUploading(true)
            setError('')

            // Use the application data from state (loaded from database)
            if (!applicationData || !applicationData.id) {
                throw new Error('No application data found. Please refresh the page.')
            }

            const vendorApplicationId = applicationData.id

            // Upload photo to Supabase Storage
            const result = await uploadPhoto(file, vendorApplicationId, 'notarized_document')

            if (result.success && result.url) {
                // Save photo URL to database
                await savePhotoToDatabase(result.url)

                // Update the local state with photo info
                setApplicationData(prev => ({
                    ...prev,
                    notarized_document: result.url
                }))

                console.log('Notarized document uploaded successfully:', result.url)
            } else {
                throw new Error(result.error || 'Upload failed')
            }
        } catch (error: any) {
            console.error('Photo upload error:', error)
            setError(error.message || 'Failed to upload document')
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

            setNotarizedDocument(file)
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
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                })

                const video = document.createElement('video')
                video.srcObject = stream
                video.play()

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
                            const file = new File([blob], 'notarized-document.jpg', { type: 'image/jpeg' })
                            setNotarizedDocument(file)
                            setError('')

                            const reader = new FileReader()
                            reader.onload = (e) => {
                                setPreview(e.target?.result as string)
                            }
                            reader.readAsDataURL(file)

                            // Upload to Supabase Storage
                            handlePhotoUpload(file)
                        }
                    }, 'image/jpeg', 0.8)

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
        setNotarizedDocument(null)
        setPreview(null)
        setError('')
    }

    const handlePrevious = () => {
        navigate('/vendor-application/photo-marriage-cert')
    }

    const saveApplicationStatus = async (status: string) => {
        try {
            // Use the application data from state (loaded from database)
            if (!applicationData || !applicationData.id) {
                throw new Error('No application data found. Please refresh the page.')
            }

            const vendorApplicationId = applicationData.id
            console.log('Saving application status:', status, 'for ID:', vendorApplicationId)

            // Update application status
            const { error: updateError } = await supabase
                .from('vendor_applications')
                .update({
                    status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', vendorApplicationId)

            if (updateError) {
                console.error('Error updating vendor application:', updateError)
                throw updateError
            }

            // Update the local state
            setApplicationData(prev => ({ ...prev, status }))

        } catch (error: any) {
            console.error('Error saving application status:', error)
            throw error
        }
    }

    const handleNext = async () => {
        try {
            setUploading(true)
            setError('')

            // Use the application data from state (loaded from database)
            if (!applicationData || !applicationData.id) {
                throw new Error('No application data found. Please refresh the page.')
            }

            const vendorApplicationId = applicationData.id
            console.log('Using vendor application ID from database:', vendorApplicationId)

            // Update application status to pending_approval
            const { error: updateError } = await supabase
                .from('vendor_applications')
                .update({
                    status: 'pending_approval',
                    submitted_at: new Date().toISOString()
                })
                .eq('id', vendorApplicationId)

            if (updateError) {
                console.error('Error updating vendor application:', updateError)
                throw updateError
            }


            // Save stall assignment info directly to vendor_applications
            if (selectedStall && selectedStall.id) {
                const { error: stallAssignError } = await supabase
                    .from('vendor_applications')
                    .update({
                        assigned_stall_id: selectedStall.id,
                        assigned_stall_number: selectedStall.stall_number,
                        assigned_section_name: selectedStall.section_name,
                        stall_assigned_at: new Date().toISOString()
                    })
                    .eq('id', vendorApplicationId);
                if (stallAssignError) {
                    console.error('Error assigning stall:', stallAssignError);
                    throw new Error(`Failed to assign stall: ${stallAssignError.message}`);
                }
            } else {
                throw new Error('No selected stall found');
            }

            // Navigate to completion page
            navigate('/vendor-application/completion')

        } catch (error: any) {
            console.error('Error completing application:', error)
            setError(error.message || 'Failed to complete application')
        } finally {
            setUploading(false)
        }
    }

    const handleDownload = () => {
        // Check if we're on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        if (isMobile) {
            // For mobile: Generate PDF using jsPDF
            try {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'in',
                    format: 'legal' // 8.5 x 14 inches
                })

                const pageWidth = pdf.internal.pageSize.getWidth()
                const pageHeight = pdf.internal.pageSize.getHeight()
                const margin = 1
                const contentWidth = pageWidth - (margin * 2)
                let yPos = 0.75

                // Set font
                pdf.setFont('times', 'normal')
                pdf.setFontSize(11)

                // Date (right aligned)
                const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).toUpperCase()
                pdf.setFontSize(11)
                pdf.text(currentDate, pageWidth - margin, yPos, { align: 'right' })
                yPos += 0.3
                pdf.line(pageWidth - margin - 1.5, yPos, pageWidth - margin, yPos)
                pdf.setFontSize(9)
                pdf.text('Date', pageWidth - margin - 0.75, yPos + 0.15, { align: 'center' })
                yPos += 0.4

                // Header
                pdf.setFontSize(11)
                pdf.setFont('times', 'bold')
                pdf.text('THE CITY ADMINISTRATOR', margin, yPos)
                yPos += 0.2
                pdf.setFont('times', 'normal')
                pdf.text('Davao City', margin, yPos)
                yPos += 0.3

                pdf.text('Sir/Madam:', margin, yPos)
                yPos += 0.3

                // First paragraph
                const fullName = `${applicationData?.first_name || '______'} ${applicationData?.middle_name || ''} ${applicationData?.last_name || '______'}`
                const maritalText = applicationData?.marital_status === 'Married' && applicationData?.spouse_name 
                    ? `married to ${applicationData.spouse_name}` 
                    : (applicationData?.marital_status?.toLowerCase() || 'single')
                
                const para1 = `     I, ${fullName}, ${applicationData?.age || '______'} years old, Filipino Citizen, ${maritalText} and residing at ${applicationData?.complete_address || '______'}, hereby apply for the lease of market stall/booth No. ${selectedStall?.stall_number || '______'}, MB 2, ${selectedStall?.section_name || '______'} Section of Toril Public Market.`
                
                const para1Lines = pdf.splitTextToSize(para1, contentWidth)
                pdf.text(para1Lines, margin, yPos)
                yPos += para1Lines.length * 0.17

                // Second paragraph
                const para2 = '     Should the above-mentioned stall/booth be leased to me in accordance with the market rules and regulations, I promise to hold the same under the following conditions:'
                const para2Lines = pdf.splitTextToSize(para2, contentWidth)
                pdf.text(para2Lines, margin, yPos)
                yPos += para2Lines.length * 0.17 + 0.1

                // Conditions
                const conditions = [
                    'That, while I am occupying or leasing this stall/booth, I shall at all times have my picture and that of my helper (or those of my helpers) conveniently framed and hung-up conspicuously in this stall;',
                    'That I shall keep the stall/booth at all times in good sanitary conditions and comply strictly with all sanitary and market rules and regulations now existing or which may hereafter be promulgated;',
                    'I shall pay the corresponding rents for the stall/booth or fees for the stall/booth, including business permit or license and taxes in the manner prescribed by existing ordinances;',
                    'The business to be conducted in the stall/booth shall belong exclusively to me;',
                    'In case I engaged helpers, I shall nevertheless personally conduct my business and be present at the stall/booth. I shall promptly notify the market authorities of my absence giving my reason or reasons thereof;',
                    'I shall not lease/occupy more than one (1) stall/booth in a particular market;',
                    'I shall not sell or transfer my privilege to the stall/booth or permit another person to conduct business therein without the approval from the Market Committee;',
                    'Any violation on my part or on the part of my helpers of the foregoing conditions shall be sufficient cause for market authorities to cancel the Contract of Lease;'
                ]

                conditions.forEach((condition, index) => {
                    const condText = `${index + 1}. ${condition}`
                    const condLines = pdf.splitTextToSize(condText, contentWidth - 0.3)
                    pdf.text(condLines, margin + 0.3, yPos)
                    yPos += condLines.length * 0.17 + 0.05
                })

                // Signature - Applicant
                yPos += 0.1
                pdf.text('Very truly yours,', pageWidth - margin - 2, yPos, { align: 'right' })
                yPos += 0.3
                pdf.line(pageWidth - margin - 2.5, yPos, pageWidth - margin, yPos)
                pdf.text(fullName, pageWidth - margin - 1.25, yPos - 0.05, { align: 'center' })
                pdf.setFontSize(9)
                pdf.text('Applicant', pageWidth - margin - 1.25, yPos + 0.15, { align: 'center' })
                pdf.setFontSize(11)
                yPos += 0.4

                // Affiant paragraph
                const para3 = `     I, ${fullName}, do hereby state that I am the person who signed the foregoing statement/application; that I have read the same and that the contents thereof are true to the best of my knowledge.`
                const para3Lines = pdf.splitTextToSize(para3, contentWidth)
                pdf.text(para3Lines, margin, yPos)
                yPos += para3Lines.length * 0.17 + 0.2

                // Signature - Affiant
                pdf.line(pageWidth - margin - 2.5, yPos, pageWidth - margin, yPos)
                pdf.text(fullName, pageWidth - margin - 1.25, yPos - 0.05, { align: 'center' })
                pdf.setFontSize(9)
                pdf.text('Affiant', pageWidth - margin - 1.25, yPos + 0.15, { align: 'center' })
                pdf.setFontSize(11)
                yPos += 0.4

                // Notarization
                const para4 = 'SUBSCRIBED AND SWORN TO before me in the City of Davao, Philippines, this ___ day of __________, 20___, affiant exhibited to me his/her Community Tax Certificate No. ______ issued at __________ on __________, 20___.'
                const para4Lines = pdf.splitTextToSize(para4, contentWidth)
                pdf.text(para4Lines, margin, yPos)
                yPos += para4Lines.length * 0.17 + 0.2

                // Signature - Notary
                pdf.line(pageWidth - margin - 2.5, yPos, pageWidth - margin, yPos)
                pdf.setFontSize(9)
                pdf.text('Notary Public', pageWidth - margin - 1.25, yPos + 0.15, { align: 'center' })
                pdf.setFontSize(9)
                yPos += 0.4

                // Document details
                pdf.text('Doc. No. _____', margin, yPos)
                yPos += 0.15
                pdf.text('Page No. _____', margin, yPos)
                yPos += 0.15
                pdf.text('Book No. _____', margin, yPos)
                yPos += 0.15
                pdf.text('Series of 20___', margin, yPos)

                // Save PDF
                pdf.save(`Application_Form_${applicationData?.first_name || 'Applicant'}_${applicationData?.last_name || ''}.pdf`)
            } catch (error) {
                console.error('Error generating PDF:', error)
                alert('Failed to generate PDF. Please try again.')
            }
        } else {
            // Desktop: Use the original window.open() method
            const printWindow = window.open('', '_blank')
            if (printWindow) {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Application Form - ${applicationData?.first_name || 'Applicant'} ${applicationData?.last_name || ''}</title>
                        <style>
                            @page {
                                size: legal;
                                margin: 0.75in 1in;
                            }
                            body { 
                                font-family: 'Times New Roman', Times, serif; 
                                margin: 0;
                                padding: 0;
                                line-height: 1.4;
                                font-size: 11pt;
                            }
                            p {
                                margin: 8px 0;
                            }
                            .conditions {
                                margin-left: 20px;
                            }
                            .condition {
                                margin-bottom: 6px;
                            }
                            .signature-line {
                                border-bottom: 1px solid black;
                                display: inline-block;
                                min-width: 200px;
                                text-align: center;
                            }
                            .date-right {
                                text-align: right;
                                margin-bottom: 15px;
                            }
                            .header-left {
                                margin-bottom: 15px;
                            }
                            .signature-section {
                                margin-top: 20px;
                                text-align: right;
                            }
                            @media print {
                                body {
                                    margin: 0;
                                    padding: 0;
                                }
                                @page {
                                    size: legal;
                                    margin: 0.75in 1in;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${generateApplicationFormHTML()}
                        <script>
                            // Auto-print when page loads
                            window.onload = function() {
                                window.print();
                            };
                        </script>
                    </body>
                    </html>
                `)
                printWindow.document.close()
            }
        }
    }

    const generateApplicationFormHTML = () => {
        if (!applicationData) return ''

        return `
        <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.4; font-size: 11pt;">
            <div class="date-right">
                <div>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).toUpperCase()}</div>
                <div style="display: inline-block; margin-top: 5px;">
                    <span class="signature-line" style="min-width: 150px;">&nbsp;</span>
                    <div style="text-align: center; font-size: 10pt; margin-top: 2px;">Date</div>
                </div>
            </div>
    
            <div class="header-left">
                <strong>THE CITY ADMINISTRATOR</strong><br/>
                Davao City
            </div>
    
            <p>Sir/Madam:</p>
    
            <p style="text-indent: 40px; text-align: justify;">
                I, <strong><u>${applicationData.first_name || '______'} ${applicationData.middle_name || ''} ${applicationData.last_name || '______'}</u></strong>, <strong><u>${applicationData.age || '______'}</u></strong> years old, Filipino Citizen, 
                <strong><u>${applicationData.marital_status === 'Married' && applicationData.spouse_name ? 'married to ' + applicationData.spouse_name : applicationData.marital_status?.toLowerCase() || 'single'}</u></strong> and residing at 
                <strong><u>${applicationData.complete_address || '______'}</u></strong>, hereby apply for the lease of market stall/booth No. <strong><u>${selectedStall?.stall_number || '______'}</u></strong>, MB <strong><u>2</u></strong>, <strong><u>${selectedStall?.section_name || '______'}</u></strong> Section of Toril Public Market.
            </p>
    
            <p style="text-indent: 40px; text-align: justify;">
                Should the above-mentioned stall/booth be leased to me in accordance with the market rules and regulations, I promise to hold the same under the following conditions:
            </p>
    
            <div class="conditions">
                <p class="condition"><strong>1.</strong> That, while I am occupying or leasing this stall/booth, I shall at all times have my picture and that of my helper (or those of my helpers) conveniently framed and hung-up conspicuously in this stall;</p>
                <p class="condition"><strong>2.</strong> That I shall keep the stall/booth at all times in good sanitary conditions and comply strictly with all sanitary and market rules and regulations now existing or which may hereafter be promulgated;</p>
                <p class="condition"><strong>3.</strong> I shall pay the corresponding rents for the stall/booth or fees for the stall/booth, including business permit or license and taxes in the manner prescribed by existing ordinances;</p>
                <p class="condition"><strong>4.</strong> The business to be conducted in the stall/booth shall belong exclusively to me;</p>
                <p class="condition"><strong>5.</strong> In case I engaged helpers, I shall nevertheless personally conduct my business and be present at the stall/booth. I shall promptly notify the market authorities of my absence giving my reason or reasons thereof;</p>
                <p class="condition" style="font-style: italic;"><strong>6.</strong> I shall not lease/occupy more than one (1) stall/booth in a particular market;</p>
                <p class="condition"><strong>7.</strong> I shall not sell or transfer my privilege to the stall/booth or permit another person to conduct business therein without the approval from the Market Committee;</p>
                <p class="condition"><strong>8.</strong> Any violation on my part or on the part of my helpers of the foregoing conditions shall be sufficient cause for market authorities to cancel the Contract of Lease;</p>
            </div>
    
            <div class="signature-section">
                <p style="margin-bottom: 5px;">Very truly yours,</p>
                <div style="display: inline-block; margin-top: 15px;">
                    <span class="signature-line" style="min-width: 250px; border-bottom: 1px solid black; display: inline-block; text-align: center;">${applicationData.first_name || ''} ${applicationData.middle_name || ''} ${applicationData.last_name || ''}</span>
                    <div style="text-align: center; font-size: 10pt; margin-top: 2px;">Applicant</div>
                </div>
            </div>
            
            <p style="text-indent: 40px; text-align: justify; margin-top: 15px;">
                I, <strong><u>${applicationData.first_name || '______'} ${applicationData.middle_name || ''} ${applicationData.last_name || '______'}</u></strong>, do hereby state that I am the person who signed the foregoing statement/application; that I have read the same and that the contents thereof are true to the best of my knowledge.
            </p>
    
            <div class="signature-section">
                <div style="display: inline-block; margin-top: 10px;">
                    <span class="signature-line" style="min-width: 250px; border-bottom: 1px solid black; display: inline-block; text-align: center;">${applicationData.first_name || ''} ${applicationData.middle_name || ''} ${applicationData.last_name || ''}</span>
                    <div style="text-align: center; font-size: 10pt; margin-top: 2px;">Affiant</div>
                </div>
            </div>
    
            <p style="margin-top: 20px; text-align: justify;">
                SUBSCRIBED AND SWORN TO before me in the City of Davao, Philippines, this ___ day of __________, 20___, affiant exhibited to me his/her Community Tax Certificate No. ______ issued at __________ on __________, 20___.
            </p>
    
            <div class="signature-section">
                <div style="display: inline-block; margin-top: 10px;">
                    <span class="signature-line" style="min-width: 200px;">&nbsp;</span>
                    <div style="text-align: center; font-size: 10pt; margin-top: 2px;">Notary Public</div>
                </div>
            </div>
    
            <div style="margin-top: 20px; font-size: 10pt;">
                <p style="margin: 2px 0;">Doc. No. _____</p>
                <p style="margin: 2px 0;">Page No. _____</p>
                <p style="margin: 2px 0;">Book No. _____</p>
                <p style="margin: 2px 0;">Series of 20___</p>
            </div>
        </div>
        `
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
                        <h1 className="text-base sm:text-xl font-semibold">Step 7: Application Form & Notarization</h1>
                        <Link
                            to="/vendor-application/photo-marriage-cert"
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            ← Back to Marriage Certificate
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progress Bar - Hidden on mobile */}
            <div className="hidden md:block bg-white border-b border-gray-200">
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
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-800">Marriage Certificate</span>
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="h-1 bg-gray-200 rounded">
                                <div className="h-1 bg-green-600 rounded" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-800">Application Form</span>
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold ml-2">7</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Progress Indicator */}
            <div className="md:hidden bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">Step 7 of 7</span>
                        <div className="flex-1 mx-4">
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div className="h-2 bg-green-600 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <span className="text-sm text-gray-600">Final Step</span>
                    </div>
                </div>
            </div>

            {/* Main Content Preview page*/}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-8">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Application Form & Notarization</h2>
                        <p className="text-sm sm:text-base text-gray-600">Review your application form, print it for notarization, then upload the notarized document.</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {/* Application Form Preview */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Application Form Preview</h3>
                                <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
                                    <button
                                        onClick={handleDownload}
                                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
                                    >
                                        Download/Print PDF
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white p-3 sm:p-6 rounded border max-h-96 overflow-y-auto text-xs sm:text-sm" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
                                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                                    <div>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).toUpperCase()}</div>
                                    <div style={{ display: 'inline-block' }}>
                                        <div>____________________</div>
                                        <div style={{ textAlign: 'center' }}>Date</div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'left', marginTop: '10px', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, fontWeight: 'bold' }}>THE CITY ADMINISTRATOR</h3>
                                    <p style={{ margin: 0 }}>Davao City</p>
                                </div>

                                <p style={{ marginBottom: '15px' }}>Sir/Madam:</p>

                                <p style={{ marginBottom: '15px', textIndent: '40px' }}>
                                    I, <strong><u>{applicationData.first_name || '______'} {applicationData.middle_name || ''} {applicationData.last_name || '______'}</u></strong>, <strong><u>{applicationData.age || '______'}</u></strong> years old, Filipino Citizen,
                                    <strong><u> {applicationData.marital_status === 'Married' && applicationData.spouse_name ? 'married to ' + applicationData.spouse_name : applicationData.marital_status?.toLowerCase() || 'single'}</u></strong> and residing at
                                    <strong><u> {applicationData.complete_address || '______'}</u></strong>, hereby apply for the lease of market stall/booth No. <strong><u>{selectedStall?.stall_number || '______'}</u></strong>, MB <strong><u>2</u></strong>, <strong><u>{selectedStall?.section_name || '______'}</u></strong> Section of Toril Public Market.
                                </p>

                                <p style={{ marginBottom: '15px', textIndent: '40px' }}>
                                    Should the above-mentioned stall/booth be leased to me in accordance with the market rules
                                    and regulations, I promise to hold the same under the following conditions:
                                </p>

                                <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
                                    <p style={{ marginBottom: '10px', textIndent: '0' }}>
                                        <strong>1.</strong> That, while I am occupying or leasing this stall/booth, I shall at all times have my picture
                                        and that of my helper (or those of my helpers) conveniently framed and hung-up conspicuously in this stall;
                                    </p>
                                    <p style={{ marginBottom: '10px', textIndent: '0' }}>
                                        <strong>2.</strong> That I shall keep the stall/booth at all times in good sanitary conditions and comply strictly with all sanitary and market rules and regulations now existing or which may hereafter be promulgated;
                                    </p>
                                    <p style={{ marginBottom: '10px', textIndent: '0' }}>
                                        <strong>3.</strong> I shall pay the corresponding rents for the stall/booth or fees for the stall/booth, including business permit or license and taxes in the manner prescribed by existing ordinances;
                                    </p>
                                    <p style={{ marginBottom: '10px', textIndent: '0' }}>
                                        <strong>4.</strong> The business to be conducted in the stall/booth shall belong exclusively to me;
                                    </p>
                                    <p style={{ marginBottom: '10px', textIndent: '0' }}>
                                        <strong>5.</strong> In case I engaged helpers, I shall nevertheless personally conduct my business and be present at the stall/booth. I shall promptly notify the market authorities of my absence giving my reason or reasons thereof;
                                    </p>
                                    <p style={{ marginBottom: '10px', textIndent: '0', fontStyle: 'italic' }}>
                                        <strong>6.</strong> I shall not lease/occupy more than one (1) stall/booth in a particular market;
                                    </p>
                                    <p style={{ marginBottom: '10px', textIndent: '0' }}>
                                        <strong>7.</strong> I shall not sell or transfer my privilege to the stall/booth or permit another person to conduct business therein without the approval from the Market Committee;
                                    </p>
                                    <p style={{ marginBottom: '10px', textIndent: '0' }}>
                                        <strong>8.</strong> Any violation on my part or on the part of my helpers of the foregoing conditions shall be sufficient cause for market authorities to cancel the Contract of Lease;
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p>Very truly yours,</p>
                                    <div style={{ display: 'inline-block' }}>
                                        <div>_________________________</div>
                                        <div style={{ textAlign: 'center' }}>Applicant</div>
                                    </div>
                                </div>
                                <p style={{ marginBottom: '15px', textIndent: '40px' }}>
                                    I, <strong><u>{applicationData.first_name || '______'} {applicationData.middle_name || ''} {applicationData.last_name || '______'}</u></strong>, do hereby state that I am the person who signed the foregoing
                                    statement/application; that I have read the same and that the contents thereof are true to the
                                    best of my knowledge.
                                </p>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-block' }}>
                                        <div>_________________________</div>
                                        <div style={{ textAlign: 'center' }}>Affiant</div>
                                    </div>
                                </div>

                                <br /><br />
                                <p style={{ marginBottom: '15px' }}>
                                    SUBSCRIBED AND SWORN TO before me in the City of Davao, Philippines, this ___ day of __________, 20___,
                                    affiant exhibited to me his/her Community Tax Certificate No. ______ issued at __________ on __________, 20___.
                                </p>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-block' }}>
                                        <div>_________________________</div>
                                        <div style={{ textAlign: 'center' }}>Notary Public</div>
                                    </div>
                                </div>

                                <br /><br />
                                <p style={{ margin: '2px 0' }}>Doc. No. ______</p>
                                <p style={{ margin: '2px 0' }}>Page No. ______</p>
                                <p style={{ margin: '2px 0' }}>Book No. ______</p>
                                <p style={{ margin: '2px 0' }}>Series of 20____</p>
                            </div>
                        </div>

                        {/* Notarized Document Upload */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Notarized Document</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                {preview ? (
                                    <div className="space-y-4">
                                        <div className="mx-auto max-w-md">
                                            <img
                                                src={preview}
                                                alt="Notarized document preview"
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
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">Take or Upload Photo</h4>
                                            <p className="text-gray-600 mb-4">Take a clear photo of your notarized application form or upload an existing photo</p>
                                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">Instructions:</h3>
                            <ol className="space-y-2 text-blue-700">
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">1</span>
                                    <span>Review the auto-generated application form above</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">2</span>
                                    <span>Print or download the form</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">3</span>
                                    <span>Take the form to a notary public for notarization</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 mr-3 mt-0.5">4</span>
                                    <span>Upload a clear photo of the notarized document</span>
                                </li>
                            </ol>
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 pt-4 sm:pt-6">
                            <button
                                onClick={handlePrevious}
                                className="w-full sm:w-auto px-6 py-3 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                            >
                                ← Previous
                            </button>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                {!notarizedDocument && (
                                    <button
                                        onClick={() => {
                                            saveApplicationStatus('pending_notarization')
                                            setShowVerificationModal(true)
                                        }}
                                        className="w-full sm:w-auto px-6 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
                                    >
                                        Save & Continue Later
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={!notarizedDocument || uploading}
                                    className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                    </div>
                </div>
            </main>

            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                applicationNumber={applicationId}
                onContinue={() => {
                    setShowVerificationModal(false)
                    navigate('/')
                }}
            />
        </div>
    )
}
