// src/lib/applicationHelpers.ts
import { supabase } from '../config/supabaseClient';
import type { Database } from '../types/supabase';

/**
 * Shared types
 */
export type VendorApplicationUpdate = Database['public']['Tables']['vendor_applications']['Update'];

export interface SupabaseQueryResult {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  status?: string;
  [key: string]: any;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface VendorApplication {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  barangay_clearance?: string | null;
  mayors_permit?: string | null;
  birth_certificate?: string | null;
  marriage_certificate?: string | null;
  id_front_photo?: string | null;
  id_back_photo?: string | null;
  person_photo?: string | null;
  notarized_document?: string | null;
  proof_of_stall_payment?: string | null;
  application_status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  marital_status?: string | null;
  [key: string]: any;
}

/** Normalize DB status -> application_status for UI */
export const normalizeApplicationStatus = (status?: string): ApplicationStatus => {
  switch (status) {
    case 'approved':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'pending':
    case 'pending_approval':
    default:
      return 'pending';
  }
};

/** Map a DB row to VendorApplication expected by UI */
export const mapToVendorApplication = (row: SupabaseQueryResult): VendorApplication => {
  const { id, first_name, last_name, created_at, updated_at, status, ...rest } = row;
  return {
    id,
    first_name,
    last_name,
    created_at,
    updated_at,
    application_status: normalizeApplicationStatus(status),
    ...rest,
  } as VendorApplication;
};

/**
 * Check required approvals and advance status server-side via Supabase update.
 * This can be safely called after approving documents from the client.
 */
export const maybeAdvanceToRaffle = async (
  id: string,
  latestRow?: VendorApplication
): Promise<{ updated: boolean; newStatus?: string | null }> => {
  try {
    // Ensure we have the freshest row
    const row: VendorApplication | null = latestRow
      ? (latestRow as VendorApplication)
      : (await supabase.from('vendor_applications').select('*').eq('id', id).single()).data ?? null;

    if (!row) {
      console.warn('maybeAdvanceToRaffle: no row found for id', id);
      return { updated: false, newStatus: null };
    }

    // Required approvals for raffle (base set)
    const requiredApprovals = [
      'person_photo_approved',
      'barangay_clearance_approved',
      'id_front_photo_approved',
      'id_back_photo_approved',
      'birth_certificate_approved',
      'notarized_document_approved',
    ];

    // If married, require marriage certificate too
    if (row.marital_status && typeof row.marital_status === 'string' && row.marital_status.toLowerCase() === 'married') {
      requiredApprovals.push('marriage_certificate_approved');
    }

    // Determine if all required approval booleans are true
    const allApproved = requiredApprovals.every((k) => row[k] === true);

    // Normalize current status
    const currentStatus =
      (row.status as string) ??
      (row.application_status as string) ??
      null;

    if (allApproved) {
      // Move to approved_for_raffle if not already
      if (currentStatus !== 'approved_for_raffle') {
        const updateData: Partial<Database['public']['Tables']['vendor_applications']['Update']> = {
          status: 'approved_for_raffle',
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('vendor_applications')
          .update(updateData)
          .eq('id', id);

        if (error) {
          console.error('maybeAdvanceToRaffle update -> approved_for_raffle error:', error);
          return { updated: false, newStatus: null };
        }

        return { updated: true, newStatus: 'approved_for_raffle' };
      }

      return { updated: false, newStatus: currentStatus };
    } else {
      // Not all approved. If current status is approved_for_raffle, downgrade to awaiting_documents
      if (currentStatus === 'approved_for_raffle') {
        const updateData: Partial<Database['public']['Tables']['vendor_applications']['Update']> = {
          status: 'awaiting_documents',
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('vendor_applications')
          .update(updateData)
          .eq('id', id);

        if (error) {
          console.error('maybeAdvanceToRaffle update -> awaiting_documents error:', error);
          return { updated: false, newStatus: null };
        }

        return { updated: true, newStatus: 'awaiting_documents' };
      }

      // No status change necessary
      return { updated: false, newStatus: currentStatus };
    }
  } catch (err) {
    console.error('maybeAdvanceToRaffle unexpected error:', err);
    return { updated: false, newStatus: null };
  }
};
