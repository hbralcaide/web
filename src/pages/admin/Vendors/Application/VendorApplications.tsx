// src/pages/admin/Vendors/Application/VendorApplications.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../../config/supabaseClient'; // adjust path as needed to point to your actual supabaseClient file
// Update the import path to the correct location of your supabase types file
import type { Database } from '../../../../types/supabase';
// If the file does not exist, create 'src/types/supabase.ts' and export Database type from there.

// shared helpers & types (one source of truth)
import {
  mapToVendorApplication,
  maybeAdvanceToRaffle,
  VendorApplication as SharedVendorApplication,
  SupabaseQueryResult,
  VendorApplicationUpdate as SharedVendorApplicationUpdate, // if you exported it, otherwise use Database['public']['Tables']['vendor_applications']['Update']
} from '../../../../lib/applicationHelpers';

// short-named modal components (in same folder ./modals)
import Credentials from './modals/Credentials';
import VendorDetails from './modals/VendorDetails';

// If you didn't export VendorApplicationUpdate from helpers, fall back to table Update type:
type VendorApplicationUpdate = Database['public']['Tables']['vendor_applications']['Update'];

export default function VendorApplications() {
  const [applications, setApplications] = useState<SharedVendorApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApplication, setSelectedApplication] = useState<SharedVendorApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showCredsModal, setShowCredsModal] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('fetchApplications error:', error);
        return;
      }

      const normalized = (data || []).map((row: SupabaseQueryResult) => mapToVendorApplication(row));
      setApplications(normalized);
    } catch (err) {
      console.error('fetchApplications unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    // optional: expose for debugging/other widgets
    (window as any).fetchApplications = fetchApplications;
  }, [fetchApplications]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const updateData: Partial<VendorApplicationUpdate> = { status, updated_at: new Date().toISOString() };
      const { data, error } = await supabase
        .from('vendor_applications')
        .update(updateData)
        .eq('id', id)
        .select()
        .single<SupabaseQueryResult>();

      if (error) {
        console.error('handleUpdateStatus error:', error);
        throw error;
      }

      const normalized = mapToVendorApplication(data);
      setApplications(prev => prev.map(a => (a.id === id ? normalized : a)));
      setSelectedApplication(prev => (prev && prev.id === id ? normalized : prev));
    } catch (err) {
      console.error('handleUpdateStatus failed:', err);
      throw err;
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected applications? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('vendor_applications').delete().in('id', selectedIds);
      if (error) throw error;
      setApplications(prev => prev.filter(app => !selectedIds.includes(app.id)));
      setSelectedIds([]);
      alert('Deleted successfully!');
    } catch (err) {
      console.error('Bulk delete failed:', err);
      alert('Failed to delete selected applications.');
    }
  };

  const filteredApplications = applications.filter(app => (statusFilter === 'all' ? true : app.application_status === statusFilter));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
          <p className="text-gray-600">Review and manage vendor applications</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCredsModal(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Credentials
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'All Applications' },
            { key: 'pending', label: 'Pending Review' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">Showing {filteredApplications.length} applications</p>
              {filteredApplications.length > 0 && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={(e) => setSelectedIds(e.target.checked ? filteredApplications.map(app => app.id) : [])}
                  />
                  <span className="text-xs">Select All</span>
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedIds.length === 0}
                    className={`px-3 py-1 text-sm font-medium rounded ${selectedIds.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-600 text-white'}`}
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </div>

            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No applications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredApplications.map(application => (
                  <div key={application.id} className="p-4 hover:bg-gray-50 flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={selectedIds.includes(application.id)}
                      onChange={(e) => setSelectedIds(prev => e.target.checked ? [...prev, application.id] : prev.filter(id => id !== application.id))}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{application.business_name || 'No Business Name'}</h3>
                      <p className="text-sm text-gray-600">{application.email || 'No Email'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetailsModal(true);
                      }}
                      className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Details modal (extracted) */}
      <VendorDetails
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onUpdateStatus={async (id: string, status: string) => {
          await handleUpdateStatus(id, status);
          // after updating status, ensure the list is fresh
          await fetchApplications();
        }}
        refetchApplications={fetchApplications}
      />

      {/* Credentials modal (generic; parent should pass onSave if needed) */}
      <Credentials
        isOpen={showCredsModal}
        onClose={() => setShowCredsModal(false)}
        credentials={null}
        onSave={async (payload) => {
          // default: no-op; implement your save logic here or pass custom onSave prop
          console.log('Credentials save payload:', payload);
        }}
      />
    </div>
  );
}
