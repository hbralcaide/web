import { useState } from 'react';
// import VendorApplications from './admin/Vendors/Application/VendorApplications';
import VendorApplications from './VendorApplications';
import ExistingVendors from './ExistingVendors';

type TabType = 'applications' | 'existing';

export default function Vendors() {
  const [activeTab, setActiveTab] = useState<TabType>('existing');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-gray-600">Manage existing vendors and review new applications</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('existing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'existing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Existing Vendors
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Applications
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'existing' && <ExistingVendors />}
        {activeTab === 'applications' && <VendorApplications />}
      </div>
    </div>
  );
}