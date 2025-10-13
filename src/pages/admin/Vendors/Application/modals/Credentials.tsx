// src/pages/admin/Vendors/Application/modals/Credentials.tsx
import React, { useEffect, useState } from 'react';

export type Creds = {
  id?: string;
  email?: string;
  username?: string;
  role?: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  credentials?: Creds | null;
  onSave?: (payload: { email: string; username: string; role: string }) => Promise<void>;
  roles?: string[];
}

const Credentials: React.FC<Props> = ({ isOpen, onClose, credentials, onSave, roles = ['admin', 'employee', 'vendor'] }) => {
  const [email, setEmail] = useState<string>(credentials?.email ?? '');
  const [username, setUsername] = useState<string>(credentials?.username ?? '');
  const [role, setRole] = useState<string>(credentials?.role ?? roles[0]);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(credentials?.email ?? '');
      setUsername(credentials?.username ?? '');
      setRole(credentials?.role ?? roles[0]);
      setError(null);
    }
  }, [isOpen, credentials, roles]);

  if (!isOpen) return null;

  const validate = () => {
    if (!email || !email.includes('@')) return 'Please enter a valid email address.';
    if (!username || username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (!role) return 'Please select a role.';
    return null;
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (onSave) {
        await onSave({ email: email.trim(), username: username.trim(), role });
      } else {
        // noop fallback — parent should pass onSave for real persistence
        console.warn('Credentials.onSave not provided; nothing saved.');
      }
      onClose();
    } catch (err: any) {
      console.error('Credentials save failed:', err);
      setError(err?.message ?? 'Failed to save credentials. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="absolute inset-0 bg-black/40" onClick={() => !saving && onClose()} />
      <div className="relative w-11/12 max-w-md bg-white rounded-lg shadow-lg p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Credentials</h3>
          <button onClick={() => !saving && onClose()} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

        <div className="space-y-3">
          <label className="block text-sm">
            <div className="text-xs text-gray-600 mb-1">Email</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1" placeholder="user@example.com" disabled={saving} />
          </label>

          <label className="block text-sm">
            <div className="text-xs text-gray-600 mb-1">Username</div>
            <input value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1" placeholder="username" disabled={saving} />
          </label>

          <label className="block text-sm">
            <div className="text-xs text-gray-600 mb-1">Role</div>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1" disabled={saving}>
              {roles.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={() => !saving && onClose()} className="px-3 py-1 rounded bg-gray-100 text-sm" disabled={saving}>Cancel</button>
          <button onClick={handleSave} className={`px-4 py-2 rounded text-sm font-medium ${saving ? 'bg-blue-300 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
