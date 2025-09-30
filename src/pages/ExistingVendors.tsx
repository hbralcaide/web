import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface ExistingVendor {
  id: string;
  vendor_application_id?: string;
  auth_user_id: string;
  created_at: string;
  updated_at: string;
  market_section_id?: string;
  business_name: string;
  business_type: string;
  username: string;
  role: string;
  status: string;
  stall_number?: string;
  category?: string;
  meat_subcategory?: string;
  complete_address?: string;
  products_services_description?: string;
  actual_occupant_first_name?: string;
  actual_occupant_last_name?: string;
  actual_occupant_username?: string;
  actual_occupant_phone?: string;
  actual_occupant_password_hash?: string;
  application_status: string;
  signup_method: string;
  middle_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Partial<ExistingVendor>) => void;
  editingVendor?: ExistingVendor | null;
  sections: Section[];
  stalls: Stall[];
  availableStalls: Stall[];
  setAvailableStalls: (stalls: Stall[]) => void;
}

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  password: string;
  vendorName: string;
  stallNumber?: string;
  isSuccess: boolean;
  message: string;
  operationType?: 'add' | 'delete';
  actualOccupantName?: string;
  actualOccupantUsername?: string;
  actualOccupantPassword?: string;
  actualOccupantPhone?: string;
}

