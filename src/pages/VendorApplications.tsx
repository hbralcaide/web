import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import CryptoJS from 'crypto-js';

interface ApprovalModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'success' | 'error'
    title: string
    message: string
}

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'approve' | 'reject' | 'warning'
}

interface RejectionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    documentName: string
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, type, title, message }) => {
    if (!isOpen) return null

    const isSuccess = type === 'success'
    const iconColor = isSuccess ? 'text-green-600' : 'text-red-600'
    const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100'
    const buttonColor = isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {isSuccess ? (
                                <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className={`px-6 py-2 ${buttonColor} text-white rounded-lg transition-colors`}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    type = 'approve'
}) => {
    if (!isOpen) return null

    const getButtonColors = () => {
        switch (type) {
            case 'approve':
                return 'bg-green-600 hover:bg-green-700'
            case 'reject':
                return 'bg-red-600 hover:bg-red-700'
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700'
            default:
                return 'bg-blue-600 hover:bg-blue-700'
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 ${getButtonColors()} text-white rounded-lg transition-colors`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const RejectionModal: React.FC<RejectionModalProps> = ({ isOpen, onClose, onConfirm, documentName }) => {
    const [reason, setReason] = useState('')

    if (!isOpen) return null

    const handleSubmit = () => {
        if (reason.trim()) {
            onConfirm(reason.trim())
            setReason('')
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Reject {documentName}</h2>
                        <p className="text-gray-600">Please provide a reason for rejecting this document:</p>
                    </div>

                    <div className="mb-6">
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!reason.trim()}
                            className={`px-4 py-2 rounded-lg transition-colors ${reason.trim()
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Reject Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface VendorProfile {
    market_section_id?: string;
    market_sections?: any;
    id: string;
    auth_user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    business_name: string;
    business_type: string;
    username: string;
    application_number?: string;
    role: string;
    status: string;
    stall_number?: string;
    category?: string;
    products_services_description?: string;
    actual_occupant_first_name?: string;
    actual_occupant_last_name?: string;
    actual_occupant_username?: string;
    actual_occupant_phone?: string;
    created_at: string;
    updated_at: string;
    stalls?: {
        id: string;
        stall_number: string;
    }[];
    preferred_stall_number?: string;
    assigned_stall_number?: string;
}

export default function Vendors() {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<VendorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [vendorDocuments, setVendorDocuments] = useState<any>(null);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [documentApprovals, setDocumentApprovals] = useState<any>({});
    const [updatingApproval, setUpdatingApproval] = useState<string | null>(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [approvalModalData, setApprovalModalData] = useState<{
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({ type: 'success', title: '', message: '' });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationModalData, setConfirmationModalData] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'approve' | 'reject' | 'warning';
    }>({ title: '', message: '', onConfirm: () => { }, type: 'approve' });
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionModalData, setRejectionModalData] = useState<{
        documentName: string;
        onConfirm: (reason: string) => void;
    }>({ documentName: '', onConfirm: () => { } });
    const [reactivatingVendor, setReactivatingVendor] = useState<string | null>(null);

    useEffect(() => {
        fetchVendors();

        // Set up real-time subscription for vendor_applications
        const channel = supabase
            .channel('vendor_applications_changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'vendor_applications'
                },
                (payload) => {
                    console.log('Real-time change detected:', payload);
                    // Refetch vendors when any change occurs
                    fetchVendors();
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const autoDeleteRejectedApplicants = async () => {
        try {
            // Find all rejected applications
            const { data: rejectedApps, error: fetchError } = await supabase
                .from('vendor_applications')
                .select('id')
                .eq('status', 'rejected');

            if (fetchError) {
                console.error('Error fetching rejected applications:', fetchError);
                return;
            }

            if (rejectedApps && rejectedApps.length > 0) {
                // Delete all rejected applications
                const { error: deleteError } = await supabase
                    .from('vendor_applications')
                    .delete()
                    .eq('status', 'rejected');

                if (deleteError) {
                    console.error('Error deleting rejected applications:', deleteError);
                } else {
                    console.log(`✅ Automatically deleted ${rejectedApps.length} rejected application(s)`);
                }
            }
        } catch (error) {
            console.error('Error in autoDeleteRejectedApplicants:', error);
        }
    };

    const autoDeleteActiveVendors = async () => {
        try {
            // Find all applications with Active status (they should be in vendor_profiles only)
            const { data: activeApps, error: fetchError } = await supabase
                .from('vendor_applications')
                .select('id')
                .eq('status', 'Active');

            if (fetchError) {
                console.error('Error fetching active applications:', fetchError);
                return;
            }

            if (activeApps && activeApps.length > 0) {
                // Delete all active applications (they're already in vendor_profiles as existing vendors)
                const { error: deleteError } = await supabase
                    .from('vendor_applications')
                    .delete()
                    .eq('status', 'Active');

                if (deleteError) {
                    console.error('Error deleting active applications:', deleteError);
                } else {
                    console.log(`✅ Automatically deleted ${activeApps.length} active application(s) - they are now existing vendors`);
                }
            }
        } catch (error) {
            console.error('Error in autoDeleteActiveVendors:', error);
        }
    };

    const fetchVendors = async () => {
        try {
            setLoading(true);

            // Auto-delete rejected applicants before fetching
            await autoDeleteRejectedApplicants();
            
            // Auto-delete active vendors (they're already in vendor_profiles)
            await autoDeleteActiveVendors();

            // Fetch vendor applications from vendor_applications table
            const { data: applicationsData, error: applicationsError } = await (supabase as any)
                .from('vendor_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (applicationsError) {
                console.error('Error fetching vendor applications:', applicationsError);
                return;
            }

            // Transform the data to match the expected interface
            const transformedApplications = (applicationsData || []).map((app: any) => ({
                id: app.id,
                auth_user_id: app.id, // Use application ID as auth_user_id for compatibility
                first_name: app.first_name || '',
                last_name: app.last_name || '',
                email: app.email || '',
                phone_number: app.phone_number || '',
                business_name: app.business_name || '',
                business_type: app.business_type || '',
                username: app.username || '',
                application_number: app.application_number || '',
                role: 'vendor',
                status: app.status || '',
                products_services_description: app.products_services_description || '',
                actual_occupant_first_name: app.actual_occupant_first_name || '',
                actual_occupant_last_name: app.actual_occupant_last_name || '',
                actual_occupant_username: app.actual_occupant_username || '',
                actual_occupant_phone: app.actual_occupant_phone || '',
                created_at: app.created_at || new Date().toISOString(),
                updated_at: app.updated_at || null,
                stalls: app.assigned_stall_id ? [{ id: app.assigned_stall_id, stall_number: app.assigned_stall_number || '' }] : [],
                market_sections: null,
                preferred_stall_number: app.preferred_stall_number || '',
                assigned_stall_number: app.assigned_stall_number || '',
                assigned_section_name: app.assigned_section_name || null
            }));

            setVendors(transformedApplications);
        } catch (error) {
            console.error('Error fetching vendor applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVendorDocuments = async (vendor: VendorProfile) => {
        try {
            setLoadingDocuments(true);

            // Fetch vendor application data using the application ID
            const { data: applicationData, error: applicationError } = await (supabase as any)
                .from('vendor_applications')
                .select('*')
                .eq('id', vendor.id)
                .single();

            if (applicationError) {
                console.error('Error fetching vendor application:', applicationError);
                // If no application found, show empty state
                setVendorDocuments({
                    application: null,
                    documents: {
                        person_photo: null,
                        barangay_clearance: null,
                        id_front_photo: null,
                        id_back_photo: null,
                        birth_certificate: null,
                        marriage_certificate: null,
                        notarized_document: null,
                        business_permit_document: null,
                        cedula_document: null
                    }
                });
                return;
            }

            setVendorDocuments({
                application: applicationData,
                documents: {
                    person_photo: applicationData.person_photo,
                    barangay_clearance: applicationData.barangay_clearance,
                    id_front_photo: applicationData.id_front_photo,
                    id_back_photo: applicationData.id_back_photo,
                    birth_certificate: applicationData.birth_certificate,
                    marriage_certificate: applicationData.marriage_certificate,
                    notarized_document: applicationData.notarized_document,
                    business_permit_document: applicationData.business_permit_document,
                    cedula_document: applicationData.cedula_document
                }
            });
        } catch (error) {
            console.error('Error fetching vendor documents:', error);
        } finally {
            setLoadingDocuments(false);
        }
    };

    const handleReviewDocuments = (vendor: VendorProfile) => {
        setSelectedVendor(vendor);
        setShowDocumentsModal(true);
        fetchVendorDocuments(vendor);
        fetchDocumentApprovals(vendor.id);
    };

    const fetchDocumentApprovals = async (vendorId: string) => {
        try {
            const { data: approvals, error } = await (supabase as any)
                .from('vendor_applications')
                .select(`
          person_photo_approved,
          barangay_clearance_approved,
          id_front_photo_approved,
          id_back_photo_approved,
          birth_certificate_approved,
          marriage_certificate_approved,
          notarized_document_approved,
          business_permit_approved,
          cedula_approved,
          person_photo_rejection_reason,
          barangay_clearance_rejection_reason,
          id_front_photo_rejection_reason,
          id_back_photo_rejection_reason,
          birth_certificate_rejection_reason,
          marriage_certificate_rejection_reason,
          notarized_document_rejection_reason,
          business_permit_rejection_reason,
          cedula_rejection_reason
        `)
                .eq('id', vendorId)
                .single();

            if (error) {
                console.error('Error fetching document approvals:', error);
                return;
            }

            setDocumentApprovals(approvals || {});
        } catch (error) {
            console.error('Error fetching document approvals:', error);
        }
    };

    const handleDocumentApproval = async (documentType: string, action: 'approve' | 'reject', rejectionReason?: string) => {
        if (!selectedVendor || !vendorDocuments?.application) return;

        try {
            setUpdatingApproval(documentType);

            // Map document types to their database column names
            const getApprovalFieldName = (docType: string) => {
                switch (docType) {
                    case 'business_permit_document':
                        return 'business_permit';
                    case 'cedula_document':
                        return 'cedula';
                    default:
                        return docType;
                }
            };

            const approvalFieldName = getApprovalFieldName(documentType);

            // If this is an approval for business permit or cedula, and the vendor is a raffle winner,
            // we need to check if both documents will be approved and create vendor profile FIRST
            if (action === 'approve' &&
                (selectedVendor.status === 'won_raffle' || selectedVendor.status === 'documents_submitted') &&
                (documentType === 'business_permit_document' || documentType === 'cedula_document')) {

                // Check if this approval would result in both documents being approved
                const currentBusinessPermitApproved = documentApprovals.business_permit_approved;
                const currentCedulaApproved = documentApprovals.cedula_approved;

                const willBusinessPermitBeApproved = documentType === 'business_permit_document' ? true : currentBusinessPermitApproved;
                const willCedulaBeApproved = documentType === 'cedula_document' ? true : currentCedulaApproved;

                if (willBusinessPermitBeApproved && willCedulaBeApproved) {
                    console.log('Both documents will be approved, checking if vendor profile already exists');
                    const { data: existingProfile, error: profileCheckError } = await (supabase as any)
                        .from('vendor_profiles')
                        .select('id')
                        .eq('vendor_application_id', vendorDocuments.application.id);

                    if (profileCheckError) {
                        console.error('Error checking existing vendor profile:', profileCheckError);
                        setApprovalModalData({
                            type: 'error',
                            title: 'Error',
                            message: 'Error checking vendor profile status. Please try again.'
                        });
                        setShowApprovalModal(true);
                        return;
                    }

                    if (existingProfile && existingProfile.length > 0) {
                        console.log('Vendor profile already exists, proceeding with document approval');
                    } else {
                        console.log('No existing vendor profile, creating one first');
                        // Try to create vendor profile BEFORE approving the document
                        const profileCreationSuccess = await createVendorProfile();

                        if (!profileCreationSuccess) {
                            // If vendor profile creation fails, don't approve the document
                            setApprovalModalData({
                                type: 'error',
                                title: 'Error',
                                message: 'Cannot approve document: Failed to create vendor profile. Please check the application data and try again.'
                            });
                            setShowApprovalModal(true);
                            return;
                        }
                    }
                }
            }

            // Now proceed with document approval
            const updateData: any = {};
            updateData[`${approvalFieldName}_approved`] = action === 'approve';

            if (action === 'reject' && rejectionReason) {
                updateData[`${approvalFieldName}_rejection_reason`] = rejectionReason;
            } else if (action === 'approve') {
                updateData[`${approvalFieldName}_rejection_reason`] = null;
            }

            const { error } = await (supabase as any)
                .from('vendor_applications')
                .update(updateData)
                .eq('id', vendorDocuments.application.id);

            if (error) {
                console.error('Error updating document approval:', error);
                setApprovalModalData({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to update document approval. Please try again.'
                });
                setShowApprovalModal(true);
                return;
            }

            // Update local state
            setDocumentApprovals((prev: any) => ({
                ...prev,
                [`${approvalFieldName}_approved`]: action === 'approve',
                [`${approvalFieldName}_rejection_reason`]: action === 'reject' ? rejectionReason : null
            }));

            // Check if all initial documents are now approved (for partially_approved status)
            if (selectedVendor.status === 'partially_approved' && action === 'approve') {
                // Fetch the updated application to check all documents
                const { data: updatedApp, error: fetchError } = await (supabase as any)
                    .from('vendor_applications')
                    .select('person_photo_approved, barangay_clearance_approved, id_front_photo_approved, id_back_photo_approved, birth_certificate_approved, marriage_certificate_approved, marital_status')
                    .eq('id', vendorDocuments.application.id)
                    .single()

                if (!fetchError && updatedApp) {
                    // Check if all required documents are approved
                    const requiredDocsApproved = 
                        updatedApp.person_photo_approved === true &&
                        updatedApp.barangay_clearance_approved === true &&
                        updatedApp.id_front_photo_approved === true &&
                        updatedApp.id_back_photo_approved === true &&
                        updatedApp.birth_certificate_approved === true &&
                        (updatedApp.marital_status === 'Single' || updatedApp.marriage_certificate_approved === true);

                    if (requiredDocsApproved) {
                        console.log('All required documents are now approved, updating status to Pending');
                        
                        // Update vendor application status back to 'Pending' for final review
                        const { error: statusUpdateError } = await (supabase as any)
                            .from('vendor_applications')
                            .update({ status: 'Pending' })
                            .eq('id', vendorDocuments.application.id);

                        if (statusUpdateError) {
                            console.error('Error updating status to Pending:', statusUpdateError);
                        } else {
                            console.log('Status successfully updated to Pending');
                            // Update selectedVendor status locally
                            setSelectedVendor((prev: any) => prev ? { ...prev, status: 'Pending' } : prev);
                        }

                        setApprovalModalData({
                            type: 'success',
                            title: 'Success',
                            message: `All documents are now approved! Application status updated to Pending for final review.`
                        });
                        setShowApprovalModal(true);
                        // Refresh the vendor list
                        await fetchVendors();
                        return;
                    }
                }
            }

            // Check if this is a raffle winner and if both business permit and cedula are now approved
            if ((selectedVendor.status === 'won_raffle' || selectedVendor.status === 'documents_submitted') && action === 'approve' &&
                (documentType === 'business_permit_document' || documentType === 'cedula_document')) {

                // Fetch the updated application to check both documents
                const { data: updatedApp, error: fetchError } = await (supabase as any)
                    .from('vendor_applications')
                    .select('business_permit_approved, cedula_approved')
                    .eq('id', vendorDocuments.application.id)
                    .single()

                console.log('Fetched updated app data:', { updatedApp, fetchError });

                if (!fetchError && updatedApp.business_permit_approved && updatedApp.cedula_approved) {
                    console.log('Both documents approved, updating status to documents_approved');

                    // Update vendor application status to 'documents_approved' so vendor can see credentials
                    const { error: statusUpdateError } = await (supabase as any)
                        .from('vendor_applications')
                        .update({ status: 'documents_approved' })
                        .eq('id', vendorDocuments.application.id);

                    if (statusUpdateError) {
                        console.error('Error updating status to documents_approved:', statusUpdateError);
                    } else {
                        console.log('Status successfully updated to documents_approved in vendor_applications');
                    }

                    setApprovalModalData({
                        type: 'success',
                        title: 'Success',
                        message: `All documents approved! ${vendorDocuments.application.first_name} ${vendorDocuments.application.last_name} can now set up their account credentials.`
                    });
                } else {
                    console.warn('Condition not met for status update to Active:', {
                        fetchError,
                        businessPermitApproved: updatedApp?.business_permit_approved,
                        cedulaApproved: updatedApp?.cedula_approved
                    });
                    setApprovalModalData({
                        type: 'success',
                        title: 'Success',
                        message: `Document ${action === 'approve' ? 'approved' : 'rejected'} successfully!`
                    });
                }
            } else {
                setApprovalModalData({
                    type: 'success',
                    title: 'Success',
                    message: `Document ${action === 'approve' ? 'approved' : 'rejected'} successfully!`
                });
            }
        } catch (error) {
            console.error('Error in handleDocumentApproval:', error);
            setApprovalModalData({
                type: 'error',
                title: 'Error',
                message: 'An error occurred while updating document approval.'
            });
            setShowApprovalModal(true);
        } finally {
            setUpdatingApproval(null);
        }
    };

    // Helper function to create vendor profile
    const createVendorProfile = async (): Promise<boolean> => {
        try {
            // Get the market section ID based on the stall number
            let marketSectionId = null;
            const stallNumber = vendorDocuments.application.assigned_stall_number;

            if (stallNumber) {
                // Query the stalls table to get the section_id for this stall
                const { data: stallInfo, error: stallError } = await (supabase as any)
                    .from('stalls')
                    .select('section_id')
                    .eq('stall_number', stallNumber)
                    .single();

                if (!stallError && stallInfo) {
                    marketSectionId = stallInfo.section_id;
                }
            }

            // Generate username
            const generateUsername = async (firstName: string, lastName: string): Promise<string> => {
                const baseUsername = (firstName.charAt(0) + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
                let username = baseUsername;
                let suffix = 1;

                // Check for existing username in vendor_profiles table
                while (true) {
                    const { data: existingUsernames, error } = await (supabase as any)
                        .from('vendor_profiles')
                        .select('username, actual_occupant_username')
                        .or(`username.eq.${username},actual_occupant_username.eq.${username}`);

                    if (error) {
                        console.error('Error checking existing usernames:', error);
                        throw error;
                    }

                    if (existingUsernames.length === 0) break;

                    username = `${baseUsername}${suffix}`;
                    suffix++;
                }

                return username;
            };

            // Generate password
            const generatePassword = (username: string, stallNumber: string): string => {
                return `${username}${stallNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
            };

            // Handle actual occupant credentials - either all fields or none
            let actualOccupantData = {
                actual_occupant_first_name: null,
                actual_occupant_last_name: null,
                actual_occupant_username: null,
                actual_occupant_password_hash: null,
                actual_occupant_phone: null,
            };

            // Only set actual occupant data if we have complete information
            const hasActualOccupantFirstName = vendorDocuments.application.actual_occupant_first_name?.trim();
            const hasActualOccupantLastName = vendorDocuments.application.actual_occupant_last_name?.trim();

            console.log('Actual occupant data check:', {
                hasFirstName: hasActualOccupantFirstName,
                hasLastName: hasActualOccupantLastName,
                firstName: vendorDocuments.application.actual_occupant_first_name,
                lastName: vendorDocuments.application.actual_occupant_last_name
            });

            if (hasActualOccupantFirstName && hasActualOccupantLastName) {
                const actualOccupantUsername = await generateUsername(
                    vendorDocuments.application.actual_occupant_first_name,
                    vendorDocuments.application.actual_occupant_last_name
                );

                const actualOccupantPassword = generatePassword(
                    actualOccupantUsername,
                    vendorDocuments.application.assigned_stall_number || ''
                );

                actualOccupantData = {
                    actual_occupant_first_name: vendorDocuments.application.actual_occupant_first_name,
                    actual_occupant_last_name: vendorDocuments.application.actual_occupant_last_name,
                    actual_occupant_username: actualOccupantUsername,
                    actual_occupant_password_hash: CryptoJS.SHA256(actualOccupantPassword).toString(CryptoJS.enc.Hex),
                    actual_occupant_phone: vendorDocuments.application.actual_occupant_phone || vendorDocuments.application.phone_number,
                };
                console.log('Setting actual occupant data:', actualOccupantData);
            } else {
                console.log('No actual occupant data - using null values');
            }

            // Generate vendor username and password
            const vendorUsername = await generateUsername(
                vendorDocuments.application.first_name,
                vendorDocuments.application.last_name
            );
            const vendorPassword = generatePassword(
                vendorUsername,
                vendorDocuments.application.assigned_stall_number || ''
            );

            // Create vendor profile data
            const vendorProfileData = {
                ...actualOccupantData,
                vendor_application_id: vendorDocuments.application.id,
                first_name: vendorDocuments.application.first_name,
                last_name: vendorDocuments.application.last_name,
                email: vendorDocuments.application.email || null,
                phone_number: vendorDocuments.application.phone_number,
                business_name: vendorDocuments.application.business_name,
                business_type: vendorDocuments.application.business_type || 'General',
                username: vendorUsername,
                role: 'vendor',
                status: 'Active',
                application_status: 'approved',
                stall_number: vendorDocuments.application.assigned_stall_number,
                category: vendorDocuments.application.assigned_section_name,
                market_section_id: marketSectionId,
                products_services_description: vendorDocuments.application.products_services_description || null,
                complete_address: vendorDocuments.application.complete_address,
                middle_name: vendorDocuments.application.middle_name || null,
                signup_method: 'admin_approved',
            };

            console.log('Creating vendor profile with data:', vendorProfileData);

            const { error: profileError } = await (supabase as any)
                .from('vendor_profiles')
                .insert(vendorProfileData);

            if (profileError) {
                console.error('Error creating vendor profile:', profileError);
                return false;
            }

            console.log('Generated password for vendor:', vendorPassword);
            return true;
        } catch (error) {
            console.error('Error in createVendorProfile:', error);
            return false;
        }
    };

    const handlePartialApproval = async (vendor: VendorProfile) => {
        try {
            // Update vendor application status to partially approved (no stall assignment)
            const { error: updateError } = await (supabase as any)
                .from('vendor_applications')
                .update({
                    status: 'partially_approved',
                    updated_at: new Date().toISOString()
                })
                .eq('id', vendor.id);

            if (updateError) {
                console.error('Failed to update application status:', updateError);
                setApprovalModalData({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to update application status. Please try again.'
                });
                setShowApprovalModal(true);
                return;
            }

            // Close modals and refresh data
            setShowDocumentsModal(false);
            setVendorDocuments(null);
            await fetchVendors();

            setApprovalModalData({
                type: 'success',
                title: 'Partially Approved',
                message: `Vendor ${vendor.first_name} ${vendor.last_name} has been marked as partially approved. They need to re-upload rejected documents before stall assignment.`
            });
            setShowApprovalModal(true);
        } catch (error) {
            console.error('Error in handlePartialApproval:', error);
            setApprovalModalData({
                type: 'error',
                title: 'Error',
                message: 'An error occurred during partial approval.'
            });
            setShowApprovalModal(true);
        }
    };

    const handleApproveForRaffle = async (vendor: VendorProfile) => {
        try {
            // Update vendor application status to indicate they are approved and in raffle
            const { error: updateError } = await (supabase as any)
                .from('vendor_applications')
                .update({
                    status: 'approved_for_raffle',
                    updated_at: new Date().toISOString()
                })
                .eq('id', vendor.id);

            if (updateError) {
                console.error('Failed to update application status:', updateError);
                setApprovalModalData({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to update application status. Please try again.'
                });
                setShowApprovalModal(true);
                return;
            }

            // Close modals and refresh the vendors list
            setShowDocumentsModal(false);
            setVendorDocuments(null);
            await fetchVendors();

            // Show success message
            setApprovalModalData({
                type: 'success',
                title: 'Application Approved!',
                message: `${vendor.first_name} ${vendor.last_name} has been approved for raffle. You can now run the raffle to assign stalls.`
            });
            setShowApprovalModal(true);
        } catch (error) {
            console.error('Error in handleApproveForRaffle:', error);
            setApprovalModalData({
                type: 'error',
                title: 'Error',
                message: 'An error occurred while approving for raffle.'
            });
            setShowApprovalModal(true);
        }
    };



    const handleDeactivateVendor = async (vendor: VendorProfile) => {
        setConfirmationModalData({
            title: 'Deactivate Vendor',
            message: `Are you sure you want to deactivate ${vendor.first_name} ${vendor.last_name}? This will free up their stall and set their status to inactive.`,
            onConfirm: async () => {
                try {
                    setShowConfirmationModal(false);
                    // If vendor has an assigned stall, free it up
                    if (vendor.stalls && vendor.stalls.length > 0) {
                        const { error: stallError } = await (supabase as any)
                            .from('stalls')
                            .update({
                                vendor_profile_id: null,
                                status: 'vacant'
                            })
                            .eq('id', vendor.stalls[0].id);

                        if (stallError) {
                            console.error('Error freeing up stall:', stallError);
                            setApprovalModalData({
                                type: 'error',
                                title: 'Error',
                                message: 'Failed to free up assigned stall. Please try again.'
                            });
                            setShowApprovalModal(true);
                            return;
                        }
                    }

                    // Update vendor status to inactive
                    const { error: updateError } = await (supabase as any)
                        .from('vendor_profiles')
                        .update({
                            status: 'Inactive',
                            application_status: 'inactive'
                        })
                        .eq('id', vendor.id);

                    if (updateError) {
                        console.error('Error deactivating vendor:', updateError);
                        setApprovalModalData({
                            type: 'error',
                            title: 'Error',
                            message: 'Failed to deactivate vendor. Please try again.'
                        });
                        setShowApprovalModal(true);
                        return;
                    }

                    // Refresh the vendors list
                    await fetchVendors();
                    setApprovalModalData({
                        type: 'success',
                        title: 'Success',
                        message: `Vendor ${vendor.first_name} ${vendor.last_name} has been deactivated successfully.`
                    });
                    setShowApprovalModal(true);
                } catch (error) {
                    console.error('Error in handleDeactivateVendor:', error);
                    setApprovalModalData({
                        type: 'error',
                        title: 'Error',
                        message: 'An unexpected error occurred while deactivating the vendor.'
                    });
                    setShowApprovalModal(true);
                }
            },
            type: 'warning'
        });
        setShowConfirmationModal(true);
    };

    const handleReactivateVendor = async (vendor: VendorProfile) => {
        setConfirmationModalData({
            title: 'Reactivate Vendor',
            message: `Are you sure you want to reactivate ${vendor.first_name} ${vendor.last_name}? This will set their status back to pending for approval.`,
            onConfirm: async () => {
                try {
                    setShowConfirmationModal(false);
                    // Update vendor status to pending for reactivation
                    const { error: updateError } = await (supabase as any)
                        .from('vendor_profiles')
                        .update({
                            status: 'Pending',
                            application_status: 'pending'
                        })
                        .eq('id', vendor.id);

                    if (updateError) {
                        console.error('Error reactivating vendor:', updateError);
                        setApprovalModalData({
                            type: 'error',
                            title: 'Error',
                            message: 'Failed to reactivate vendor. Please try again.'
                        });
                        setShowApprovalModal(true);
                        return;
                    }

                    // Refresh the vendors list
                    await fetchVendors();
                    setApprovalModalData({
                        type: 'success',
                        title: 'Success',
                        message: `Vendor ${vendor.first_name} ${vendor.last_name} has been reactivated and is now pending approval.`
                    });
                    setShowApprovalModal(true);
                } catch (error) {
                    console.error('Error in handleReactivateVendor:', error);
                    setApprovalModalData({
                        type: 'error',
                        title: 'Error',
                        message: 'An unexpected error occurred while reactivating the vendor.'
                    });
                    setShowApprovalModal(true);
                }
            },
            type: 'approve'
        });
        setShowConfirmationModal(true);
    };

    const handleArchiveVendor = async (vendor: VendorProfile) => {
        setConfirmationModalData({
            title: 'Archive Vendor',
            message: `Are you sure you want to archive ${vendor.first_name} ${vendor.last_name}? This will mark them as archived but keep their data for records.`,
            onConfirm: async () => {
                try {
                    setShowConfirmationModal(false);
                    // Update vendor status to archived
                    const { error: updateError } = await (supabase as any)
                        .from('vendor_profiles')
                        .update({
                            status: 'Archived',
                            application_status: 'archived'
                        })
                        .eq('id', vendor.id);

                    if (updateError) {
                        console.error('Error archiving vendor:', updateError);
                        setApprovalModalData({
                            type: 'error',
                            title: 'Error',
                            message: 'Failed to archive vendor. Please try again.'
                        });
                        setShowApprovalModal(true);
                        return;
                    }

                    // Refresh the vendors list
                    await fetchVendors();
                    setApprovalModalData({
                        type: 'success',
                        title: 'Success',
                        message: `Vendor ${vendor.first_name} ${vendor.last_name} has been archived successfully.`
                    });
                    setShowApprovalModal(true);
                } catch (error) {
                    console.error('Error in handleArchiveVendor:', error);
                    setApprovalModalData({
                        type: 'error',
                        title: 'Error',
                        message: 'An unexpected error occurred while archiving the vendor.'
                    });
                    setShowApprovalModal(true);
                }
            },
            type: 'warning'
        });
        setShowConfirmationModal(true);
    };

    const handleVendorRowClick = (vendor: VendorProfile) => {
        setSelectedVendor(vendor);
        setShowVendorModal(true);
    };

    const handleBulkAction = async (action: 'delete' | 'deactivate' | 'reactivate') => {
        if (selectedVendors.length === 0) {
            setApprovalModalData({
                type: 'error',
                title: 'No Selection',
                message: 'Please select vendors first.'
            });
            setShowApprovalModal(true);
            return;
        }

        const actionText = action === 'delete' ? 'delete' : action === 'deactivate' ? 'deactivate' : 'reactivate';
        setConfirmationModalData({
            title: `Bulk ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
            message: `Are you sure you want to ${actionText} ${selectedVendors.length} selected vendor(s)?`,
            onConfirm: async () => {
                try {
                    setShowConfirmationModal(false);
                    for (const vendorId of selectedVendors) {
                        const vendor = vendors.find(v => v.id === vendorId);
                        if (!vendor) continue;

                        switch (action) {
                            case 'delete':
                                await handleDeleteVendor(vendor);
                                break;
                            case 'deactivate':
                                await handleDeactivateVendor(vendor);
                                break;
                            case 'reactivate':
                                await handleReactivateVendor(vendor);
                                break;
                        }
                    }
                    setSelectedVendors([]);
                    setApprovalModalData({
                        type: 'success',
                        title: 'Success',
                        message: `Successfully ${actionText}d ${selectedVendors.length} vendor(s).`
                    });
                    setShowApprovalModal(true);
                } catch (error) {
                    console.error(`Error in bulk ${action}:`, error);
                    setApprovalModalData({
                        type: 'error',
                        title: 'Error',
                        message: `An error occurred during bulk ${action}.`
                    });
                    setShowApprovalModal(true);
                }
            },
            type: action === 'delete' ? 'reject' : 'warning'
        });
        setShowConfirmationModal(true);
    };

    const handleSelectAll = () => {
        if (selectedVendors.length === vendors.length) {
            setSelectedVendors([]);
        } else {
            setSelectedVendors(vendors.map(v => v.id));
        }
    };

    const handleSelectVendor = (vendorId: string) => {
        setSelectedVendors(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleDeleteVendor = async (vendor: VendorProfile) => {
        setConfirmationModalData({
            title: 'Delete Vendor Application',
            message: `Are you sure you want to delete the application for ${vendor.first_name} ${vendor.last_name}? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    setShowConfirmationModal(false);
                    
                    // Delete from vendor_applications table (for applications)
                    const { error: applicationError } = await (supabase as any)
                        .from('vendor_applications')
                        .delete()
                        .eq('id', vendor.id);

                    if (applicationError) {
                        console.error('Error deleting vendor application:', applicationError);
                        
                        // If it failed, try deleting from vendor_profiles (for existing vendors)
                        // If vendor has an assigned stall, free it up first
                        if (vendor.stalls && vendor.stalls.length > 0) {
                            const { error: stallError } = await (supabase as any)
                                .from('stalls')
                                .update({
                                    vendor_profile_id: null,
                                    status: 'vacant'
                                })
                                .eq('id', vendor.stalls[0].id);

                            if (stallError) {
                                console.error('Error freeing up stall:', stallError);
                            }
                        }

                        // Delete vendor products if any
                        const { error: productsError } = await (supabase as any)
                            .from('vendor_products')
                            .delete()
                            .eq('vendor_id', vendor.id);

                        if (productsError) {
                            console.error('Error deleting vendor products:', productsError);
                        }

                        // Delete the vendor profile
                        const { error: vendorError } = await (supabase as any)
                            .from('vendor_profiles')
                            .delete()
                            .eq('id', vendor.id);

                        if (vendorError) {
                            console.error('Error deleting vendor profile:', vendorError);
                            setApprovalModalData({
                                type: 'error',
                                title: 'Error',
                                message: 'Failed to delete vendor. Please try again.'
                            });
                            setShowApprovalModal(true);
                            return;
                        }
                    }

                    // Refresh the vendors list
                    await fetchVendors();
                    setApprovalModalData({
                        type: 'success',
                        title: 'Success',
                        message: `Application for ${vendor.first_name} ${vendor.last_name} has been deleted successfully.`
                    });
                    setShowApprovalModal(true);
                } catch (error) {
                    console.error('Error in handleDeleteVendor:', error);
                    setApprovalModalData({
                        type: 'error',
                        title: 'Error',
                        message: 'An unexpected error occurred while deleting the vendor.'
                    });
                    setShowApprovalModal(true);
                }
            },
            type: 'reject'
        });
        setShowConfirmationModal(true);
    };

    const getDocumentApprovalStatus = (documentType: string) => {
        // Map document types to their database column names (same as in handleDocumentApproval)
        const getApprovalFieldName = (docType: string) => {
            switch (docType) {
                case 'business_permit_document':
                    return 'business_permit';
                case 'cedula_document':
                    return 'cedula';
                default:
                    return docType;
            }
        };

        const approvalFieldName = getApprovalFieldName(documentType);
        const isApproved = documentApprovals[`${approvalFieldName}_approved`];
        const rejectionReason = documentApprovals[`${approvalFieldName}_rejection_reason`];

        if (isApproved === true) {
            return { status: 'approved', reason: null };
        } else if (isApproved === false) {
            return { status: 'rejected', reason: rejectionReason };
        } else {
            return { status: 'pending', reason: null };
        }
    };

    const DocumentApprovalComponent = ({ documentType, documentName }: { documentType: string, documentName: string }) => {
        const approvalStatus = getDocumentApprovalStatus(documentType);
        const isUpdating = updatingApproval === documentType;

        const handleApprove = () => {
            setConfirmationModalData({
                title: 'Approve Document',
                message: `Are you sure you want to approve the ${documentName}?`,
                onConfirm: () => {
                    handleDocumentApproval(documentType, 'approve');
                    setShowConfirmationModal(false);
                },
                type: 'approve'
            });
            setShowConfirmationModal(true);
        };

        const handleReject = () => {
            setRejectionModalData({
                documentName: documentName,
                onConfirm: (reason: string) => {
                    handleDocumentApproval(documentType, 'reject', reason);
                }
            });
            setShowRejectionModal(true);
        };

        return (
            <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                    {approvalStatus.status === 'approved' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Approved
                        </span>
                    )}
                    {approvalStatus.status === 'rejected' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ✗ Rejected
                        </span>
                    )}
                    {approvalStatus.status === 'pending' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⏳ Pending Review
                        </span>
                    )}
                </div>

                {approvalStatus.reason && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        <strong>Rejection Reason:</strong> {approvalStatus.reason}
                    </div>
                )}

                <div className="flex space-x-2">
                    <button
                        onClick={handleApprove}
                        disabled={isUpdating || approvalStatus.status === 'approved'}
                        className={`px-3 py-1 text-xs rounded ${isUpdating || approvalStatus.status === 'approved'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                    >
                        {isUpdating ? 'Updating...' : approvalStatus.status === 'approved' ? '✓ Approved' : 'Approve'}
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={isUpdating || approvalStatus.status === 'approved'}
                        className={`px-3 py-1 text-xs rounded ${isUpdating || approvalStatus.status === 'approved'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                    >
                        {isUpdating ? 'Updating...' : approvalStatus.status === 'rejected' ? '✗ Rejected' : 'Reject'}
                    </button>
                </div>
            </div>
        );
    };

    const getStatusBadge = (status: string, applicationStatus: string) => {
        // Normalize status for comparison (handle case variations)
        const normalizedStatus = status?.toLowerCase();
        const normalizedAppStatus = applicationStatus?.toLowerCase();

        if (normalizedStatus === 'active' || normalizedAppStatus === 'approved') {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                </span>
            );
        } else if (normalizedStatus === 'approved for raffle' || normalizedAppStatus === 'approved_for_raffle') {
            return (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Approved for Raffle
                </span>
            );
        } else if (normalizedStatus === 'won raffle' || normalizedAppStatus === 'won_raffle') {
            return (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    Won Raffle
                </span>
            );
        } else if (normalizedStatus === 'documents submitted' || normalizedAppStatus === 'documents_submitted') {
            return (
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                    Documents Submitted
                </span>
            );
        } else if (normalizedStatus === 'documents approved' || normalizedAppStatus === 'documents_approved') {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Documents Approved
                </span>
            );
        } else if (normalizedStatus === 'activated' || normalizedAppStatus === 'activated') {
            return (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    Activated
                </span>
            );
        } else if (normalizedStatus === 'pending' || normalizedAppStatus === 'pending') {
            return (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Pending
                </span>
            );
        } else if (normalizedStatus === 'activated' || normalizedAppStatus === 'active') {
            return (
                <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800"></span>
            );
        } else if (normalizedStatus === 'inactive' || normalizedAppStatus === 'inactive') {
            return (
                <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                    Inactive
                </span>
            );
        } else if (normalizedStatus === 'archived' || normalizedAppStatus === 'archived') {
            return (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    Archived
                </span>
            );
        } else if (normalizedStatus === 'rejected' || normalizedAppStatus === 'rejected') {
            return (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Rejected
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {status || 'Unknown'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/raffle')}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        Stall Raffle
                    </button>
                    <div className="text-sm text-gray-500">
                        Total: {vendors.length} applications
                    </div>
                </div>
            </div>

            {/* Vendors List */}
            {vendors.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 12a4 4 0 008 0m-8 0a4 4 0 118 0m-8 0v9a2 2 0 01-2 2h4a2 2 0 002-2v-9" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No vendor applications</h3>
                    <p className="mt-1 text-sm text-gray-500">No vendor applications have been submitted yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Application #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Business
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {vendor.application_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {vendor.first_name} {vendor.last_name}
                                        </div>
                                        <div className="text-sm text-gray-500">{vendor.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{vendor.business_name || 'No business name'}</div>
                                        <div className="text-sm text-gray-500">
                                            {vendor.assigned_stall_number
                                                ? `Assigned: ${vendor.assigned_stall_number}`
                                                : vendor.preferred_stall_number
                                                    ? `Applied for: ${vendor.preferred_stall_number}`
                                                    : 'No stall preference'
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(vendor.status, vendor.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(vendor.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedVendor(vendor);
                                                setShowVendorModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleReviewDocuments(vendor)}
                                            className="text-green-600 hover:text-green-900 mr-4"
                                        >
                                            Review Documents
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteVendor(vendor);
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete application"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Vendor Details Modal */}
            {showVendorModal && selectedVendor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Vendor Details</h2>
                            <button
                                onClick={() => setShowVendorModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <p className="text-sm text-gray-900">{selectedVendor.first_name} {selectedVendor.last_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <p className="text-sm text-gray-900">{selectedVendor.username}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <p className="text-sm text-gray-900">{selectedVendor.phone_number}</p>
                                </div>
                                {selectedVendor.actual_occupant_first_name && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Actual Occupant</label>
                                        <p className="text-sm text-gray-900">
                                            {selectedVendor.actual_occupant_first_name} {selectedVendor.actual_occupant_last_name}
                                        </p>
                                        {selectedVendor.actual_occupant_phone && (
                                            <p className="text-xs text-gray-500">Phone: {selectedVendor.actual_occupant_phone}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Business Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Business Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                    <p className="text-sm text-gray-900">{selectedVendor.business_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Type</label>
                                    <p className="text-sm text-gray-900">{selectedVendor.business_type}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Market Section</label>
                                    <p className="text-sm text-gray-900">{selectedVendor.market_sections?.name || selectedVendor.category || '—'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stall Number</label>
                                    <p className="text-sm text-gray-900">
                                        {selectedVendor.stalls && selectedVendor.stalls.length > 0 ? (
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {selectedVendor.stalls[0].stall_number}
                                            </span>
                                        ) : (
                                            'Not assigned'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedVendor.status, selectedVendor.status)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                                    <p className="text-sm text-gray-900">{new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-6 border-t">
                            <button
                                onClick={() => {
                                    setShowVendorModal(false);
                                    handleReviewDocuments(selectedVendor);
                                }}
                                className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Review Documents
                            </button>
                            {(selectedVendor.status?.toLowerCase() === 'active' || selectedVendor.status?.toLowerCase() === 'approved') && (
                                <button
                                    onClick={() => {
                                        setShowVendorModal(false);
                                        handleDeactivateVendor(selectedVendor);
                                    }}
                                    className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500"
                                >
                                    Deactivate
                                </button>
                            )}
                            {(selectedVendor.status?.toLowerCase() === 'inactive' || selectedVendor.status?.toLowerCase() === 'archived') && (
                                <button
                                    onClick={() => {
                                        setShowVendorModal(false);
                                        handleReactivateVendor(selectedVendor);
                                    }}
                                    className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500"
                                >
                                    Reactivate
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setShowVendorModal(false);
                                    handleDeleteVendor(selectedVendor);
                                }}
                                className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Documents Review Modal */}
            {showDocumentsModal && selectedVendor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Document Review - {selectedVendor.first_name} {selectedVendor.last_name}
                            </h2>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => {
                                        fetchDocumentApprovals(selectedVendor.id);
                                        fetchVendorDocuments(selectedVendor.id);
                                    }}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                    title="Refresh document status"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDocumentsModal(false);
                                        setVendorDocuments(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {loadingDocuments ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                <span className="ml-3 text-gray-600">Loading documents...</span>
                            </div>
                        ) : vendorDocuments ? (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Application Summary - Left Side */}
                                    {vendorDocuments.application && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Summary</h3>
                                            <div className="space-y-4 text-sm">
                                                {/* Application Details */}
                                                <div className="bg-white p-3 rounded border">
                                                    <h4 className="font-semibold text-gray-700 mb-2">Application Details</h4>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="font-medium text-gray-600">Application Number:</span>
                                                            <span className="ml-2 text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                                                                {vendorDocuments.application.application_number}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Status:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.status}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Applied Date:</span>
                                                            <span className="ml-2 text-gray-900">
                                                                {new Date(vendorDocuments.application.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Personal Information */}
                                                <div className="bg-white p-3 rounded border">
                                                    <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="font-medium text-gray-600">Full Name:</span>
                                                            <span className="ml-2 text-gray-900">
                                                                {vendorDocuments.application.first_name} {vendorDocuments.application.middle_name} {vendorDocuments.application.last_name}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Age:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.age}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Gender:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.gender || 'Not specified'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Birth Date:</span>
                                                            <span className="ml-2 text-gray-900">
                                                                {vendorDocuments.application.birth_date ? new Date(vendorDocuments.application.birth_date).toLocaleDateString() : 'Not specified'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Civil Status:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.civil_status || 'Not specified'}</span>
                                                        </div>
                                                        {vendorDocuments.application.spouse_name && (
                                                            <div>
                                                                <span className="font-medium text-gray-600">Spouse:</span>
                                                                <span className="ml-2 text-gray-900">{vendorDocuments.application.spouse_name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Contact Information */}
                                                <div className="bg-white p-3 rounded border">
                                                    <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="font-medium text-gray-600">Email:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.email}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Phone:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.phone_number}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Complete Address:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.complete_address}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Business Information */}
                                                <div className="bg-white p-3 rounded border">
                                                    <h4 className="font-semibold text-gray-700 mb-2">Business Information</h4>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="font-medium text-gray-600">Business Name:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.business_name || 'Not specified'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Business Type:</span>
                                                            <span className="ml-2 text-gray-900">{vendorDocuments.application.business_type || 'Not specified'}</span>
                                                        </div>
                                                        {vendorDocuments.application.products_services_description && (
                                                            <div>
                                                                <span className="font-medium text-gray-600">Products/Services:</span>
                                                                <span className="ml-2 text-gray-900">{vendorDocuments.application.products_services_description}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actual Occupant Information (if different from applicant) */}
                                                {(vendorDocuments.application.actual_occupant_first_name || vendorDocuments.application.actual_occupant_last_name) && (
                                                    <div className="bg-white p-3 rounded border">
                                                        <h4 className="font-semibold text-gray-700 mb-2">Actual Occupant Information</h4>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="font-medium text-gray-600">Name:</span>
                                                                <span className="ml-2 text-gray-900">
                                                                    {vendorDocuments.application.actual_occupant_first_name} {vendorDocuments.application.actual_occupant_last_name}
                                                                </span>
                                                            </div>
                                                            {vendorDocuments.application.actual_occupant_username && (
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Username:</span>
                                                                    <span className="ml-2 text-gray-900">{vendorDocuments.application.actual_occupant_username}</span>
                                                                </div>
                                                            )}
                                                            {vendorDocuments.application.actual_occupant_phone && (
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Phone:</span>
                                                                    <span className="ml-2 text-gray-900">{vendorDocuments.application.actual_occupant_phone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Document Approval Summary */}
                                            <div className="mt-6 pt-4 border-t border-gray-300">
                                                <h4 className="font-medium text-gray-700 mb-2">Document Approval Status</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {(() => {
                                                        const documentTypes = [
                                                            'person_photo',
                                                            'barangay_clearance',
                                                            'id_front_photo',
                                                            'id_back_photo',
                                                            'birth_certificate',
                                                            'marriage_certificate',
                                                            'notarized_document'
                                                        ];

                                                        const approvedCount = documentTypes.filter(type =>
                                                            documentApprovals[`${type}_approved`] === true
                                                        ).length;

                                                        const rejectedCount = documentTypes.filter(type =>
                                                            documentApprovals[`${type}_approved`] === false
                                                        ).length;

                                                        const pendingCount = documentTypes.filter(type =>
                                                            documentApprovals[`${type}_approved`] === null || documentApprovals[`${type}_approved`] === undefined
                                                        ).length;

                                                        return (
                                                            <>
                                                                {approvedCount > 0 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        ✓ {approvedCount} Approved
                                                                    </span>
                                                                )}
                                                                {rejectedCount > 0 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                        ✗ {rejectedCount} Rejected
                                                                    </span>
                                                                )}
                                                                {pendingCount > 0 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                        ⏳ {pendingCount} Pending
                                                                    </span>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Documents Grid - Right Side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Person Photo */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">Person Photo</h4>
                                            {vendorDocuments.documents.person_photo ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={vendorDocuments.documents.person_photo}
                                                        alt="Person Photo"
                                                        className="w-full h-48 object-cover rounded border"
                                                    />
                                                    <a
                                                        href={vendorDocuments.documents.person_photo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <DocumentApprovalComponent documentType="person_photo" documentName="Person Photo" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No photo uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Barangay Clearance */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">Barangay Clearance</h4>
                                            {vendorDocuments.documents.barangay_clearance ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={vendorDocuments.documents.barangay_clearance}
                                                        alt="Barangay Clearance"
                                                        className="w-full h-48 object-cover rounded border"
                                                    />
                                                    <a
                                                        href={vendorDocuments.documents.barangay_clearance}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <DocumentApprovalComponent documentType="barangay_clearance" documentName="Barangay Clearance" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No document uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Government ID Front */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">Government ID (Front)</h4>
                                            {vendorDocuments.documents.id_front_photo ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={vendorDocuments.documents.id_front_photo}
                                                        alt="Government ID Front"
                                                        className="w-full h-48 object-cover rounded border"
                                                    />
                                                    <a
                                                        href={vendorDocuments.documents.id_front_photo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <DocumentApprovalComponent documentType="id_front_photo" documentName="Government ID (Front)" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No photo uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Government ID Back */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">Government ID (Back)</h4>
                                            {vendorDocuments.documents.id_back_photo ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={vendorDocuments.documents.id_back_photo}
                                                        alt="Government ID Back"
                                                        className="w-full h-48 object-cover rounded border"
                                                    />
                                                    <a
                                                        href={vendorDocuments.documents.id_back_photo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <DocumentApprovalComponent documentType="id_back_photo" documentName="Government ID (Back)" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No photo uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Birth Certificate */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">Birth Certificate</h4>
                                            {vendorDocuments.documents.birth_certificate ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={vendorDocuments.documents.birth_certificate}
                                                        alt="Birth Certificate"
                                                        className="w-full h-48 object-cover rounded border"
                                                    />
                                                    <a
                                                        href={vendorDocuments.documents.birth_certificate}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <DocumentApprovalComponent documentType="birth_certificate" documentName="Birth Certificate" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No document uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Marriage Certificate */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">Marriage Certificate</h4>
                                            {vendorDocuments.documents.marriage_certificate ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={vendorDocuments.documents.marriage_certificate}
                                                        alt="Marriage Certificate"
                                                        className="w-full h-48 object-cover rounded border"
                                                    />
                                                    <a
                                                        href={vendorDocuments.documents.marriage_certificate}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <DocumentApprovalComponent documentType="marriage_certificate" documentName="Marriage Certificate" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No document uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Notarized Document */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">Notarized Application Form</h4>
                                            {vendorDocuments.documents.notarized_document ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={vendorDocuments.documents.notarized_document}
                                                        alt="Notarized Application Form"
                                                        className="w-full h-48 object-cover rounded border"
                                                    />
                                                    <a
                                                        href={vendorDocuments.documents.notarized_document}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <DocumentApprovalComponent documentType="notarized_document" documentName="Notarized Application Form" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">No document uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Business Permit - Only show for raffle winners */}
                                        {vendorDocuments.application?.status === 'won_raffle' || vendorDocuments.application?.status === 'documents_submitted' || vendorDocuments.application?.status === 'activated' ? (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-3">Business Permit</h4>
                                                {vendorDocuments.documents.business_permit_document ? (
                                                    <div className="space-y-2">
                                                        <img
                                                            src={vendorDocuments.documents.business_permit_document}
                                                            alt="Business Permit"
                                                            className="w-full h-48 object-cover rounded border"
                                                        />
                                                        <DocumentApprovalComponent documentType="business_permit_document" documentName="Business Permit" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">No document uploaded</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}

                                        {/* Cedula - Only show for raffle winners */}
                                        {vendorDocuments.application?.status === 'won_raffle' || vendorDocuments.application?.status === 'documents_submitted' || vendorDocuments.application?.status === 'activated' ? (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-3">Cedula (Community Tax Certificate)</h4>
                                                {vendorDocuments.documents.cedula_document ? (
                                                    <div className="space-y-2">
                                                        <img
                                                            src={vendorDocuments.documents.cedula_document}
                                                            alt="Cedula"
                                                            className="w-full h-48 object-cover rounded border"
                                                        />
                                                        <DocumentApprovalComponent documentType="cedula_document" documentName="Cedula" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">No document uploaded</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center gap-4 pt-6 border-t col-span-full">
                                    <button
                                        onClick={() => {
                                            setShowDocumentsModal(false);
                                            setVendorDocuments(null);
                                        }}
                                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                    {/* Show Done button when both cedula and business permit are approved */}
                                    {(() => {
                                        const businessPermitStatus = getDocumentApprovalStatus('business_permit_document');
                                        const cedulaStatus = getDocumentApprovalStatus('cedula_document');
                                        const bothDocumentsApproved = businessPermitStatus.status === 'approved' && cedulaStatus.status === 'approved';

                                        return bothDocumentsApproved && (
                                            <button
                                                onClick={() => {
                                                    setShowDocumentsModal(false);
                                                    setVendorDocuments(null);
                                                    fetchVendors(); // Refresh the vendors list to show updated status
                                                }}
                                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Done
                                            </button>
                                        );
                                    })()}
                                    {(selectedVendor.status?.toLowerCase() === 'pending' || selectedVendor.status?.toLowerCase() === 'pending_approval') && (
                                        <>
                                            {(() => {
                                                // Check if there are any rejected documents
                                                const hasRejectedDocuments = Object.keys(documentApprovals).some(key =>
                                                    key.endsWith('_approved') && documentApprovals[key] === false
                                                );

                                                // Get list of all uploaded documents that need review
                                                const uploadedDocuments = [
                                                    vendorDocuments.documents.person_photo && 'person_photo',
                                                    vendorDocuments.documents.barangay_clearance && 'barangay_clearance',
                                                    vendorDocuments.documents.id_front_photo && 'id_front_photo',
                                                    vendorDocuments.documents.id_back_photo && 'id_back_photo',
                                                    vendorDocuments.documents.birth_certificate && 'birth_certificate',
                                                    vendorDocuments.documents.marriage_certificate && 'marriage_certificate',
                                                    vendorDocuments.documents.notarized_document && 'notarized_document',
                                                    vendorDocuments.documents.business_permit_document && 'business_permit_document',
                                                    vendorDocuments.documents.cedula_document && 'cedula_document',
                                                ].filter(Boolean); // Remove null/undefined values

                                                // Check if ALL uploaded documents have been reviewed (approved or rejected)
                                                const allDocumentsReviewed = uploadedDocuments.every(docType => {
                                                    const approvalKey = `${docType}_approved`;
                                                    return documentApprovals[approvalKey] === true || documentApprovals[approvalKey] === false;
                                                });

                                                // Check if all documents are approved (and none rejected)
                                                const allDocumentsApproved = allDocumentsReviewed && !hasRejectedDocuments;

                                                if (!allDocumentsReviewed) {
                                                    // Some documents haven't been reviewed yet
                                                    return (
                                                        <button
                                                            disabled
                                                            className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                                                            title="Please review all documents before approving"
                                                        >
                                                            Approve Application (Review All Documents First)
                                                        </button>
                                                    );
                                                } else if (hasRejectedDocuments) {
                                                    return (
                                                        <button
                                                            onClick={() => {
                                                                setConfirmationModalData({
                                                                    title: 'Partially Approve Application',
                                                                    message: 'This vendor has rejected documents. They need to re-upload rejected documents before stall assignment. Do you want to mark this as partially approved without stall assignment?',
                                                                    onConfirm: () => {
                                                                        handlePartialApproval(selectedVendor);
                                                                        setShowConfirmationModal(false);
                                                                    },
                                                                    type: 'warning'
                                                                });
                                                                setShowConfirmationModal(true);
                                                            }}
                                                            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                                        >
                                                            Partially Approve (No Stall)
                                                        </button>
                                                    );
                                                } else if (allDocumentsApproved) {
                                                    return (
                                                        <button
                                                            onClick={() => {
                                                                setConfirmationModalData({
                                                                    title: 'Approve Application',
                                                                    message: 'Are you sure you want to approve this vendor application? They will be marked as approved for raffle.',
                                                                    onConfirm: () => {
                                                                        handleApproveForRaffle(selectedVendor);
                                                                        setShowConfirmationModal(false);
                                                                    },
                                                                    type: 'approve'
                                                                });
                                                                setShowConfirmationModal(true);
                                                            }}
                                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Approve Application
                                                        </button>
                                                    );
                                                }
                                            })()}
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No application documents found for this vendor.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ApprovalModal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                type={approvalModalData.type}
                title={approvalModalData.title}
                message={approvalModalData.message}
            />

            <ConfirmationModal
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={confirmationModalData.onConfirm}
                title={confirmationModalData.title}
                message={confirmationModalData.message}
                type={confirmationModalData.type}
                confirmText="Confirm"
                cancelText="Cancel"
            />

            <RejectionModal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                onConfirm={rejectionModalData.onConfirm}
                documentName={rejectionModalData.documentName}
            />
        </div>
    )
}
