// src/pages/admin/Vendors/Application/modals/VendorDetails.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../../config/supabaseClient';
import type { Database } from '../../../../../types/supabase';
import {
  VendorApplication as SharedVendorApplication,
  mapToVendorApplication,
  maybeAdvanceToRaffle,
  SupabaseQueryResult,
} from '../../../../../lib/applicationHelpers';

type VendorApplicationUpdate = Database['public']['Tables']['vendor_applications']['Update'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  application: SharedVendorApplication | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  refetchApplications?: () => Promise<void>;
}

const formatDate = (d?: string | null) => {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
};

const VendorDetails: React.FC<Props> = ({ isOpen, onClose, application, onUpdateStatus, refetchApplications }) => {
  const [localApp, setLocalApp] = useState<SharedVendorApplication | null>(application);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'documents'>('personal');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  useEffect(() => {
    setLocalApp(application ? { ...application } : null);
  }, [application]);

  if (!isOpen || !localApp) return null;

  const handleSingleApprove = async (approveKey: keyof VendorApplicationUpdate) => {
    setUpdating(true);
    try {
      const updateQuery = `
        UPDATE vendor_applications
        SET ${approveKey} = true, updated_at = NOW()
        WHERE id = '${localApp.id}'
        RETURNING *;
      `;

      const { data, error } = await supabase.rpc('execute_raw_sql', { query: updateQuery });

      if (error) throw error;

      const normalized = mapToVendorApplication(data[0]);
      setLocalApp(normalized);

      if (refetchApplications) await refetchApplications();

      // Check if the application can advance to raffle
      const allApproved = [
        'person_photo_approved',
        'barangay_clearance_approved',
        'id_front_photo_approved',
        'id_back_photo_approved',
        'birth_certificate_approved',
        ...(normalized.marital_status?.toLowerCase() === 'married'
          ? ['marriage_certificate_approved']
          : []),
        'notarized_document_approved',
      ].every((key) => normalized[key]);

      if (allApproved) {
        await maybeAdvanceToRaffle(localApp.id, normalized);
      }
    } catch (err) {
      console.error('Single approve error:', err);
      alert('Failed to approve document.');
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkApprove = async (approveKeys: (keyof VendorApplicationUpdate)[]) => {
    if (!approveKeys.length) return;
    setUpdating(true);
    try {
      const updateQuery = `
        UPDATE vendor_applications
        SET ${approveKeys.map((key) => `${key} = true`).join(', ')}, updated_at = NOW()
        WHERE id = '${localApp.id}'
        RETURNING *;
      `;

      const { data, error } = await supabase.rpc('execute_raw_sql', { query: updateQuery });

      if (error) throw error;

      const normalized = mapToVendorApplication(data[0]);
      setLocalApp(normalized);
      setSelectedDocs([]);

      if (refetchApplications) await refetchApplications();

      // Check if the application can advance to raffle
      const allApproved = [
        'person_photo_approved',
        'barangay_clearance_approved',
        'id_front_photo_approved',
        'id_back_photo_approved',
        'birth_certificate_approved',
        ...(normalized.marital_status?.toLowerCase() === 'married'
          ? ['marriage_certificate_approved']
          : []),
        'notarized_document_approved',
      ].every((key) => normalized[key]);

      if (allApproved) {
        await maybeAdvanceToRaffle(localApp.id, normalized);
      }
    } catch (err) {
      console.error('Bulk approve error:', err);
      alert('Bulk approve failed.');
    } finally {
      setUpdating(false);
    }
  };

  // Derived display values
  const fullName = `${localApp.first_name ?? ''} ${localApp.middle_name ? localApp.middle_name + ' ' : ''}${localApp.last_name ?? ''}`.trim();
  const actualOccupant = `${(localApp.actual_occupant_first_name ?? '')} ${(localApp.actual_occupant_last_name ?? '')}`.trim() || '-';

  // Add a section to display all possible vendor statuses
  const vendorStatuses = [
    'pending',
    'approved',
    'rejected',
    'under_review',
    'awaiting_documents',
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'personal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              Submitted Documents
            </button>
          </div>

          {/* Personal Information Tab - restored full fields */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{fullName || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <p className="text-gray-900">{formatDate(localApp.birth_date)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="text-gray-900">{localApp.age ?? '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="text-gray-900">{localApp.gender ?? '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <p className="text-gray-900">{localApp.marital_status ?? '-'}</p>
              </div>

              {localApp.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <p className="text-gray-900">{localApp.email}</p>
                </div>
              )}

              {localApp.phone_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-gray-900">{localApp.phone_number}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Actual Occupant Name</label>
                <p className="text-gray-900">{actualOccupant}</p>
              </div>

              {localApp.business_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-gray-900">{localApp.business_name}</p>
                </div>
              )}

              {localApp.business_type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Type</label>
                  <p className="text-gray-900">{localApp.business_type}</p>
                </div>
              )}

              {/* Optional additional fields if present */}
              {localApp.actual_occupant && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Actual Occupant (raw)</label>
                  <p className="text-gray-900">{localApp.actual_occupant}</p>
                </div>
              )}

              {localApp.proof_of_stall_payment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Proof of Stall Payment</label>
                  <p className="text-gray-900">
                    <a href={localApp.proof_of_stall_payment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View document
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'barangay_clearance', label: 'Barangay Clearance', approveKey: 'barangay_clearance_approved' },
                  { key: 'birth_certificate', label: 'Birth Certificate', approveKey: 'birth_certificate_approved' },
                  ...(localApp.marital_status && typeof localApp.marital_status === 'string' && localApp.marital_status.toLowerCase() === 'married'
                    ? [{ key: 'marriage_certificate', label: 'Marriage Certificate', approveKey: 'marriage_certificate_approved' }]
                    : []),
                  { key: 'id_front_photo', label: 'Valid ID (Front)', approveKey: 'id_front_photo_approved' },
                  { key: 'id_back_photo', label: 'Valid ID (Back)', approveKey: 'id_back_photo_approved' },
                  { key: 'person_photo', label: 'Person Photo', approveKey: 'person_photo_approved' },
                  { key: 'notarized_document', label: 'Notarized Document', approveKey: 'notarized_document_approved' },
                ].map(({ key, label, approveKey }) => {
                  const val = (localApp as any)[key] as string | undefined | null;
                  const isImage = typeof val === 'string' && (val.startsWith('http') || val.startsWith('https'));
                  const isApproved = Boolean((localApp as any)[approveKey]);
                  return (
                    <div key={key} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-semibold text-gray-900">{label}</span>
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(approveKey)}
                          onChange={(e) =>
                            setSelectedDocs((prev) =>
                              e.target.checked ? Array.from(new Set([...prev, approveKey])) : prev.filter((x) => x !== approveKey)
                            )
                          }
                        />
                      </div>

                      {isImage ? (
                        <a href={val} target="_blank" rel="noopener noreferrer">
                          <img src={val!} alt={label} className="w-full h-32 object-cover rounded-lg border bg-gray-100" />
                        </a>
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg border">
                          <span className="text-gray-400 text-sm">No image uploaded</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        {val && !isApproved && (
                          <button onClick={() => handleSingleApprove(approveKey)} className="px-3 py-1 text-xs rounded-lg font-medium bg-green-600 text-white">
                            Approve
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            if (!isApproved) return;
                            setUpdating(true);
                            try {
                              const updateObj: Partial<VendorApplicationUpdate> = {
                                [approveKey]: false as any,
                                updated_at: new Date().toISOString(),
                              };
                              const { data, error } = await supabase
                                .from('vendor_applications')
                                .update(updateObj)
                                .eq('id', localApp.id)
                                .select()
                                .single<SupabaseQueryResult>();
                              if (error) throw error;
                              setLocalApp(mapToVendorApplication(data));
                              if (refetchApplications) await refetchApplications();
                            } catch (err) {
                              console.error('Reject doc error:', err);
                              alert('Failed to reject document.');
                            } finally {
                              setUpdating(false);
                            }
                          }}
                          disabled={!isApproved}
                          className={`px-3 py-1 text-xs rounded-lg font-medium ${isApproved ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-400'}`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleBulkApprove(selectedDocs)}
                  disabled={selectedDocs.length === 0 || updating}
                  className={`px-4 py-2 rounded ${selectedDocs.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white'}`}
                >
                  {updating ? 'Updating...' : 'Bulk Approve'}
                </button>

                <button
                  onClick={async () => {
                    if (!selectedDocs.length) return;
                    setUpdating(true);
                    try {
                      const updateObj: Partial<VendorApplicationUpdate> = {};
                      selectedDocs.forEach((key) => {
                        updateObj[key as keyof VendorApplicationUpdate] = false as any;
                      });
                      updateObj.updated_at = new Date().toISOString();
                      const { data, error } = await supabase
                        .from('vendor_applications')
                        .update(updateObj)
                        .eq('id', localApp.id)
                        .select()
                        .single<SupabaseQueryResult>();
                      if (error) throw error;
                      setLocalApp(mapToVendorApplication(data));
                      setSelectedDocs([]);
                      if (refetchApplications) await refetchApplications();
                    } catch (err) {
                      console.error('Bulk reject error:', err);
                      alert('Bulk reject failed.');
                    } finally {
                      setUpdating(false);
                    }
                  }}
                  disabled={selectedDocs.length === 0 || updating}
                  className={`px-4 py-2 rounded ${selectedDocs.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-red-600 text-white'}`}
                >
                  {updating ? 'Updating...' : 'Bulk Reject'}
                </button>
              </div>
            </div>
          )}

          {/* Status summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Status:</p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    localApp.application_status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : localApp.application_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {localApp.application_status}
                </span>
              </div>

              <div>
                <button
                  onClick={async () => {
                    setUpdating(true);
                    try {
                      await onUpdateStatus(localApp.id, 'rejected');
                      if (refetchApplications) {
                        await refetchApplications();
                      }
                      onClose();
                    } catch (err) {
                      console.error('Status update failed:', err);
                    } finally {
                      setUpdating(false);
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Mark Rejected
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Applied: {new Date(localApp.created_at).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(localApp.updated_at).toLocaleDateString()}</p>
            </div>

            {/* Display all possible vendor statuses */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900">Possible Vendor Statuses:</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {['pending', 'approved', 'rejected', 'under_review', 'awaiting_documents'].map((status) => (
                  <li key={status}>{status}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
