import React, { useState, useEffect, Fragment } from 'react';
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
  phone_number?: string;
}

interface VendorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: ExistingVendor | null;
  onSave: (vendor: Partial<ExistingVendor>) => void;
  sections: Section[];
  stalls: Stall[];
  setAlertModal?: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
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
  actualOccupantPhone,
  phone_number
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

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-mono font-bold bg-gray-50 px-4 py-2 rounded-lg border-2 flex-1 text-gray-900">
                        +63 {phone_number && phone_number.startsWith('9') ? phone_number : phone_number ? '9' + phone_number : ''}
                      </p>
                    </div>
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

// Alert Modal Component
const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type
}) => {
  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'success':
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.194-.833-2.964 0L3.732 16.5C2.962 17.333 3.924 19 5.464 19z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.194-.833-2.964 0L3.732 16.5C2.962 17.333 3.924 19 5.464 19z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getBgColorByType = () => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-yellow-50';
      case 'info': 
      default: return 'bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className={`${getBgColorByType()} p-4 rounded-t-md -mt-5 -mx-5 mb-4`}>
          {getIconByType()}
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mt-3">{title}</h3>
        </div>
        <div className="mt-2 px-7 py-3">
          <div className="text-sm text-gray-500 text-center">
            {message}
          </div>
        </div>
        <div className="items-center px-4 py-3 flex justify-center">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
              ${type === 'success' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 
                type === 'error' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' :
                type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500' :
                'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'success':
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.194-.833-2.964 0L3.732 16.5C2.962 17.333 3.924 19 5.464 19z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.194-.833-2.964 0L3.732 16.5C2.962 17.333 3.924 19 5.464 19z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getBgColorByType = () => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-yellow-50';
      case 'info': 
      default: return 'bg-blue-50';
    }
  };

  const getButtonColorByType = (isConfirm: boolean) => {
    if (!isConfirm) return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    
    switch (type) {
      case 'success': return 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white';
      case 'error': return 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white';
      case 'info': 
      default: return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className={`${getBgColorByType()} p-4 rounded-t-md -mt-5 -mx-5 mb-4`}>
          {getIconByType()}
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mt-3">{title}</h3>
        </div>
        <div className="mt-2 px-7 py-3">
          <div className="text-sm text-gray-500 whitespace-pre-line">
            {message}
          </div>
        </div>
        <div className="items-center px-4 py-3 flex justify-center space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColorByType(false)}`}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColorByType(true)}`}
          >
            {confirmText}
          </button>
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
  stalls,
  setAlertModal
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
      
      // Remove the 9 prefix from phone numbers when loading for editing (since 9 is displayed separately)
      const phoneWithout9Prefix = vendor.phone_number && vendor.phone_number.startsWith('9')
        ? vendor.phone_number.substring(1)
        : vendor.phone_number || '';
        
      const actualOccupantPhoneWithout9Prefix = vendor.actual_occupant_phone && vendor.actual_occupant_phone.startsWith('9')
        ? vendor.actual_occupant_phone.substring(1)
        : vendor.actual_occupant_phone || '';
      
      setFormData({
        first_name: vendor.first_name || '',
        last_name: vendor.last_name || '',
        middle_name: vendor.middle_name || '',
        username: vendor.username || '',
        email: vendor.email || '',
        phone_number: phoneWithout9Prefix,
        business_name: vendor.business_name || '',
        status: vendor.status || '',
        complete_address: vendor.complete_address || '',
        products_services_description: vendor.products_services_description || '',
        actual_occupant_first_name: vendor.actual_occupant_first_name || '',
        actual_occupant_last_name: vendor.actual_occupant_last_name || '',
        actual_occupant_username: vendor.actual_occupant_username || '',
        actual_occupant_phone: actualOccupantPhoneWithout9Prefix,
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
          // Handle phone numbers to ensure '9' prefix
          if (key === 'phone_number') {
            const formattedPhone = value.trim() ? '9' + value.trim() : value.trim();
            updatedVendorData[key as keyof typeof updatedVendorData] = formattedPhone || vendor[key as keyof typeof vendor] || '';
          } 
          // Handle actual occupant phone to ensure '9' prefix
          else if (key === 'actual_occupant_phone') {
            const formattedPhone = value.trim() ? '9' + value.trim() : value.trim();
            (updatedVendorData as any)[key] = value.trim() === '' ? undefined : formattedPhone;
          }
          // For required fields, ensure they're not empty strings
          else if (['first_name', 'last_name', 'username', 'business_name'].includes(key)) {
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
      setAlertModal({
        isOpen: true,
        title: 'Save Failed',
        message: `Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Vendor Details' : 'Vendor Details'}
                </h3>
                <p className="text-indigo-100 mt-1">
                  {vendor.first_name} {vendor.last_name} • {vendor.username}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex justify-end">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Details
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(100vh-280px)]">
          <div className="space-y-5">
              {/* Personal Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                  <div className="bg-indigo-50 rounded-lg p-2.5 mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">{vendor.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">{vendor.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Middle Initial</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.middle_name}
                        onChange={(e) => setFormData({ ...formData, middle_name: e.target.value.slice(0, 1).toUpperCase() })}
                        className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center transition-all"
                        maxLength={1}
                        placeholder="M"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">{vendor.middle_name || '—'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                        placeholder="username"
                      />
                    ) : (
                      <p className="text-sm font-mono font-medium text-gray-900 py-2.5 bg-gray-50 px-3 rounded border border-gray-200">{vendor.username}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                  <div className="bg-indigo-50 rounded-lg p-2.5 mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="vendor@example.com"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">{vendor.email || '—'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Phone Number</label>
                    {isEditing ? (
                      <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                        <div className="flex items-center bg-gray-50 px-3 border-r border-gray-300">
                          <span className="text-sm font-medium text-gray-600">+63</span>
                        </div>
                        <div className="flex items-center px-2 bg-gray-50 border-r border-gray-300">
                          <span className="text-sm font-medium text-gray-700">9</span>
                        </div>
                        <input
                          type="tel"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          className={`flex-grow px-3 py-2.5 text-sm border-0 focus:ring-0 focus:outline-none ${errors.phone_number ? 'bg-red-50' : 'bg-white'}`}
                          placeholder="XXXXXXXX"
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">
                        {vendor.phone_number ? `+63 9${vendor.phone_number}` : '—'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Complete Address</label>
                    {isEditing ? (
                      <textarea
                        value={formData.complete_address}
                        onChange={(e) => setFormData({ ...formData, complete_address: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                        rows={3}
                        placeholder="Enter complete address"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5 whitespace-pre-wrap">{vendor.complete_address || '—'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Business Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                  <div className="bg-indigo-50 rounded-lg p-2.5 mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Business Information</h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Business Name</label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={formData.business_name}
                          onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.business_name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                          placeholder="Enter business name"
                        />
                        {errors.business_name && (
                          <p className="text-red-600 text-xs mt-1.5 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.business_name}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">{vendor.business_name || '—'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Status</label>
                    {isEditing ? (
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    ) : (
                      <div className="py-2.5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          vendor.status === 'Active' ? 'bg-green-100 text-green-800' :
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
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Products/Services Description</label>
                    {isEditing ? (
                      <textarea
                        value={formData.products_services_description}
                        onChange={(e) => setFormData({ ...formData, products_services_description: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                        rows={3}
                        placeholder="Describe products or services"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5 whitespace-pre-wrap">{vendor.products_services_description || '—'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stall Assignment */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                  <div className="bg-indigo-50 rounded-lg p-2.5 mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Stall Assignment</h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Assigned Stall</label>
                    <p className="text-sm font-medium text-gray-900 py-2.5 bg-gray-50 px-3 rounded border border-gray-200">
                      {assignedStall ? assignedStall.stall_number : vendor.stall_number || '—'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Section</label>
                    <p className="text-sm font-medium text-gray-900 py-2.5">
                      {section ? section.name : '—'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Application Status</label>
                    <div className="py-2.5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.application_status === 'approved' ? 'bg-green-100 text-green-800' :
                        vendor.application_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vendor.application_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

          {/* Actual Occupant Information Section - Only show if editing OR if there's data */}
          {(isEditing || vendor.actual_occupant_first_name || vendor.actual_occupant_last_name) && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">Actual Occupant Information</h4>
                    <p className="text-xs text-gray-600 mt-0.5">If different from the registered vendor</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showActualOccupant}
                    onChange={(e) => setShowActualOccupant(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${showActualOccupant ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${showActualOccupant ? 'translate-x-5' : 'translate-x-0'} shadow-sm`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {showActualOccupant ? 'Hide' : 'Show'}
                </span>
              </label>
            </div>
            </div>

            {showActualOccupant && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
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
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., Maria"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">{vendor.actual_occupant_first_name || '—'}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Leave empty if same as registered vendor</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
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
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., Santos"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">{vendor.actual_occupant_last_name || '—'}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Leave empty if same as registered vendor</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                      Actual Occupant Username
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.actual_occupant_username}
                          onChange={(e) => setFormData({ ...formData, actual_occupant_username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                          className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                          placeholder="Auto-generated from name"
                          readOnly
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-mono font-medium text-gray-900 py-2.5 bg-gray-50 px-3 rounded border border-gray-200">{vendor.actual_occupant_username || '—'}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generated automatically, unique from vendor username
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                      Actual Occupant Phone
                    </label>
                    {isEditing ? (
                      <>
                        <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                          <div className="bg-gray-50 py-2.5 px-3 flex items-center border-r border-gray-300">
                            <span className="text-sm font-medium text-gray-600">+63</span>
                          </div>
                          <div className="bg-gray-50 flex items-center px-2 border-r border-gray-300">
                            <span className="text-sm font-medium text-gray-700">9</span>
                          </div>
                          <input
                            type="text"
                            value={formData.actual_occupant_phone}
                            onChange={(e) => {
                              // Only allow digits and limit to 8 digits (excluding the displayed 9 prefix)
                              const value = e.target.value;
                              const digits = value.replace(/\D/g, '');
                              setFormData({ ...formData, actual_occupant_phone: digits.substring(0, 8) });
                            }}
                            className="flex-grow px-3 py-2.5 text-sm border-0 focus:ring-0 focus:outline-none bg-white"
                            placeholder="12345678"
                            maxLength={8}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">Enter 8 digits after +63 9 (e.g., 12345678)</p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 py-2.5">
                        {vendor.actual_occupant_phone ? 
                          (vendor.actual_occupant_phone.startsWith('9') ? 
                            `+63 ${vendor.actual_occupant_phone}` : 
                            vendor.actual_occupant_phone) : 
                          '—'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
              <div className="bg-indigo-50 rounded-lg p-2 mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">System Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm font-medium text-gray-900">{new Date(vendor.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">{new Date(vendor.updated_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Signup Method</p>
                <p className="text-sm font-medium text-gray-900">{vendor.signup_method || '—'}</p>
              </div>
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
    phone_number: '',
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

      // Remove the 9 prefix from phone numbers when loading for editing (since 9 is displayed separately)
      const phoneWithout9Prefix = editingVendor.phone_number && editingVendor.phone_number.startsWith('9')
        ? editingVendor.phone_number.substring(1)
        : editingVendor.phone_number || '';
        
      const actualOccupantPhoneWithout9Prefix = editingVendor.actual_occupant_phone && editingVendor.actual_occupant_phone.startsWith('9')
        ? editingVendor.actual_occupant_phone.substring(1)
        : editingVendor.actual_occupant_phone || '';

      setFormData({
        first_name: editingVendor.first_name || '',
        last_name: editingVendor.last_name || '',
        middle_name: editingVendor.middle_name || '',
        username: editingVendor.username || '',
        phone_number: phoneWithout9Prefix,
        stall_id: '',
        section_id: '',
        actual_occupant_first_name: editingVendor.actual_occupant_first_name || '',
        actual_occupant_last_name: editingVendor.actual_occupant_last_name || '',
        actual_occupant_username: editingVendor.actual_occupant_username || '',
        actual_occupant_phone: actualOccupantPhoneWithout9Prefix,
      });
    } else {
      setShowActualOccupant(false);
      setFormData({
        first_name: '',
        last_name: '',
        middle_name: '',
        username: '',
        phone_number: '', // Will be displayed after the +63 9 prefix in UI
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

  // Check if base username is available in either username or actual_occupant_username
  const { data: existingUsers, error } = await supabase
    .from('vendor_profiles')
    .select('username, actual_occupant_username')
    .or(`username.eq.${baseUsername},actual_occupant_username.eq.${baseUsername}`);

  if (error) {
    console.error('Error checking username:', error);
    return baseUsername; // Return base if error checking
  }

  // If no existing user with this username in either column, return it
  if (!existingUsers || existingUsers.length === 0) {
    return baseUsername;
  }

  // If username exists, try with numbers
  let counter = 1;
  while (counter <= 99) { // Limit to prevent infinite loop
    const numberedUsername = `${baseUsername}${counter}`;

    const { data: numberedCheck, error: numberedError } = await supabase
      .from('vendor_profiles')
      .select('username, actual_occupant_username')
      .or(`username.eq.${numberedUsername},actual_occupant_username.eq.${numberedUsername}`);

    if (numberedError) {
      console.error('Error checking numbered username:', numberedError);
      return numberedUsername; // Return if error checking
    }

    // If this numbered username is available in both columns, use it
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
    
    // Phone number validation
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (formData.phone_number.length < 8) {
      newErrors.phone_number = 'Phone number must be 8 digits after the +63 9 prefix';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      // Add '9' prefix to phone numbers when saving
      const vendorData: Partial<ExistingVendor> & { stall_id?: string; section_id?: string } = {
        ...formData,
        phone_number: '9' + formData.phone_number, // The 9 is shown separately in UI
        actual_occupant_phone: formData.actual_occupant_phone ? '9' + formData.actual_occupant_phone : formData.actual_occupant_phone, // Add 9 prefix if exists
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

                <div className="lg:col-span-3 mt-2">
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      Phone Number
                      <span className="text-red-500 ml-1 text-lg">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="flex w-full">
                      <div className={`rounded-xl border-2 overflow-hidden flex w-full ${errors.phone_number ? 'border-red-400' : 'border-gray-300'}`}>
                        <div className="bg-white py-3 px-4 flex items-center border-r border-gray-300">
                          <span className="text-gray-500 text-base whitespace-nowrap">+63</span>
                        </div>
                        <div className={`flex-1 py-3 pl-2 pr-4 flex items-center ${errors.phone_number ? 'bg-red-50' : 'bg-white'}`}>
                          <span className="text-gray-800 text-base mr-1">9</span>
                          <input
                            type="text"
                            value={formData.phone_number}
                            onChange={(e) => {
                              // Only allow digits and limit to 9 digits (excluding the displayed 9 prefix)
                              const value = e.target.value;
                              const digits = value.replace(/\D/g, '');
                              setFormData({ ...formData, phone_number: digits.substring(0, 9) });
                            }}
                            className="w-full border-none p-0 m-0 focus:ring-0 focus:outline-none bg-transparent"
                            placeholder="12345678"
                            maxLength={9}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Enter 9 digits after +63 9 (e.g., 12345678)</p>
                  </div>
                  {errors.phone_number && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.phone_number}
                    </p>
                  )}
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
                      <div className="relative">
                        <div className="flex w-full">
                          <div className="rounded-xl border-2 border-gray-300 overflow-hidden flex w-full">
                            <div className="bg-white py-3 px-4 flex items-center border-r border-gray-300">
                              <span className="text-gray-500 text-base whitespace-nowrap">+63</span>
                            </div>
                            <div className="bg-white flex-1 py-3 pl-2 pr-4 flex items-center">
                              <span className="text-gray-800 text-base mr-1">9</span>
                              <input
                                type="text"
                                value={formData.actual_occupant_phone}
                                onChange={(e) => {
                                  // Only allow digits and limit to 9 digits (excluding the displayed 9 prefix)
                                  const value = e.target.value;
                                  const digits = value.replace(/\D/g, '');
                                  setFormData({ ...formData, actual_occupant_phone: digits.substring(0, 9) });
                                }}
                                className="w-full border-none p-0 m-0 focus:ring-0 focus:outline-none bg-transparent"
                                placeholder="12345678"
                                maxLength={9}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Enter 9 digits after +63 9 (e.g., 12345678)</p>
                      </div>
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stall' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Active card tracking for filtering
  const [activeCard, setActiveCard] = useState<'total' | 'active' | 'inactive' | 'withStalls' | 'pending' | null>(null);

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
    actualOccupantPhone: '',
    phone_number: ''
  });

  // Vendor details modal state
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<ExistingVendor | null>(null);
  
  // Alert modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });
  
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: () => {}
  });
  
  // Selected vendors state
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchVendors();
    fetchSections();
    fetchStalls();

    // Set up real-time subscriptions
    const vendorsChannel = supabase
      .channel('vendors-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vendor_profiles' },
        (payload) => {
          console.log('Vendor profile change detected:', payload);
          fetchVendors();
        }
      )
      .subscribe();

    const stallsChannel = supabase
      .channel('stalls-vendor-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'stalls' },
        (payload) => {
          console.log('Stall change detected:', payload);
          fetchStalls(); // Refresh stall assignments
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(vendorsChannel);
      supabase.removeChannel(stallsChannel);
    };
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
      setLastUpdated(new Date());
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

    // Show confirm modal instead of window.confirm
    setConfirmModal({
      isOpen: true,
      title: `Delete Vendor: ${vendor.first_name} ${vendor.last_name}`,
      message: confirmMessage,
      type: 'warning',
      onConfirm: async () => {
        await performDeleteVendor(vendor);
      }
    });
    return;
  };
  
  const performDeleteVendor = async (vendor: ExistingVendor) => {

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
          setAlertModal({
            isOpen: true,
            title: 'Stall Error',
            message: 'Failed to free up the stall. Please check manually.',
            type: 'warning'
          });
        }
      }

      // Delete the vendor profile
      const { error: deleteError } = await supabase
        .from('vendor_profiles')
        .delete()
        .eq('id', vendor.id);

      if (deleteError) {
        console.error('Error deleting vendor:', deleteError);
        setAlertModal({
          isOpen: true,
          title: 'Deletion Failed',
          message: `Failed to delete vendor: ${deleteError.message}`,
          type: 'error'
        });
        return;
      }

      // Refresh the data
      await fetchVendors();
      await fetchStalls();

      const stallMessage = assignedStall ? ` Stall ${assignedStall.stall_number} is now available.` : '';

      // Show success modal
      setAlertModal({
        isOpen: true,
        title: 'Vendor Removed',
        message: `Vendor "${vendor.first_name} ${vendor.last_name}" has been successfully removed from the system.${stallMessage ? ' ' + stallMessage : ''}`,
        type: 'success'
      });

    } catch (error) {
      console.error('Error deleting vendor:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: `Failed to delete vendor "${vendor.first_name} ${vendor.last_name}". Please try again or contact system administrator.`,
        type: 'error'
      });
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
        setAlertModal({
          isOpen: true,
          title: 'Authentication Error',
          message: errorMsg,
          type: 'error'
        });
        throw new Error(errorMsg);
      }

      if (!vendorData.id) {
        const errorMsg = 'Vendor ID is required for updates.';
        console.error(errorMsg);
        setAlertModal({
          isOpen: true,
          title: 'Update Error',
          message: errorMsg,
          type: 'error'
        });
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

        setAlertModal({
          isOpen: true,
          title: 'Database Error',
          message: errorMsg,
          type: 'error'
        });
        throw new Error(errorMsg);
      }

      console.log('Database update result:', data);
      console.log('Vendor updated successfully, refreshing data...');

      // Refresh vendor data
      await fetchVendors();

      console.log('Vendor update process completed successfully');

      // Show success message using modal instead of alert
      setAlertModal({
        isOpen: true,
        title: 'Update Successful',
        message: 'Vendor information has been updated successfully!',
        type: 'success'
      });
      
      // Close the vendor details modal
      setShowVendorDetailsModal(false);

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
        setAlertModal({
          isOpen: true,
          title: 'Authentication Required',
          message: 'You must be logged in to add vendors.',
          type: 'warning'
        });
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
        phone_number: vendorData.phone_number || '', // Use the phone number from vendorData
        business_name: vendorData.business_name || '', // Use the business name from vendorData

        status: 'Active', // Set to Active instead of Pending
        role: 'vendor',
        application_status: 'approved', // Set to approved instead of pending
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
          setAlertModal({
            isOpen: true,
            title: 'Database Error',
            message: `Database constraint error: ${vendorError.message}. Please ensure all required fields are filled.`,
            type: 'error'
          });
        } else if (vendorError.code === '42501') {
          setAlertModal({
            isOpen: true,
            title: 'Permission Error',
            message: 'Permission denied. Please check admin permissions.',
            type: 'error'
          });
        } else {
          setAlertModal({
            isOpen: true,
            title: 'Add Vendor Error',
            message: `Failed to add vendor: ${vendorError.message || 'Unknown error'}`,
            type: 'error'
          });
        }
        return;
      }

      if (vendorProfileData) {
        let stallAssignmentMessage = generatedPassword ?
          `Vendor added successfully!\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\nPhone Number: +63 ${vendorData.phone_number}\n\nPlease share these credentials with the vendor.` :
          `Vendor added successfully!\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPhone Number: +63 ${vendorData.phone_number}\nPassword: [Will be set when stall is assigned]\n\nNote: Password format is username + stall number (e.g., username + e1)`;

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
                `Vendor created but failed to assign stall number.\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\nPhone Number: +63 ${vendorData.phone_number}\n\nPlease share these credentials with the vendor.` :
                `Vendor created but failed to assign stall number.\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPhone Number: +63 ${vendorData.phone_number}\nPassword: [Will be set when stall is manually assigned]\n\nNote: Password format is username + stall number (e.g., username + e1)`;
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
                stallAssignmentMessage = `Vendor and stall number assigned, but stall status update failed. Please check stalls table manually.\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\nPhone Number: +63 ${vendorData.phone_number}\n\nPlease share these credentials with the vendor.`;
              } else {
                console.log('Successfully assigned vendor to stall:', {
                  vendorId: (vendorProfileData as any).id,
                  stallId: vendorData.stall_id,
                  stallNumber: selectedStall.stall_number
                });

                stallAssignmentMessage = `Vendor added and stall assigned successfully!\n\nVendor Login Credentials:\nUsername: ${vendorData.username}\nPassword: ${generatedPassword}\nPhone Number: +63 ${vendorData.phone_number}\n\nPlease share these credentials with the vendor. The password is securely hashed in the database.`;
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
          actualOccupantPhone: vendorData.actual_occupant_phone || '',
          phone_number: vendorData.phone_number || ''
        });
        setShowCredentialsModal(true);
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to add vendor. Please try again.',
        type: 'error'
      });
    }
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedVendors = React.useMemo(() => {
    let filtered = vendors.filter(vendor => {
      const matchesSearch = searchTerm === '' ||
        // Primary vendor details
        vendor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.stall_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Actual occupant details
        vendor.actual_occupant_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.actual_occupant_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.actual_occupant_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.actual_occupant_phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        vendor.status?.toLowerCase() === statusFilter.toLowerCase();

      const assignedStall = stalls.find(stall => stall.vendor_profile_id === vendor.id);
      const vendorSectionId = assignedStall?.section_id || vendor.market_section_id;
      const matchesSection = sectionFilter === 'all' || vendorSectionId === sectionFilter;
      
      // Special handling for the "With Stalls" filter
      const hasStall = assignedStall || vendor.stall_number;
      const matchesWithStalls = activeCard !== 'withStalls' || hasStall;

      // Date range filter - filter by when vendor became active (created_at date)
      const vendorDate = new Date(vendor.created_at);
      const matchesDateRange = (() => {
        if (!startDate && !endDate) return true;
        
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        // Set time to start of day for start date
        if (start) start.setHours(0, 0, 0, 0);
        // Set time to end of day for end date
        if (end) end.setHours(23, 59, 59, 999);
        
        if (start && end) {
          return vendorDate >= start && vendorDate <= end;
        } else if (start) {
          return vendorDate >= start;
        } else if (end) {
          return vendorDate <= end;
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesSection && matchesWithStalls && matchesDateRange;
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
  }, [vendors, searchTerm, statusFilter, sectionFilter, startDate, endDate, sortBy, sortOrder, stalls, activeCard]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredAndSortedVendors.slice(startIndex, startIndex + itemsPerPage);
  
  // Selection handlers
  const toggleVendorSelection = (event: React.MouseEvent, vendorId: string) => {
    event.stopPropagation(); // Prevent row click from triggering
    const newSelected = new Set(selectedVendors);
    
    if (newSelected.has(vendorId)) {
      newSelected.delete(vendorId);
    } else {
      newSelected.add(vendorId);
    }
    
    setSelectedVendors(newSelected);
  };
  
  const toggleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all vendors on the current page
      const newSelected = new Set(selectedVendors);
      paginatedVendors.forEach(vendor => {
        newSelected.add(vendor.id);
      });
      setSelectedVendors(newSelected);
    } else {
      // Unselect all vendors on the current page
      const newSelected = new Set(selectedVendors);
      paginatedVendors.forEach(vendor => {
        newSelected.delete(vendor.id);
      });
      setSelectedVendors(newSelected);
    }
  };
  
  // Check if all vendors on current page are selected
  const allSelected = paginatedVendors.length > 0 && paginatedVendors.every(vendor => selectedVendors.has(vendor.id));
  
  // Function to activate selected vendors
  const activateSelectedVendors = async () => {
    console.log("Activate button clicked, selected vendors:", selectedVendors);
    if (selectedVendors.size === 0) {
      setAlertModal({
        isOpen: true,
        title: 'No Vendors Selected',
        message: 'Please select at least one vendor to activate.',
        type: 'warning'
      });
      return;
    }
    
    setConfirmModal({
      isOpen: true,
      title: 'Activate Vendors',
      message: `Are you sure you want to set ${selectedVendors.size} vendor${selectedVendors.size === 1 ? '' : 's'} to Active status?`,
      type: 'info',
      onConfirm: async () => {
        try {
          console.log("Confirmation accepted, proceeding with activation");
          const selectedIds = Array.from(selectedVendors);
          console.log("Selected IDs:", selectedIds);
          
          const updates = selectedIds.map(id => ({
            id,
            status: 'Active', // Changed from lowercase 'active' to title case 'Active' to match DB schema
            updated_at: new Date().toISOString()
          }));
          
          console.log("Updates to be applied:", updates);
          
          // Update each vendor individually instead of using upsert
          let hasErrors = false;
          
          // Update each vendor's status to active
          for (const vendorId of selectedIds) {
            console.log(`Updating vendor ${vendorId} to Active status`);
            const { error } = await (supabase as any)
              .from('vendor_profiles')
              .update({
                status: 'Active', // Changed from lowercase 'active' to title case 'Active'
                updated_at: new Date().toISOString()
              })
              .eq('id', vendorId);
            
            if (error) {
              console.error(`Error activating vendor ${vendorId}:`, error);
              hasErrors = true;
            }
          }
          
          const error = hasErrors ? { message: "Some vendors could not be activated" } : null;
            
          if (error) {
            throw error;
          }
          
          // Add a small delay before refreshing to ensure database consistency
          console.log("Updates completed, refreshing data after short delay");
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Refresh data
          await fetchVendors();
          
          // Show success message
          setAlertModal({
            isOpen: true,
            title: 'Vendors Activated',
            message: `Successfully activated ${selectedVendors.size} vendor${selectedVendors.size === 1 ? '' : 's'}.`,
            type: 'success'
          });
          
          // Clear selections
          setSelectedVendors(new Set());
        } catch (error) {
          console.error('Error activating vendors:', error);
          setAlertModal({
            isOpen: true,
            title: 'Activation Failed',
            message: `Failed to activate vendors: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'error'
          });
        }
      }
    });
  };
  
  // Function to inactivate selected vendors
  const inactivateSelectedVendors = async () => {
    console.log("Inactivate button clicked, selected vendors:", selectedVendors);
    if (selectedVendors.size === 0) {
      setAlertModal({
        isOpen: true,
        title: 'No Vendors Selected',
        message: 'Please select at least one vendor to inactivate.',
        type: 'warning'
      });
      return;
    }
    
    setConfirmModal({
      isOpen: true,
      title: 'Inactivate Vendors',
      message: `Are you sure you want to set ${selectedVendors.size} vendor${selectedVendors.size === 1 ? '' : 's'} to Inactive status?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          console.log("Confirmation accepted, proceeding with inactivation");
          const selectedIds = Array.from(selectedVendors);
          console.log("Selected IDs:", selectedIds);
          
          const updates = selectedIds.map(id => ({
            id,
            status: 'Inactive', // Using title case to match DB schema
            updated_at: new Date().toISOString()
          }));
          
          console.log("Updates to be applied:", updates);
          
          // Update each vendor individually instead of using upsert
          let hasErrors = false;
          
          // Update each vendor's status to inactive
          for (const vendorId of selectedIds) {
            console.log(`Updating vendor ${vendorId} to Inactive status`);
            const { error } = await (supabase as any)
              .from('vendor_profiles')
              .update({
                status: 'Inactive', // Using title case to match DB schema
                updated_at: new Date().toISOString()
              })
              .eq('id', vendorId);
            
            if (error) {
              console.error(`Error inactivating vendor ${vendorId}:`, error);
              hasErrors = true;
            }
          }
          
          const error = hasErrors ? { message: "Some vendors could not be inactivated" } : null;
            
          if (error) {
            throw error;
          }
          
          // Add a small delay before refreshing to ensure database consistency
          console.log("Updates completed, refreshing data after short delay");
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Refresh data
          await fetchVendors();
          
          // Show success message
          setAlertModal({
            isOpen: true,
            title: 'Vendors Inactivated',
            message: `Successfully inactivated ${selectedVendors.size} vendor${selectedVendors.size === 1 ? '' : 's'}.`,
            type: 'success'
          });
          
          // Clear selections
          setSelectedVendors(new Set());
        } catch (error) {
          console.error('Error inactivating vendors:', error);
          setAlertModal({
            isOpen: true,
            title: 'Inactivation Failed',
            message: `Failed to inactivate vendors: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'error'
          });
        }
      }
    });
  };

  // Statistics
  const stats = React.useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter(v => v.status?.toLowerCase() === 'active').length;
    const inactive = vendors.filter(v => v.status?.toLowerCase() === 'inactive').length;
    const withStalls = vendors.filter(v => {
      const assignedStall = stalls.find(stall => stall.vendor_profile_id === v.id);
      return assignedStall || v.stall_number;
    }).length;
    const pending = vendors.filter(v => v.status?.toLowerCase() === 'pending').length;

    return { total, active, inactive, pending, withStalls, withoutStalls: total - withStalls };
  }, [vendors, stalls]);

  // Handle card click to apply filtering
  const handleCardClick = (cardType: 'total' | 'active' | 'inactive' | 'withStalls' | 'pending') => {
    // If the same card is clicked again, remove the filter
    if (activeCard === cardType) {
      setActiveCard(null);
      clearFilters();
      return;
    }
    
    setActiveCard(cardType);
    
    // Apply the appropriate filters
    switch (cardType) {
      case 'total':
        // Show all vendors
        setStatusFilter('all');
        setSectionFilter('all');
        break;
      case 'active':
        // Filter by active status
        setStatusFilter('active');
        break;
      case 'inactive':
        // Filter by inactive status
        setStatusFilter('inactive');
        break;
      case 'withStalls':
        // We're filtering in the filtered vendors logic, so just set a marker
        setStatusFilter('all');
        // Other filters will be handled in the vendor filtering logic
        break;
      case 'pending':
        // Filter by pending status
        setStatusFilter('pending');
        break;
    }
    
    // Reset to first page when changing filters
    setCurrentPage(1);
  };

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSectionFilter('all');
    setStartDate('');
    setEndDate('');
    setSortBy('name');
    setSortOrder('asc');
    setActiveCard(null);
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
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            Real-time updates enabled • Last updated: {lastUpdated.toLocaleTimeString()}
            <button
              onClick={() => fetchVendors()}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              ↻ Refresh
            </button>
          </div>
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
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Vendors Card */}
        <div 
          onClick={() => handleCardClick('total')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('total');
            }
          }}
          tabIndex={0}
          role="button"
          aria-pressed={activeCard === 'total'}
          className={`bg-white overflow-hidden shadow rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            ${activeCard === 'total' 
              ? 'border-indigo-500 ring-2 ring-indigo-200' 
              : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className={`h-6 w-6 ${activeCard === 'total' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3 3 3 0 013 3v2a3 3 0 01-3 3zm8-10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Vendors</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
              {activeCard === 'total' && (
                <div className="ml-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Vendors Card */}
        <div 
          onClick={() => handleCardClick('active')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('active');
            }
          }}
          tabIndex={0}
          role="button"
          aria-pressed={activeCard === 'active'}
          className={`bg-white overflow-hidden shadow rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            ${activeCard === 'active' 
              ? 'border-green-500 ring-2 ring-green-200' 
              : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 rounded-full ${activeCard === 'active' ? 'bg-green-500' : 'bg-green-100'} flex items-center justify-center`}>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Vendors</dt>
                  <dd className="text-lg font-medium text-green-600">{stats.active}</dd>
                </dl>
              </div>
              {activeCard === 'active' && (
                <div className="ml-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Inactive Vendors Card */}
        <div 
          onClick={() => handleCardClick('inactive')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('inactive');
            }
          }}
          tabIndex={0}
          role="button"
          aria-pressed={activeCard === 'inactive'}
          className={`bg-white overflow-hidden shadow rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
            ${activeCard === 'inactive' 
              ? 'border-gray-500 ring-2 ring-gray-200' 
              : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 rounded-full ${activeCard === 'inactive' ? 'bg-gray-500' : 'bg-gray-100'} flex items-center justify-center`}>
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inactive Vendors</dt>
                  <dd className="text-lg font-medium text-gray-600">{stats.inactive}</dd>
                </dl>
              </div>
              {activeCard === 'inactive' && (
                <div className="ml-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                    <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* With Stalls Card */}
        <div 
          onClick={() => handleCardClick('withStalls')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('withStalls');
            }
          }}
          tabIndex={0}
          role="button"
          aria-pressed={activeCard === 'withStalls'}
          className={`bg-white overflow-hidden shadow rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${activeCard === 'withStalls' 
              ? 'border-blue-500 ring-2 ring-blue-200' 
              : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className={`h-6 w-6 ${activeCard === 'withStalls' ? 'text-blue-500' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">With Stalls</dt>
                  <dd className="text-lg font-medium text-blue-600">{stats.withStalls}</dd>
                </dl>
              </div>
              {activeCard === 'withStalls' && (
                <div className="ml-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div 
          onClick={() => handleCardClick('pending')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('pending');
            }
          }}
          tabIndex={0}
          role="button"
          aria-pressed={activeCard === 'pending'}
          className={`bg-white overflow-hidden shadow rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
            ${activeCard === 'pending' 
              ? 'border-yellow-500 ring-2 ring-yellow-200' 
              : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 rounded-full ${activeCard === 'pending' ? 'bg-yellow-500' : 'bg-yellow-100'} flex items-center justify-center`}>
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-yellow-600">{stats.pending}</dd>
                </dl>
              </div>
              {activeCard === 'pending' && (
                <div className="ml-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100">
                    <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filtering */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Vendors & Actual Occupants
              </label>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute z-10 left-0 -bottom-1 transform translate-y-full w-64 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Searches across: vendor name, username, stall number, phone number, and all actual occupant details (name, username, phone).
                </div>
              </div>
            </div>
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
                placeholder="Search by name, username, stall, or actual occupant details..."
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
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setActiveCard(null); // Clear card selection when filter changes directly
              }}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                ${activeCard === 'active' || activeCard === 'inactive' || activeCard === 'pending' ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300'}`}
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
              onChange={(e) => {
                setSectionFilter(e.target.value);
                setActiveCard(null); // Clear card selection when section filter changes
              }}
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

          {/* Start Date Filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Active From
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Active To
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Active Filters & Clear */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Filters active:</span>
            
            {/* Card filter indicators */}
            {activeCard === 'total' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3 3 3 0 013 3v2a3 3 0 01-3 3zm8-10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Total Vendors
              </span>
            )}
            
            {activeCard === 'active' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                Active Vendors
              </span>
            )}
            
            {activeCard === 'inactive' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <div className="h-2 w-2 rounded-full bg-gray-500 mr-1"></div>
                Inactive Vendors
              </span>
            )}
            
            {activeCard === 'withStalls' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                With Stalls
              </span>
            )}
            
            {activeCard === 'pending' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                Pending Vendors
              </span>
            )}
            
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
            {startDate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                From: {new Date(startDate).toLocaleDateString()}
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                To: {new Date(endDate).toLocaleDateString()}
              </span>
            )}
            {!searchTerm && statusFilter === 'all' && sectionFilter === 'all' && !startDate && !endDate && (
              <span className="text-gray-500">
                No active filters
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!searchTerm && statusFilter === 'all' && sectionFilter === 'all' && !startDate && !endDate && !activeCard}
              className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                ${searchTerm || statusFilter !== 'all' || sectionFilter !== 'all' || startDate || endDate || activeCard
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'text-gray-400 bg-gray-50 cursor-not-allowed'}`}
            >
              <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
            
            {selectedVendors.size > 0 && (() => {
              // Determine if any of the selected vendors are active
              const hasActiveVendors = Array.from(selectedVendors).some(id => {
                const vendor = vendors.find(v => v.id === id);
                return vendor?.status?.toLowerCase() === 'active';
              });
              
              return (
                <button
                  type="button"
                  onClick={hasActiveVendors ? inactivateSelectedVendors : activateSelectedVendors}
                  className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    hasActiveVendors 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
                  }`}
                >
                  <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {hasActiveVendors ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                  {hasActiveVendors ? 'Inactivate' : 'Activate'} {selectedVendors.size} Selected
                </button>
              );
            })()}
          </div>
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
            {selectedVendors.size > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {selectedVendors.size} selected
              </span>
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
                  {searchTerm || statusFilter !== 'all' || sectionFilter !== 'all' || startDate || endDate
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by adding your first vendor.'}
                </p>
                {(searchTerm || statusFilter !== 'all' || sectionFilter !== 'all' || startDate || endDate) && (
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
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 w-8">
                        <div className="flex items-center">
                          <input
                            id="select-all-vendors"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={allSelected}
                            onChange={() => {}} // React requires onChange handler for controlled components
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectAll(e as unknown as React.ChangeEvent<HTMLInputElement>);
                            }}
                          />
                          <label htmlFor="select-all-vendors" className="sr-only">
                            Select All
                          </label>
                        </div>
                      </th>
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
                        Phone Number
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
                        Section
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
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
                          <td className="py-4 pl-4 pr-3 text-sm sm:pl-0 w-8">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={selectedVendors.has(vendor.id)}
                                onChange={() => {}} // React requires onChange handler for controlled components
                                onClick={(e) => toggleVendorSelection(e, vendor.id)}
                              />
                            </div>
                          </td>
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
                                <div className="text-xs text-gray-500 font-mono">@{vendor.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm">
                            {vendor.phone_number ? (
                              <div className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">
                                {vendor.phone_number.startsWith('+63') 
                                  ? vendor.phone_number 
                                  : vendor.phone_number.startsWith('9') 
                                    ? `+63${vendor.phone_number}` 
                                    : `+639${vendor.phone_number}`
                                }
                              </div>
                            ) : (
                              <div className="text-red-600 font-medium italic px-2 py-1 text-xs">
                                None
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm">
                            {stallNumber ? (
                              <div className="flex items-center">
                                <div className="h-6 w-8 flex-shrink-0 rounded bg-blue-100 flex items-center justify-center">
                                  <span className="font-medium text-blue-700 text-xs">{stallNumber}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No stall assigned</span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm">
                            <div className="text-gray-900">
                              {section?.name || 'No section'}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm">
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
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // Stop event from bubbling up to the row
                                handleDeleteVendor(vendor);
                              }}
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
        phone_number={credentialsData.phone_number}
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
        setAlertModal={setAlertModal}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
}