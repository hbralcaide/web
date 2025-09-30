import React from 'react'

interface CertificateData {
    vendor_name: string
    business_name?: string
    stall_number: string
    section_name: string
    assigned_date: string
    certificate_number: string
    raffle_conducted_by: string
}

interface AssignmentCertificateProps {
    certificateData: CertificateData
    onClose?: () => void
    showActions?: boolean
}

export default function AssignmentCertificate({ certificateData, onClose, showActions = true }: AssignmentCertificateProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        // Create a printable version
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Stall Assignment Certificate - ${certificateData.certificate_number}</title>
                    <style>
                        body { 
                            font-family: 'Georgia', serif; 
                            margin: 40px; 
                            background: #f8f9fa;
                        }
                        .certificate {
                            max-width: 800px;
                            margin: 0 auto;
                            background: white;
                            padding: 60px;
                            border: 8px solid #2563eb;
                            border-radius: 20px;
                            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        }
                        .header { text-align: center; margin-bottom: 40px; }
                        .title { font-size: 36px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
                        .subtitle { font-size: 18px; color: #6b7280; }
                        .content { text-align: center; margin: 40px 0; }
                        .vendor-name { font-size: 32px; font-weight: bold; color: #059669; margin: 20px 0; }
                        .business-name { font-size: 20px; color: #374151; margin: 10px 0; }
                        .assignment-details { font-size: 18px; color: #4b5563; margin: 20px 0; }
                        .stall-info { font-size: 24px; font-weight: bold; color: #dc2626; margin: 20px 0; }
                        .footer { margin-top: 60px; text-align: center; }
                        .cert-number { font-size: 14px; color: #6b7280; }
                        .signature-line { border-top: 2px solid #374151; width: 200px; margin: 40px auto 10px; }
                        .signature-label { font-size: 14px; color: #6b7280; }
                        .seal { 
                            position: absolute; 
                            top: 20px; 
                            right: 20px; 
                            width: 100px; 
                            height: 100px; 
                            border: 3px solid #dc2626; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-weight: bold; 
                            color: #dc2626; 
                            font-size: 12px; 
                            text-align: center;
                        }
                        @media print {
                            body { margin: 0; background: white; }
                            .certificate { border: 4px solid #2563eb; box-shadow: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="certificate">
                        <div class="seal">OFFICIAL<br>SEAL</div>
                        <div class="header">
                            <div class="title">STALL ASSIGNMENT CERTIFICATE</div>
                            <div class="subtitle">Toril Public Market Building 2</div>
                        </div>
                        
                        <div class="content">
                            <p class="assignment-details">This is to certify that</p>
                            <div class="vendor-name">${certificateData.vendor_name}</div>
                            ${certificateData.business_name ? `<div class="business-name">${certificateData.business_name}</div>` : ''}
                            <p class="assignment-details">has been officially assigned to</p>
                            <div class="stall-info">Stall ${certificateData.stall_number}</div>
                            <div class="assignment-details">${certificateData.section_name} Section</div>
                            <p class="assignment-details">through a fair and transparent raffle process conducted on</p>
                            <div class="assignment-details"><strong>${formatDate(certificateData.assigned_date)}</strong></div>
                        </div>
                        
                        <div class="footer">
                            <div class="signature-line"></div>
                            <div class="signature-label">Market Administrator</div>
                            <div class="signature-label">${certificateData.raffle_conducted_by}</div>
                            <div class="cert-number">Certificate No: ${certificateData.certificate_number}</div>
                        </div>
                    </div>
                </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.focus()
            setTimeout(() => {
                printWindow.print()
                printWindow.close()
            }, 250)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Certificate */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                    <div className="bg-white rounded-xl border-8 border-blue-600 p-12 relative shadow-2xl">
                        {/* Official Seal */}
                        <div className="absolute top-4 right-4 w-20 h-20 border-4 border-red-600 rounded-full flex items-center justify-center">
                            <div className="text-red-600 font-bold text-xs text-center leading-tight">
                                OFFICIAL<br />SEAL
                            </div>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-blue-800 mb-2">
                                STALL ASSIGNMENT CERTIFICATE
                            </h1>
                            <p className="text-lg text-gray-600">Toril Public Market Building 2</p>
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-6">
                            <p className="text-lg text-gray-700">This is to certify that</p>

                            <div className="text-4xl font-bold text-green-700 py-4">
                                {certificateData.vendor_name}
                            </div>

                            {certificateData.business_name && (
                                <div className="text-xl text-gray-600 italic">
                                    {certificateData.business_name}
                                </div>
                            )}

                            <p className="text-lg text-gray-700">has been officially assigned to</p>

                            <div className="text-3xl font-bold text-red-600 py-4">
                                Stall {certificateData.stall_number}
                            </div>

                            <div className="text-xl text-gray-700">
                                {certificateData.section_name} Section
                            </div>

                            <p className="text-lg text-gray-700">
                                through a fair and transparent raffle process conducted on
                            </p>

                            <div className="text-xl font-semibold text-gray-800">
                                {formatDate(certificateData.assigned_date)}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-12 text-center">
                            <div className="inline-block">
                                <div className="border-t-2 border-gray-800 w-48 mb-2"></div>
                                <p className="text-sm text-gray-600">Market Administrator</p>
                                <p className="text-sm text-gray-600">{certificateData.raffle_conducted_by}</p>
                            </div>

                            <div className="mt-8 text-sm text-gray-500">
                                Certificate No: {certificateData.certificate_number}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="p-6 bg-gray-50 border-t flex justify-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Certificate
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Certificate
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                            >
                                Close
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}