interface VendorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: ExistingVendor | null;
  onSave: (vendor: Partial<ExistingVendor>) => void;
  sections: Section[];
  stalls: Stall[];
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  username,
  password,
  vendorName,
  stallNumber,
  isSuccess,
  message,
  operationType = 'add',
  actualOccupantName,
  actualOccupantUsername,
  actualOccupantPassword,
  actualOccupantPhone
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-2xl rounded-xl bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {isSuccess ? (
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              )}
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {operationType === 'delete'
                    ? (isSuccess ? 'Vendor Removed Successfully' : 'Vendor Removal Failed')
                    : (isSuccess ? 'Vendor Added Successfully' : 'Vendor Created')}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-base text-gray-700 mb-6 font-medium">{message}</p>

            {/* Two-column layout for better visibility */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left Column - Vendor Information */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">Vendor Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Vendor Name</label>
                    <p className="text-xl font-bold text-gray-900">{vendorName}</p>
                  </div>

                  {stallNumber && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Assigned Stall</label>
                      <p className="text-xl font-bold text-indigo-700">{stallNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Login Credentials */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586l4.293-4.293A6 6 0 0119 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800">Login Credentials</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Username</label>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-mono font-bold bg-gray-50 px-4 py-2 rounded-lg border-2 flex-1 text-gray-900">{username}</p>
                      <button
                        onClick={() => copyToClipboard(username)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        title="Copy username"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  {password && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-mono font-bold bg-gray-50 px-4 py-2 rounded-lg border-2 flex-1 text-gray-900">{password}</p>
                        <button
                          onClick={() => copyToClipboard(password)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          title="Copy password"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actual Occupant Information Section */}
            {actualOccupantName && actualOccupantUsername && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800">Actual Occupant Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Actual Occupant Details */}
                  <div>
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Actual Occupant Name</label>
                      <p className="text-xl font-bold text-gray-900">{actualOccupantName}</p>
                    </div>
                    {actualOccupantPhone && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
                        <p className="text-lg font-medium text-gray-900">{actualOccupantPhone}</p>
                      </div>
                    )}
                  </div>

                  {/* Actual Occupant Login Credentials */}
                  <div>
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Username</label>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-mono font-bold bg-gray-50 px-4 py-2 rounded-lg border-2 flex-1 text-gray-900">{actualOccupantUsername}</p>
                        <button
                          onClick={() => copyToClipboard(actualOccupantUsername || '')}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          title="Copy username"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                    </div>

                    {actualOccupantPassword && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-mono font-bold bg-gray-50 px-4 py-2 rounded-lg border-2 flex-1 text-gray-900">{actualOccupantPassword}</p>
                          <button
                            onClick={() => copyToClipboard(actualOccupantPassword || '')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            title="Copy password"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Important Note Section */}
            {(password || actualOccupantPassword) && (
              <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Important Note:</p>
                    <p className="text-sm text-amber-700">
                      Please share these credentials with {actualOccupantName ? 'both the vendor and actual occupant' : 'the vendor'} immediately. All passwords are securely hashed in the database and cannot be recovered later.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Copy Success Message */}
            {copied && (
              <div className="mt-4 flex items-center justify-center">
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ✓ Copied to clipboard!
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSave,
  sections,
  stalls
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showActualOccupant, setShowActualOccupant] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    username: '',
    email: '',
    phone_number: '',
    business_name: '',
    business_type: '',
    status: '',
    complete_address: '',
    products_services_description: '',
    actual_occupant_first_name: '',
    actual_occupant_last_name: '',
    actual_occupant_username: '',
    actual_occupant_phone: '',
    actual_occupant_password_hash: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendor && isOpen) {
      const hasActualOccupantData = vendor.actual_occupant_first_name || vendor.actual_occupant_last_name || vendor.actual_occupant_username || vendor.actual_occupant_phone;
      setShowActualOccupant(Boolean(hasActualOccupantData));
      setFormData({
        first_name: vendor.first_name || '',
        last_name: vendor.last_name || '',
        middle_name: vendor.middle_name || '',
        username: vendor.username || '',
        email: vendor.email || '',
        phone_number: vendor.phone_number || '',
        business_name: vendor.business_name || '',
        business_type: vendor.business_type || 'General',
        status: vendor.status || '',
        complete_address: vendor.complete_address || '',
        products_services_description: vendor.products_services_description || '',
        actual_occupant_first_name: vendor.actual_occupant_first_name || '',
        actual_occupant_last_name: vendor.actual_occupant_last_name || '',
        actual_occupant_username: vendor.actual_occupant_username || '',
        actual_occupant_phone: vendor.actual_occupant_phone || '',
        actual_occupant_password_hash: vendor.actual_occupant_password_hash || '',
      });
    } else {
      setShowActualOccupant(false);
    }
    setIsEditing(false);
    setErrors({});
  }, [vendor, isOpen]);

  // Clear actual occupant fields when checkbox is unchecked
  useEffect(() => {
    if (!showActualOccupant) {
      setFormData(prev => ({
        ...prev,
        actual_occupant_first_name: '',
        actual_occupant_last_name: '',
        actual_occupant_username: '',
        actual_occupant_phone: '',
        actual_occupant_password_hash: '',
      }));
    }
  }, [showActualOccupant]);

  // Auto-generate actual occupant username when their names change
  useEffect(() => {
    const generateActualOccupantUsername = async () => {
      if (formData.actual_occupant_first_name && formData.actual_occupant_last_name && showActualOccupant) {
        const username = await generateUniqueActualOccupantUsername(
          formData.actual_occupant_first_name,
          formData.actual_occupant_last_name,
          formData.username // Pass main vendor username to avoid conflicts
        );
        setFormData(prev => ({ ...prev, actual_occupant_username: username }));
      }
    };

    generateActualOccupantUsername();
  }, [formData.actual_occupant_first_name, formData.actual_occupant_last_name, formData.username, showActualOccupant]);

  const capitalizeName = (name: string): string => {
    return name.split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const generateUsername = (firstName: string, lastName: string): string => {
    // Split first name by spaces and get first letter of each word
    const firstNameParts = firstName.trim().split(/\s+/);
    const firstNameInitials = firstNameParts.map(part => part.charAt(0)).join('');

    // Combine initials + last name, convert to lowercase, remove non-alphanumeric
    return (firstNameInitials + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const generateUniqueActualOccupantUsername = async (firstName: string, lastName: string, mainVendorUsername: string): Promise<string> => {
    const baseUsername = generateUsername(firstName, lastName);

    // Function to check if username is available (not in database and not same as main vendor)
    const isUsernameAvailable = async (usernameToCheck: string): Promise<boolean> => {
      // First check if it conflicts with the main vendor username
      if (usernameToCheck === mainVendorUsername) {
        return false;
      }

      // Then check database for both username and actual_occupant_username fields
      const { data: existingUsers, error } = await supabase
        .from('vendor_profiles')
        .select('username, actual_occupant_username')
        .or(`username.eq.${usernameToCheck},actual_occupant_username.eq.${usernameToCheck}`);

      if (error) {
        console.error('Error checking username availability:', error);
        return false; // Assume not available if error
      }

      return !existingUsers || existingUsers.length === 0;
    };

    // Check if base username is available
    if (await isUsernameAvailable(baseUsername)) {
      return baseUsername;
    }

    // If base username is not available, try with numbers
    let counter = 1;
    while (counter <= 99) { // Limit to prevent infinite loop
      const numberedUsername = `${baseUsername}${counter}`;

      if (await isUsernameAvailable(numberedUsername)) {
        return numberedUsername;
      }

      counter++;
    }

    // Fallback if all numbers 1-99 are taken
    return `${baseUsername}${Date.now()}`;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields based on database schema (NOT NULL columns)
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required';
    if (!formData.business_type.trim()) newErrors.business_type = 'Business type is required';

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('handleSave called');
    console.log('Current formData:', formData);

    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    setSaving(true);
    try {
      console.log('Starting save process...');

      // Prepare updated vendor data with proper null handling
      if (!vendor) {
        throw new Error('Vendor data is required for update');
      }

      let updatedVendorData = { ...vendor };

      // Update only the fields that are in formData, ensuring required fields are not null/empty
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== undefined) {
          // For required fields, ensure they're not empty strings
          if (['first_name', 'last_name', 'username', 'phone_number', 'business_name', 'business_type'].includes(key)) {
            updatedVendorData[key as keyof typeof updatedVendorData] = value.trim() || vendor[key as keyof typeof vendor] || '';
          } else {
            // For optional fields, convert empty strings to undefined for proper database storage
            (updatedVendorData as any)[key] = value.trim() === '' ? undefined : value.trim();
          }
        }
      });

      // Generate and hash actual occupant password if actual occupant exists and has username
      if (showActualOccupant && formData.actual_occupant_username && formData.actual_occupant_username.trim()) {
        const assignedStall = getAssignedStall();
        if (assignedStall) {
          console.log('Generating actual occupant password for stall:', assignedStall.stall_number);
          // Generate actual occupant password: username + lowercase stall number (remove hyphen)
          const actualOccupantGeneratedPassword = `${formData.actual_occupant_username.trim()}${assignedStall.stall_number.toLowerCase().replace('-', '')}`;
          const actualOccupantHashedPassword = await hashPassword(actualOccupantGeneratedPassword);
          updatedVendorData.actual_occupant_password_hash = actualOccupantHashedPassword;
        }
      } else {
        // Clear actual occupant data if not showing or no username
        updatedVendorData.actual_occupant_first_name = undefined;
        updatedVendorData.actual_occupant_last_name = undefined;
        updatedVendorData.actual_occupant_username = undefined;
        updatedVendorData.actual_occupant_phone = undefined;
        updatedVendorData.actual_occupant_password_hash = undefined;
      }

      console.log('Prepared data for save:', updatedVendorData);
      await onSave(updatedVendorData);
      console.log('onSave completed successfully');

      // Close the modal and exit edit mode
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error saving vendor:', error);
      alert(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const getAssignedStall = () => {
    return stalls.find(stall => stall.vendor_profile_id === vendor?.id) || null;
  };

  const getSection = () => {
    const assignedStall = getAssignedStall();
    if (assignedStall) {
      return sections.find(section => section.id === assignedStall.section_id);
    }
    return vendor?.market_section_id ? sections.find(section => section.id === vendor.market_section_id) : null;
  };

  if (!isOpen || !vendor) return null;

  const assignedStall = getAssignedStall();
  const section = getSection();

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border-0 w-11/12 max-w-6xl shadow-2xl rounded-2xl bg-white">
        <div className="">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Vendor Details' : 'Vendor Details'}
                </h3>
                <p className="text-lg text-gray-600 mt-1">
                  {vendor.first_name} {vendor.last_name} - {vendor.username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Personal & Contact Information */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-green-800">Personal Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 ${errors.first_name ? 'border-red-400' : 'border-gray-300'}`}
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 ${errors.last_name ? 'border-red-400' : 'border-gray-300'}`}
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Initial</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.middle_name}
                        onChange={(e) => setFormData({ ...formData, middle_name: e.target.value.slice(0, 1).toUpperCase() })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 text-center"
                        maxLength={1}
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.middle_name || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 font-mono ${errors.username ? 'border-red-400' : 'border-gray-300'}`}
                      />
                    ) : (
                      <p className="text-lg font-mono font-medium text-gray-900 py-2 bg-gray-50 px-3 rounded">{vendor.username}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-blue-800">Contact Information</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                        placeholder="vendor@example.com"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.email || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 ${errors.phone_number ? 'border-red-400' : 'border-gray-300'}`}
                        placeholder="09XX-XXX-XXXX"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.phone_number || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Address</label>
                    {isEditing ? (
                      <textarea
                        value={formData.complete_address}
                        onChange={(e) => setFormData({ ...formData, complete_address: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                        rows={3}
                        placeholder="Enter complete address"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.complete_address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Business & Stall Information */}
            <div className="space-y-6">
              {/* Business Information */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-orange-800">Business Information</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={formData.business_name}
                          onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 ${errors.business_name ? 'border-red-400' : 'border-gray-300'}`}
                          placeholder="Enter business name"
                        />
                        {errors.business_name && (
                          <p className="text-red-500 text-sm mt-1">{errors.business_name}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.business_name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                    {isEditing ? (
                      <>
                        <select
                          value={formData.business_type}
                          onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 ${errors.business_type ? 'border-red-400' : 'border-gray-300'}`}
                        >
                          <option value="">Select business type</option>
                          <option value="General">General</option>
                          <option value="Food">Food</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Services">Services</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.business_type && (
                          <p className="text-red-500 text-sm mt-1">{errors.business_type}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.business_type || 'General'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    {isEditing ? (
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    ) : (
                      <div className="flex items-center py-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendor.status === 'Active' ? 'bg-green-100 text-green-800' :
                            vendor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              vendor.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                          }`}>
                          {vendor.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Products/Services Description</label>
                    {isEditing ? (
                      <textarea
                        value={formData.products_services_description}
                        onChange={(e) => setFormData({ ...formData, products_services_description: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                        rows={3}
                        placeholder="Describe products or services"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.products_services_description || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stall Assignment */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-purple-800">Stall Assignment</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Stall</label>
                    <p className="text-lg font-medium text-gray-900 py-2">
                      {assignedStall ? assignedStall.stall_number : vendor.stall_number || 'No stall assigned'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                    <p className="text-lg font-medium text-gray-900 py-2">
                      {section ? section.name : 'No section assigned'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Application Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendor.application_status === 'approved' ? 'bg-green-100 text-green-800' :
                        vendor.application_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {vendor.application_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actual Occupant Information Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 00 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-purple-800">Actual Occupant Information</h4>
                  <p className="text-sm text-purple-600">If different from the registered vendor above</p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showActualOccupant}
                  onChange={(e) => setShowActualOccupant(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${showActualOccupant ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${showActualOccupant ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {showActualOccupant ? 'Hide' : 'Show'} Details
                </span>
              </label>
            </div>

            {showActualOccupant && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Actual Occupant First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.actual_occupant_first_name}
                        onChange={(e) => {
                          const capitalizedName = capitalizeName(e.target.value);
                          setFormData({ ...formData, actual_occupant_first_name: capitalizedName });
                        }}
                        className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-white rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200"
                        placeholder="e.g., Maria"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.actual_occupant_first_name}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Leave empty if same as registered vendor</p>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Actual Occupant Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.actual_occupant_last_name}
                        onChange={(e) => {
                          const capitalizedName = capitalizeName(e.target.value);
                          setFormData({ ...formData, actual_occupant_last_name: capitalizedName });
                        }}
                        className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-white rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200"
                        placeholder="e.g., Santos"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.actual_occupant_last_name}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Leave empty if same as registered vendor</p>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Actual Occupant Username
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.actual_occupant_username}
                          onChange={(e) => setFormData({ ...formData, actual_occupant_username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                          className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-gray-50 rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 font-mono"
                          placeholder="Auto-generated from name"
                          readOnly
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg font-mono font-medium text-gray-900 py-2 bg-gray-50 px-3 rounded">{vendor.actual_occupant_username}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generated automatically, unique from vendor username
                    </p>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Actual Occupant Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.actual_occupant_phone}
                        onChange={(e) => {
                          // Allow only numbers, spaces, hyphens, and parentheses
                          const value = e.target.value.replace(/[^0-9\s\-\(\)\+]/g, '');
                          setFormData({ ...formData, actual_occupant_phone: value });
                        }}
                        className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-white rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200"
                        placeholder="e.g., 09123456789"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 py-2">{vendor.actual_occupant_phone}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Contact number for actual occupant</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Metadata */}
          <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">System Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Created:</span> {new Date(vendor.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Last Updated:</span> {new Date(vendor.updated_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Signup Method:</span> {vendor.signup_method || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const AddVendorModal: React.FC<AddVendorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingVendor,
  sections,
  stalls,
  availableStalls,
  setAvailableStalls
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    username: '',
    stall_id: '',
    section_id: '',
    actual_occupant_first_name: '',
    actual_occupant_last_name: '',
    actual_occupant_username: '',
    actual_occupant_phone: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [showActualOccupant, setShowActualOccupant] = useState(false);

  useEffect(() => {
    if (editingVendor) {
      const hasActualOccupantData = !!(
        editingVendor.actual_occupant_first_name ||
        editingVendor.actual_occupant_last_name ||
        editingVendor.actual_occupant_username ||
        editingVendor.actual_occupant_phone
      );
      setShowActualOccupant(hasActualOccupantData);

      setFormData({
        first_name: editingVendor.first_name || '',
        last_name: editingVendor.last_name || '',
        middle_name: editingVendor.middle_name || '',
        username: editingVendor.username || '',
        stall_id: '',
        section_id: '',
        actual_occupant_first_name: editingVendor.actual_occupant_first_name || '',
        actual_occupant_last_name: editingVendor.actual_occupant_last_name || '',
        actual_occupant_username: editingVendor.actual_occupant_username || '',
        actual_occupant_phone: editingVendor.actual_occupant_phone || '',
      });
    } else {
      setShowActualOccupant(false);
      setFormData({
        first_name: '',
        last_name: '',
        middle_name: '',
        username: '',
        stall_id: '',
        section_id: '',
        actual_occupant_first_name: '',
        actual_occupant_last_name: '',
        actual_occupant_username: '',
        actual_occupant_phone: '',
      });
    }
    setErrors({});
  }, [editingVendor, isOpen]);

  // Auto-generate username when first/last name changes
  useEffect(() => {
    const generateAndSetUsername = async () => {
      if (formData.first_name && formData.last_name) {
        const username = await generateUniqueUsername(formData.first_name, formData.last_name);
        setFormData(prev => ({ ...prev, username }));
      }
    };

    generateAndSetUsername();
  }, [formData.first_name, formData.last_name]);

  // Clear actual occupant fields when checkbox is unchecked
  useEffect(() => {
    if (!showActualOccupant) {
      setFormData(prev => ({
        ...prev,
        actual_occupant_first_name: '',
        actual_occupant_last_name: '',
        actual_occupant_username: '',
        actual_occupant_phone: '',
      }));
    }
  }, [showActualOccupant]);

  // Auto-generate actual occupant username when their names change
  useEffect(() => {
    const generateActualOccupantUsername = async () => {
      if (formData.actual_occupant_first_name && formData.actual_occupant_last_name && showActualOccupant) {
        const username = await generateUniqueActualOccupantUsername(
          formData.actual_occupant_first_name,
          formData.actual_occupant_last_name,
          formData.username // Pass main vendor username to avoid conflicts
        );
        setFormData(prev => ({ ...prev, actual_occupant_username: username }));
      }
    };

    generateActualOccupantUsername();
  }, [formData.actual_occupant_first_name, formData.actual_occupant_last_name, formData.username, showActualOccupant]);



  const capitalizeName = (name: string): string => {
    return name.split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const generateUsername = (firstName: string, lastName: string): string => {
    // Split first name by spaces and get first letter of each word
    const firstNameParts = firstName.trim().split(/\s+/);
    const firstNameInitials = firstNameParts.map(part => part.charAt(0)).join('');

    // Combine initials + last name, convert to lowercase, remove non-alphanumeric
    return (firstNameInitials + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const generateUniqueUsername = async (firstName: string, lastName: string): Promise<string> => {
    const baseUsername = generateUsername(firstName, lastName);

    // Check if base username is available
    const { data: existingUsers, error } = await supabase
      .from('vendor_profiles')
      .select('username')
      .eq('username', baseUsername);

    if (error) {
      console.error('Error checking username:', error);
      return baseUsername; // Return base if error checking
    }

    // If no existing user with this username, return it
    if (!existingUsers || existingUsers.length === 0) {
      return baseUsername;
    }

    // If username exists, try with numbers
    let counter = 1;
    while (counter <= 99) { // Limit to prevent infinite loop
      const numberedUsername = `${baseUsername}${counter}`;

      const { data: numberedCheck, error: numberedError } = await supabase
        .from('vendor_profiles')
        .select('username')
        .eq('username', numberedUsername);

      if (numberedError) {
        console.error('Error checking numbered username:', numberedError);
        return numberedUsername; // Return if error checking
      }

      // If this numbered username is available, use it
      if (!numberedCheck || numberedCheck.length === 0) {
        return numberedUsername;
      }

      counter++;
    }

    // Fallback if all numbers 1-99 are taken
    return `${baseUsername}${Date.now()}`;
  };

  const generateUniqueActualOccupantUsername = async (firstName: string, lastName: string, mainVendorUsername: string): Promise<string> => {
    const baseUsername = generateUsername(firstName, lastName);

    // Function to check if username is available (not in database and not same as main vendor)
    const isUsernameAvailable = async (usernameToCheck: string): Promise<boolean> => {
      // First check if it conflicts with the main vendor username
      if (usernameToCheck === mainVendorUsername) {
        return false;
      }

      // Then check database for both username and actual_occupant_username fields
      const { data: existingUsers, error } = await supabase
        .from('vendor_profiles')
        .select('username, actual_occupant_username')
        .or(`username.eq.${usernameToCheck},actual_occupant_username.eq.${usernameToCheck}`);

      if (error) {
        console.error('Error checking username availability:', error);
        return false; // Assume not available if error
      }

      return !existingUsers || existingUsers.length === 0;
    };

    // Check if base username is available
    if (await isUsernameAvailable(baseUsername)) {
      return baseUsername;
    }

    // If base username is not available, try with numbers
    let counter = 1;
    while (counter <= 99) { // Limit to prevent infinite loop
      const numberedUsername = `${baseUsername}${counter}`;

      if (await isUsernameAvailable(numberedUsername)) {
        return numberedUsername;
      }

      counter++;
    }

    // Fallback if all numbers 1-99 are taken
    return `${baseUsername}${Date.now()}`;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.stall_id.trim()) newErrors.stall_id = 'Stall is required';
    if (!formData.section_id.trim()) newErrors.section_id = 'Section is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      const vendorData: Partial<ExistingVendor> & { stall_id?: string; section_id?: string } = {
        ...formData,
        status: 'Active',
        role: 'vendor',
        application_status: 'approved',
        signup_method: 'manual_entry',
      };

      onSave(vendorData);
      onClose();
    } catch (error) {
      console.error('Error saving vendor:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50">
      <div className="relative top-2 mx-auto p-6 border-0 w-11/12 max-w-5xl shadow-2xl rounded-2xl bg-white">
        <div className="">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                </h3>
                <p className="text-lg text-gray-600 mt-1">
                  {editingVendor ? 'Update vendor information and stall assignment' : 'Enter vendor details and assign a market stall'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Information Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-green-800">Personal Information</h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      First Name
                      <span className="text-red-500 ml-1 text-lg">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => {
                      const capitalizedName = capitalizeName(e.target.value);
                      setFormData({ ...formData, first_name: capitalizedName });
                    }}
                    className={`w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${errors.first_name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    placeholder="e.g., Hannah Bea"
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      Last Name
                      <span className="text-red-500 ml-1 text-lg">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => {
                      const capitalizedName = capitalizeName(e.target.value);
                      setFormData({ ...formData, last_name: capitalizedName });
                    }}
                    className={`w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${errors.last_name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    placeholder="e.g., Alcaide"
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.last_name}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Middle Initial
                  </label>
                  <input
                    type="text"
                    value={formData.middle_name}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 1);
                      setFormData({ ...formData, middle_name: value });
                    }}
                    className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-white rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 text-center"
                    maxLength={1}
                    placeholder="M"
                  />
                  <p className="text-sm text-gray-500 mt-2">Optional - First letter only</p>
                </div>
              </div>
            </div>

            {/* Account & Stall Assignment Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-blue-800">Account & Stall Assignment</h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      Username
                      <span className="text-red-500 ml-1 text-lg">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 font-mono transition-all duration-200 ${errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      placeholder="Auto-generated"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  {errors.username ? (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.username}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generated from name automatically
                    </p>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      Section
                      <span className="text-red-500 ml-1 text-lg">*</span>
                    </span>
                  </label>
                  <select
                    value={formData.section_id}
                    onChange={(e) => {
                      setFormData({ ...formData, section_id: e.target.value, stall_id: '' });
                      // Filter stalls by selected section
                      const sectionStalls = stalls.filter(stall => stall.section_id === e.target.value && !stall.vendor_profile_id);
                      setAvailableStalls(sectionStalls);
                    }}
                    className={`w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${errors.section_id ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                  >
                    <option value="" className="text-gray-500">Choose market section...</option>
                    {sections.map((section) => {
                      // Count available stalls in this section
                      const sectionStalls = stalls.filter(stall => stall.section_id === section.id);
                      const availableCount = sectionStalls.filter(stall => !stall.vendor_profile_id).length;

                      // Only show sections that have available stalls
                      if (availableCount === 0) return null;

                      return (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      );
                    }).filter(Boolean)}
                  </select>
                  {errors.section_id && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.section_id}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      Stall
                      <span className="text-red-500 ml-1 text-lg">*</span>
                    </span>
                  </label>
                  <select
                    value={formData.stall_id}
                    onChange={(e) => setFormData({ ...formData, stall_id: e.target.value })}
                    className={`w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${errors.stall_id ? 'border-red-400 bg-red-50' : formData.section_id ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                      }`}
                    disabled={!formData.section_id}
                  >
                    <option value="" className="text-gray-500">
                      {!formData.section_id ? 'Select section first...' : 'Choose available stall...'}
                    </option>
                    {availableStalls.map((stall) => (
                      <option key={stall.id} value={stall.id}>
                        {stall.stall_number} {stall.location_desc && `- ${stall.location_desc}`}
                      </option>
                    ))}
                  </select>
                  {errors.stall_id ? (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.stall_id}
                    </p>
                  ) : !formData.section_id ? (
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Please select a section first
                    </p>
                  ) : availableStalls.length === 0 ? (
                    <p className="text-sm text-amber-600 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      No available stalls in this section
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {availableStalls.length} stalls available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actual Occupant Information Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 00 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-purple-800">Actual Occupant Information</h4>
                    <p className="text-sm text-purple-600">If different from the registered vendor above</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showActualOccupant}
                    onChange={(e) => setShowActualOccupant(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${showActualOccupant ? 'bg-purple-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${showActualOccupant ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {showActualOccupant ? 'Hide' : 'Show'} Details
                  </span>
                </label>
              </div>

              {showActualOccupant && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Actual Occupant First Name
                      </label>
                      <input
                        type="text"
                        value={formData.actual_occupant_first_name}
                        onChange={(e) => {
                          const capitalizedName = capitalizeName(e.target.value);
                          setFormData({ ...formData, actual_occupant_first_name: capitalizedName });
                        }}
                        className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-white rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200"
                        placeholder="e.g., Maria"
                      />
                      <p className="text-sm text-gray-500 mt-1">Leave empty if same as registered vendor</p>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Actual Occupant Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.actual_occupant_last_name}
                        onChange={(e) => {
                          const capitalizedName = capitalizeName(e.target.value);
                          setFormData({ ...formData, actual_occupant_last_name: capitalizedName });
                        }}
                        className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-white rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200"
                        placeholder="e.g., Santos"
                      />
                      <p className="text-sm text-gray-500 mt-1">Leave empty if same as registered vendor</p>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Actual Occupant Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.actual_occupant_username}
                          onChange={(e) => setFormData({ ...formData, actual_occupant_username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                          className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-gray-50 rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 font-mono"
                          placeholder="Auto-generated from name"
                          readOnly
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Generated automatically, unique from vendor username
                      </p>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Actual Occupant Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.actual_occupant_phone}
                        onChange={(e) => {
                          // Allow only numbers, spaces, hyphens, and parentheses
                          const value = e.target.value.replace(/[^0-9\s\-\(\)\+]/g, '');
                          setFormData({ ...formData, actual_occupant_phone: value });
                        }}
                        className="w-full px-3 py-3 text-base border-2 border-gray-300 bg-white rounded-xl focus:ring-3 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200"
                        placeholder="e.g., 09123456789"
                      />
                      <p className="text-sm text-gray-500 mt-1">Contact number for actual occupant</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center space-x-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 text-lg font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors border-2 border-gray-300 flex items-center gap-2 min-w-[140px] justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg border-2 border-blue-600 flex items-center gap-2 min-w-[160px] justify-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface Section {
  id: string;
  name: string;
  code: string;
  capacity: number;
  stalls_count: number;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Stall {
  id: string;
  stall_number: string;
  section_id: string;
  status?: string;
  location_desc?: string | null;
  vendor_profile_id?: string | null;
}

// Simple password hashing function using built-in crypto
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export default function ExistingVendors() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<ExistingVendor[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [availableStalls, setAvailableStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<ExistingVendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'stall' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Credentials modal state
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentialsData, setCredentialsData] = useState({
    username: '',
    password: '',
    vendorName: '',
    stallNumber: '',
    isSuccess: false,
    message: '',
    operationType: 'add' as 'add' | 'delete',
    actualOccupantName: '',
    actualOccupantUsername: '',
    actualOccupantPassword: '',
    actualOccupantPhone: ''
  });

  // Vendor details modal state
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<ExistingVendor | null>(null);

  useEffect(() => {
    fetchVendors();
    fetchSections();
    fetchStalls();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vendors:', error);
        return;
      }

      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('market_sections')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching sections:', error);
        return;
      }

      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchStalls = async () => {
    try {
      const { data, error } = await supabase
        .from('stalls')
        .select('*')
        .order('stall_number', { ascending: true });

      if (error) {
        console.error('Error fetching stalls:', error);
        return;
      }

      const stallsData = data as Stall[];
      setStalls(stallsData || []);
      // Filter available stalls (not assigned to any vendor)
      const available = (stallsData || []).filter(stall => !stall.vendor_profile_id);
      setAvailableStalls(available);
    } catch (error) {
      console.error('Error fetching stalls:', error);
    }
  };

  const handleDeleteVendor = async (vendor: ExistingVendor) => {
    const confirmMessage = `Delete Vendor: ${vendor.first_name} ${vendor.last_name}\n\nThis will:\n• Remove the vendor from the system\n• Free up their assigned stall (if any)\n• This action cannot be undone\n\nAre you sure you want to continue?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeletingId(vendor.id);
    try {
      // First, find and free up the stall if it exists
      const assignedStall = stalls.find(stall => stall.vendor_profile_id === vendor.id);

      if (assignedStall) {
        console.log('Freeing up stall:', assignedStall.stall_number);
        const { error: stallError } = await (supabase as any)
          .from('stalls')
          .update({
            vendor_profile_id: null,
            status: 'vacant'
          })
          .eq('id', assignedStall.id);

        if (stallError) {
          console.error('Error freeing up stall:', stallError);
          alert('Failed to free up the stall. Please check manually.');
        }
      }

      // Delete the vendor profile
      const { error: deleteError } = await supabase
        .from('vendor_profiles')
        .delete()
        .eq('id', vendor.id);

      if (deleteError) {
        console.error('Error deleting vendor:', deleteError);
        alert(`Failed to delete vendor: ${deleteError.message}`);
        return;
      }

      // Refresh the data
      await fetchVendors();
      await fetchStalls();

      const stallMessage = assignedStall ? ` Stall ${assignedStall.stall_number} is now available.` : '';

      // Show success message in credentials modal format for consistency
      setCredentialsData({
        username: '',
        password: '',
        vendorName: `${vendor.first_name} ${vendor.last_name}`,
        stallNumber: assignedStall?.stall_number || '',
        isSuccess: true,
        message: `Vendor has been successfully removed from the system.${stallMessage ? ' ' + stallMessage : ''}`,
        operationType: 'delete',
        actualOccupantName: '',
        actualOccupantUsername: '',
        actualOccupantPassword: '',
        actualOccupantPhone: ''
      });
      setShowCredentialsModal(true);

    } catch (error) {
      console.error('Error deleting vendor:', error);
      setCredentialsData({
        username: '',
        password: '',
        vendorName: `${vendor.first_name} ${vendor.last_name}`,
        stallNumber: '',
        isSuccess: false,
        message: 'Failed to delete vendor. Please try again or contact system administrator.',
        operationType: 'delete',
        actualOccupantName: '',
        actualOccupantUsername: '',
        actualOccupantPassword: '',
        actualOccupantPhone: ''
      });
      setShowCredentialsModal(true);
    } finally {
      setDeletingId(null);
    }
  };

  const handleVendorEdit = async (vendorData: Partial<ExistingVendor>) => {
    try {
      console.log('handleVendorEdit called with:', vendorData);
      console.log('Current user:', user);

      if (!user) {
        const errorMsg = 'You must be logged in to update vendors.';
        console.error(errorMsg);
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      if (!vendorData.id) {
        const errorMsg = 'Vendor ID is required for updates.';
        console.error(errorMsg);
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      // Prepare update data by removing fields that shouldn't be updated
      const {
        id,
        created_at,
        updated_at,
        ...updateData
      } = vendorData;

      // Ensure required fields are properly handled
      const cleanUpdateData = {
        ...updateData,
        // Ensure required string fields are not null
        business_name: updateData.business_name || '',
        business_type: updateData.business_type || '',
        username: updateData.username || '',
        first_name: updateData.first_name || '',
        last_name: updateData.last_name || '',
        phone_number: updateData.phone_number || '',
        // Set updated_at to current timestamp
        updated_at: new Date().toISOString()
      };

      console.log('Clean update data:', cleanUpdateData);
      console.log('Updating vendor with ID:', vendorData.id);

      // Use the authenticated client with proper typing
      const { data, error } = await (supabase as any)
        .from('vendor_profiles')
        .update(cleanUpdateData)
        .eq('id', vendorData.id)
        .select();

      if (error) {
        console.error('Database error updating vendor:', error);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);

        let errorMsg = `Database error: ${error.message}`;
        if (error.code === '42501') {
          errorMsg = 'Permission denied. You may not have the required permissions to update vendor profiles.';
        } else if (error.code === '23502') {
          errorMsg = `Required field missing: ${error.message}`;
        }

        alert(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Database update result:', data);
      console.log('Vendor updated successfully, refreshing data...');

      // Refresh vendor data
      await fetchVendors();

      console.log('Vendor update process completed successfully');

      // Show success message
      alert('Vendor updated successfully!');

    } catch (error) {
      console.error('Error in handleVendorEdit:', error);

      // Re-throw the error so it can be caught by handleSave
      throw error;
    }
  };

  const handleVendorRowClick = (vendor: ExistingVendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetailsModal(true);
  };

  const handleAddVendor = async (vendorData: Partial<ExistingVendor> & { stall_id?: string; section_id?: string }) => {
    try {
      // Check if user is authenticated
      if (!user) {
        alert('You must be logged in to add vendors.');
        return;
      }

      // Generate passwords for both vendor and actual occupant (we need stall info for this)
      let generatedPassword = '';
      let hashedPassword = '';
      let actualOccupantGeneratedPassword = '';
      let actualOccupantHashedPassword = '';

      if (vendorData.stall_id) {
        const selectedStall = stalls.find(stall => stall.id === vendorData.stall_id);
        if (selectedStall) {
          // Generate vendor password: username + lowercase stall number (remove hyphen)
          generatedPassword = `${vendorData.username}${selectedStall.stall_number.toLowerCase().replace('-', '')}`;
          hashedPassword = await hashPassword(generatedPassword);

          // Generate and hash actual occupant password if they exist
          if (vendorData.actual_occupant_username) {
            actualOccupantGeneratedPassword = `${vendorData.actual_occupant_username}${selectedStall.stall_number.toLowerCase().replace('-', '')}`;
            actualOccupantHashedPassword = await hashPassword(actualOccupantGeneratedPassword);
          }
        }
      }

      // Create the vendor profile with all required fields
      // auth_user_id will be null for manual entries until vendor sets up their account
      const vendorProfileInsert: any = {
        auth_user_id: null, // Will be linked when vendor sets up their account
        first_name: vendorData.first_name || '',
        last_name: vendorData.last_name || '',
        middle_name: vendorData.middle_name || null,
        username: vendorData.username || '',
        email: null, // Vendor will add email later
        phone_number: '', // Required field, empty for now
        business_name: '', // Will be filled by vendor in mobile app
        business_type: 'General', // Required field, vendor will update later
        status: 'Pending', // Match default from schema
        role: 'vendor',
        application_status: 'pending', // Match default from schema
        signup_method: 'manual_entry',
        market_section_id: vendorData.section_id || null,
        password_hash: hashedPassword || null, // Store hashed password
        // Include actual occupant data if provided
        actual_occupant_first_name: vendorData.actual_occupant_first_name || null,
        actual_occupant_last_name: vendorData.actual_occupant_last_name || null,
        actual_occupant_username: vendorData.actual_occupant_username || null,
        actual_occupant_phone: vendorData.actual_occupant_phone || null,
        actual_occupant_password_hash: actualOccupantHashedPassword || null // Store hashed password for actual occupant
      };

      // Try direct insert first (should work with updated RLS policies)
      const { data: vendorProfileData, error: vendorError } = await supabase
        .from('vendor_profiles')
        .insert(vendorProfileInsert)
        .select()
        .single();

      if (vendorError) {
        console.error('Error adding vendor:', vendorError);
        console.error('Insert data:', vendorProfileInsert);
        console.error('Current user:', user);
        console.error('Vendor data:', vendorData);

        if (vendorError.code === '23502') {
          alert(`Database constraint error: ${vendorError.message}. Please ensure all required fields are filled.`);
        } else if (vendorError.code === '42501') {
          alert('Permission denied. Please check admin permissions.');
        } else {
          alert(`Failed to add vendor: ${vendorError.message || 'Unknown error'}`);
        }
        return;
      }

      if (vendorProfileData) {
        let stallAssignmentMessage = generatedPassword ?
          `Vendor added successfully!\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\n\nPlease share these credentials with the vendor.` :
          `Vendor added successfully!\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: [Will be set when stall is assigned]\n\nNote: Password format is username + stall number (e.g., username + e1)`;

        if (vendorData.stall_id) {
          // Find the selected stall to get its stall_number
          const selectedStall = stalls.find(stall => stall.id === vendorData.stall_id);

          if (selectedStall) {
            // Update the vendor profile with stall_number and section
            const { error: updateError } = await (supabase as any)
              .from('vendor_profiles')
              .update({
                stall_number: selectedStall.stall_number,
                market_section_id: selectedStall.section_id
              })
              .eq('id', (vendorProfileData as any).id);

            if (updateError) {
              console.error('Error assigning stall number:', updateError);
              stallAssignmentMessage = generatedPassword ?
                `Vendor created but failed to assign stall number.\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\n\nPlease share these credentials with the vendor.` :
                `Vendor created but failed to assign stall number.\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: [Will be set when stall is manually assigned]\n\nNote: Password format is username + stall number (e.g., username + e1)`;
            } else {
              // Try to update the stalls table to mark it as occupied
              console.log('Attempting to update stall:', {
                stallId: vendorData.stall_id,
                vendorId: (vendorProfileData as any).id,
                stallNumber: selectedStall.stall_number
              });

              const { error: stallError } = await (supabase as any)
                .from('stalls')
                .update({
                  vendor_profile_id: (vendorProfileData as any).id,
                  status: 'occupied'
                })
                .eq('id', vendorData.stall_id);

              if (stallError) {
                console.error('Error updating stall status:', stallError);
                console.error('Stall update details:', {
                  stallId: vendorData.stall_id,
                  vendorId: (vendorProfileData as any).id,
                  error: stallError
                });
                stallAssignmentMessage = `Vendor and stall number assigned, but stall status update failed. Please check stalls table manually.\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\n\nPlease share these credentials with the vendor.`;
              } else {
                console.log('Successfully assigned vendor to stall:', {
                  vendorId: (vendorProfileData as any).id,
                  stallId: vendorData.stall_id,
                  stallNumber: selectedStall.stall_number
                });

                stallAssignmentMessage = `Vendor added and stall assigned successfully!\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\n\nPlease share these credentials with the vendor. The password is securely hashed in the database.`;
              }
            }
          }
        }

        // Refresh all data to ensure consistency
        await fetchVendors();
        await fetchStalls();

        // Show credentials modal instead of alert
        const actualOccupantFullName = vendorData.actual_occupant_first_name && vendorData.actual_occupant_last_name
          ? `${vendorData.actual_occupant_first_name} ${vendorData.actual_occupant_last_name}`
          : '';

        setCredentialsData({
          username: vendorData.username || '',
          password: generatedPassword,
          vendorName: `${vendorData.first_name} ${vendorData.last_name}`,
          stallNumber: stalls.find(stall => stall.id === vendorData.stall_id)?.stall_number || '',
          isSuccess: !stallAssignmentMessage.includes('failed'),
          message: stallAssignmentMessage.split('\n\n')[0], // Get the main message without credentials
          operationType: 'add',
          actualOccupantName: actualOccupantFullName,
          actualOccupantUsername: vendorData.actual_occupant_username || '',
          actualOccupantPassword: actualOccupantGeneratedPassword,
          actualOccupantPhone: vendorData.actual_occupant_phone || ''
        });
        setShowCredentialsModal(true);
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor. Please try again.');
    }
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedVendors = React.useMemo(() => {
    let filtered = vendors.filter(vendor => {
      const matchesSearch = searchTerm === '' ||
        vendor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.stall_number?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        vendor.status?.toLowerCase() === statusFilter.toLowerCase();

      const assignedStall = stalls.find(stall => stall.vendor_profile_id === vendor.id);
      const vendorSectionId = assignedStall?.section_id || vendor.market_section_id;
      const matchesSection = sectionFilter === 'all' || vendorSectionId === sectionFilter;

      return matchesSearch && matchesStatus && matchesSection;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'stall':
          const aStall = stalls.find(stall => stall.vendor_profile_id === a.id);
          const bStall = stalls.find(stall => stall.vendor_profile_id === b.id);
          aValue = aStall?.stall_number || a.stall_number || 'zzz';
          bValue = bStall?.stall_number || b.stall_number || 'zzz';
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = '';
          bValue = '';
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [vendors, searchTerm, statusFilter, sectionFilter, sortBy, sortOrder, stalls]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredAndSortedVendors.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = React.useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter(v => v.status?.toLowerCase() === 'active').length;
    const withStalls = vendors.filter(v => {
      const assignedStall = stalls.find(stall => stall.vendor_profile_id === v.id);
      return assignedStall || v.stall_number;
    }).length;
    const pending = vendors.filter(v => v.status?.toLowerCase() === 'pending').length;

    return { total, active, pending, withStalls, withoutStalls: total - withStalls };
  }, [vendors, stalls]);

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSectionFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header with Statistics */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vendor Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage current vendor accounts, stall assignments, and credentials
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Vendor
            </span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3 3 3 0 013 3v2a3 3 0 01-3 3zm8-10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Vendors</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Vendors</dt>
                  <dd className="text-lg font-medium text-green-600">{stats.active}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">With Stalls</dt>
                  <dd className="text-lg font-medium text-blue-600">{stats.withStalls}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-yellow-600">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filtering */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Vendors
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by name, username, or stall..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label htmlFor="sectionFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              id="sectionFilter"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Sections</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters & Clear */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Filters active:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {statusFilter}
              </span>
            )}
            {sectionFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Section: {sections.find(s => s.id === sectionFilter)?.name}
              </span>
            )}
            {!searchTerm && statusFilter === 'all' && sectionFilter === 'all' && (
              <span className="text-gray-500">
                No active filters
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Results Summary and Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{paginatedVendors.length}</span> of{' '}
            <span className="font-medium">{filteredAndSortedVendors.length}</span> vendors
            {filteredAndSortedVendors.length !== vendors.length && (
              <span className="text-gray-500"> (filtered from {vendors.length})</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as typeof sortBy)}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="name">Name</option>
            <option value="stall">Stall Number</option>
            <option value="created_at">Date Added</option>
          </select>
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-gray-400 hover:text-gray-500"
          >
            {sortOrder === 'asc' ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Vendors Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading vendors...
                </div>
              </div>
            ) : filteredAndSortedVendors.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3 3 3 0 013 3v2a3 3 0 01-3 3zm8-10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' || sectionFilter !== 'all'
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by adding your first vendor.'}
                </p>
                {(searchTerm || statusFilter !== 'all' || sectionFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-300 shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        <button
                          type="button"
                          onClick={() => handleSort('name')}
                          className="group inline-flex items-center hover:text-gray-700"
                        >
                          Vendor
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-500">
                            {sortBy === 'name' ? (
                              sortOrder === 'asc' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )
                            ) : (
                              <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                              </svg>
                            )}
                          </span>
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Username
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleSort('stall')}
                          className="group inline-flex items-center hover:text-gray-700"
                        >
                          Stall
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-500">
                            {sortBy === 'stall' ? (
                              sortOrder === 'asc' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )
                            ) : (
                              <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                              </svg>
                            )}
                          </span>
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Section & Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedVendors.map((vendor) => {
                      const assignedStall = stalls.find(stall => stall.vendor_profile_id === vendor.id);
                      const stallNumber = assignedStall?.stall_number || vendor.stall_number;
                      const sectionId = assignedStall?.section_id || vendor.market_section_id;
                      const section = sections.find(s => s.id === sectionId);
                      const isDeleting = deletingId === vendor.id;

                      return (
                        <tr
                          key={vendor.id}
                          className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                          onClick={() => handleVendorRowClick(vendor)}
                        >
                          <td className="py-4 pl-4 pr-3 text-sm sm:pl-0 w-64">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="font-medium text-indigo-700 text-sm">
                                  {vendor.first_name?.charAt(0)}{vendor.last_name?.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4 min-w-0 flex-1">
                                <div className="font-medium text-gray-900 truncate">
                                  {vendor.first_name} {vendor.middle_name && `${vendor.middle_name}.`} {vendor.last_name}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">{vendor.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm">
                            <div className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">
                              {vendor.username}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm">
                            {stallNumber ? (
                              <div className="flex items-center">
                                <div className="h-6 w-8 flex-shrink-0 rounded bg-blue-100 flex items-center justify-center mr-2">
                                  <span className="font-medium text-blue-700 text-xs">{stallNumber}</span>
                                </div>
                                <span className="text-gray-600 text-xs">{assignedStall?.location_desc || 'No description'}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No stall assigned</span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm">
                            <div className="space-y-1">
                              <div className="text-gray-900 text-xs">
                                {section?.name || 'No section'}
                              </div>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${vendor.status?.toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : vendor.status?.toLowerCase() === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                                }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${vendor.status?.toLowerCase() === 'active'
                                  ? 'bg-green-600'
                                  : vendor.status?.toLowerCase() === 'pending'
                                    ? 'bg-yellow-600'
                                    : 'bg-red-600'
                                  } mr-1.5`}></span>
                                {vendor.status || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              type="button"
                              onClick={() => handleDeleteVendor(vendor)}
                              disabled={isDeleting}
                              className={`inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed ${isDeleting ? 'cursor-wait' : ''
                                }`}
                              title="Delete vendor"
                            >
                              {isDeleting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredAndSortedVendors.length)}</span> of{' '}
                          <span className="font-medium">{filteredAndSortedVendors.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                                    ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (page === 2 || page === totalPages - 1) {
                              return (
                                <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}

                          <button
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingVendor(null);
        }}
        onSave={handleAddVendor}
        editingVendor={editingVendor}
        sections={sections}
        stalls={stalls}
        availableStalls={availableStalls}
        setAvailableStalls={setAvailableStalls}
      />

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        username={credentialsData.username}
        password={credentialsData.password}
        vendorName={credentialsData.vendorName}
        stallNumber={credentialsData.stallNumber}
        isSuccess={credentialsData.isSuccess}
        message={credentialsData.message}
        operationType={credentialsData.operationType}
        actualOccupantName={credentialsData.actualOccupantName}
        actualOccupantUsername={credentialsData.actualOccupantUsername}
        actualOccupantPassword={credentialsData.actualOccupantPassword}
        actualOccupantPhone={credentialsData.actualOccupantPhone}
      />

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        isOpen={showVendorDetailsModal}
        onClose={() => {
          setShowVendorDetailsModal(false);
          setSelectedVendor(null);
        }}
        vendor={selectedVendor}
        onSave={handleVendorEdit}
        sections={sections}
        stalls={stalls}
      />
    </div>
  );
}