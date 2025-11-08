import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface AdminProfile {
    id: string
    auth_user_id: string
    username: string
    first_name: string
    last_name: string
    email: string
    phone_number: string | null
    role: string
    status: string
    created_at: string
    updated_at: string
}

interface InviteFormData {
    email: string
    firstName: string
    lastName: string
}

export default function AdminManagement() {
    const navigate = useNavigate()
    const [admins, setAdmins] = useState<AdminProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [inviteLoading, setInviteLoading] = useState(false)
    const [inviteError, setInviteError] = useState('')
    const [inviteSuccess, setInviteSuccess] = useState('')
    const [inviteFormData, setInviteFormData] = useState<InviteFormData>({
        email: '',
        firstName: '',
        lastName: ''
    })
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean
        title: string
        message: string
        onConfirm: () => void
        type: 'deactivate' | 'activate' | 'delete'
    }>({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'deactivate'
    })

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('admin_profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAdmins(data || [])
        } catch (error) {
            console.error('Error fetching admins:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInviteAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        setInviteLoading(true)
        setInviteError('')
        setInviteSuccess('')

        try {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(inviteFormData.email)) {
                throw new Error('Please enter a valid email address')
            }

            // Get the current session token
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                throw new Error('You must be logged in to invite admins')
            }

            // Call the Edge Function to invite the admin
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-admin`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        email: inviteFormData.email,
                        firstName: inviteFormData.firstName,
                        lastName: inviteFormData.lastName,
                    }),
                }
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to invite admin')
            }

            setInviteSuccess(`Invitation sent successfully to ${inviteFormData.email}! They will receive an email to set up their account.`)
            setInviteFormData({ email: '', firstName: '', lastName: '' })
            
            // Close modal after 3 seconds
            setTimeout(() => {
                setShowInviteModal(false)
                setInviteSuccess('')
                fetchAdmins() // Refresh the list
            }, 3000)

        } catch (error: any) {
            console.error('Error inviting admin:', error)
            setInviteError(error.message || 'Failed to send invitation')
        } finally {
            setInviteLoading(false)
        }
    }

    const handleStatusChange = async (admin: AdminProfile, newStatus: 'Active' | 'Inactive') => {
        try {
            const statusValue = newStatus.toLowerCase()
            const { error } = await (supabase
                .from('admin_profiles') as any)
                .update({ status: statusValue })
                .eq('id', admin.id)

            if (error) throw error

            // Update local state
            setAdmins(admins.map(a => 
                a.id === admin.id ? { ...a, status: statusValue } : a
            ))

            setConfirmModal({ ...confirmModal, show: false })
        } catch (error) {
            console.error('Error updating admin status:', error)
            alert('Failed to update admin status')
        }
    }

    const handleDeleteAdmin = async (admin: AdminProfile) => {
        try {
            // Delete admin profile
            const { error: profileError } = await supabase
                .from('admin_profiles')
                .delete()
                .eq('id', admin.id)

            if (profileError) throw profileError

            // Try to delete auth user (may require service role key)
            const { error: authError } = await supabase.auth.admin.deleteUser(admin.auth_user_id)
            
            if (authError) {
                console.warn('Could not delete auth user:', authError)
            }

            // Update local state
            setAdmins(admins.filter(a => a.id !== admin.id))
            setConfirmModal({ ...confirmModal, show: false })
        } catch (error) {
            console.error('Error deleting admin:', error)
            alert('Failed to delete admin')
        }
    }

    const filteredAdmins = admins.filter(admin => {
        const searchLower = searchTerm.toLowerCase()
        return (
            admin.first_name.toLowerCase().includes(searchLower) ||
            admin.last_name.toLowerCase().includes(searchLower) ||
            admin.email.toLowerCase().includes(searchLower) ||
            admin.username.toLowerCase().includes(searchLower)
        )
    })

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                <p className="text-gray-600 mt-1">Manage admin users and send invitations</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Invite Button */}
                    <button
                        onClick={() => navigate('/signup?role=admin')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Admin
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Admins</p>
                            <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {admins.filter(a => a.status === 'Active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Inactive</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {admins.filter(a => a.status === 'Inactive').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admins Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading admins...</p>
                    </div>
                ) : filteredAdmins.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">No admins found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold">
                                                            {admin.first_name.charAt(0)}{admin.last_name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {admin.first_name} {admin.last_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.phone_number || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                admin.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(admin.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {admin.status === 'Active' ? (
                                                    <button
                                                        onClick={() => setConfirmModal({
                                                            show: true,
                                                            title: 'Deactivate Admin',
                                                            message: `Are you sure you want to deactivate ${admin.first_name} ${admin.last_name}? They will not be able to access the admin panel.`,
                                                            onConfirm: () => handleStatusChange(admin, 'Inactive'),
                                                            type: 'deactivate'
                                                        })}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmModal({
                                                            show: true,
                                                            title: 'Activate Admin',
                                                            message: `Are you sure you want to activate ${admin.first_name} ${admin.last_name}? They will regain access to the admin panel.`,
                                                            onConfirm: () => handleStatusChange(admin, 'Active'),
                                                            type: 'activate'
                                                        })}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    onClick={() => setConfirmModal({
                                                        show: true,
                                                        title: 'Delete Admin',
                                                        message: `Are you sure you want to permanently delete ${admin.first_name} ${admin.last_name}? This action cannot be undone.`,
                                                        onConfirm: () => handleDeleteAdmin(admin),
                                                        type: 'delete'
                                                    })}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Invite New Admin</h2>
                            <button
                                onClick={() => {
                                    setShowInviteModal(false)
                                    setInviteError('')
                                    setInviteSuccess('')
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {inviteError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {inviteError}
                            </div>
                        )}

                        {inviteSuccess && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                                {inviteSuccess}
                            </div>
                        )}

                        <form onSubmit={handleInviteAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={inviteFormData.email}
                                    onChange={(e) => setInviteFormData({ ...inviteFormData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="admin@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inviteFormData.firstName}
                                    onChange={(e) => setInviteFormData({ ...inviteFormData, firstName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inviteFormData.lastName}
                                    onChange={(e) => setInviteFormData({ ...inviteFormData, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Doe"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowInviteModal(false)
                                        setInviteError('')
                                        setInviteSuccess('')
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteLoading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                >
                                    {inviteLoading ? 'Sending...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {confirmModal.title}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {confirmModal.message}
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                                    confirmModal.type === 'delete' 
                                        ? 'bg-red-600 hover:bg-red-700' 
                                        : confirmModal.type === 'deactivate'
                                        ? 'bg-yellow-600 hover:bg-yellow-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {confirmModal.type === 'delete' ? 'Delete' : confirmModal.type === 'deactivate' ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
