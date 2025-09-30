import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

interface VendorApplication {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email?: string;
  phone_number?: string;
  business_name?: string;
  business_type?: string;
  barangay_clearance?: string;
  mayors_permit?: string;
  birth_certificate?: string;
  marriage_certificate?: string;
  valid_id?: string;
  person_photo?: string;
  notarized_document?: string;
  proof_of_stall_payment?: string;
  application_status: string;
  created_at: string;
  updated_at: string;
}

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: VendorApplication | null;
  onUpdateStatus: (id: string, status: string) => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  isOpen,
  onClose,
  application,
  onUpdateStatus
}) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status: string) => {
    if (!application) return;

    setUpdating(true);
    try {
      await onUpdateStatus(application.id, status);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Application Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">
                  {application.first_name} {application.middle_name} {application.last_name}
                </p>
              </div>

              {application.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{application.email}</p>
                </div>
              )}

              {application.phone_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-gray-900">{application.phone_number}</p>
                </div>
              )}

              {application.business_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-gray-900">{application.business_name}</p>
                </div>
              )}

              {application.business_type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Type</label>
                  <p className="text-gray-900">{application.business_type}</p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Submitted Documents</h4>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'barangay_clearance', label: 'Barangay Clearance' },
                  { key: 'mayors_permit', label: "Mayor's Permit" },
                  { key: 'birth_certificate', label: 'Birth Certificate' },
                  { key: 'marriage_certificate', label: 'Marriage Certificate' },
                  { key: 'valid_id', label: 'Valid ID' },
                  { key: 'person_photo', label: 'Person Photo' },
                  { key: 'notarized_document', label: 'Notarized Document' },
                  { key: 'proof_of_stall_payment', label: 'Proof of Stall Payment' }
                ].map(({ key, label }) => {
                  const value = application[key as keyof VendorApplication];
                  return (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {value ? 'Submitted' : 'Missing'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Application Status and Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Current Status:</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${application.application_status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : application.application_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {application.application_status}
                </span>
              </div>

              {application.application_status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? 'Updating...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={updating}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? 'Updating...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Applied: {new Date(application.created_at).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(application.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VendorApplications() {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await (supabase as any)
        .from('vendor_applications')
        .update({
          application_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating application:', error);
        alert('Failed to update application status. Please try again.');
        return;
      }

      // Update local state
      setApplications(prevApps =>
        prevApps.map(app =>
          app.id === id
            ? { ...app, application_status: status, updated_at: new Date().toISOString() }
            : app
        )
      );

      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleViewDetails = (application: VendorApplication) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.application_status === statusFilter;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.application_status === 'pending').length,
    approved: applications.filter(app => app.application_status === 'approved').length,
    rejected: applications.filter(app => app.application_status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
        <p className="text-gray-600">Review and manage vendor applications</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'All Applications', count: statusCounts.all },
            { key: 'pending', label: 'Pending Review', count: statusCounts.pending },
            { key: 'approved', label: 'Approved', count: statusCounts.approved },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-700">
                Showing {filteredApplications.length} applications
              </p>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  {statusFilter === 'all'
                    ? 'No applications found.'
                    : `No ${statusFilter} applications found.`
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.first_name} {application.middle_name} {application.last_name}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${application.application_status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : application.application_status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {application.application_status}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          {application.business_name && (
                            <p><span className="font-medium">Business:</span> {application.business_name}</p>
                          )}
                          {application.email && (
                            <p><span className="font-medium">Email:</span> {application.email}</p>
                          )}
                          <p><span className="font-medium">Applied:</span> {new Date(application.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(application)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                        >
                          View Details
                        </button>

                        {application.application_status === 'pending' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'approved')}
                              className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded hover:bg-green-200 transition-colors"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}