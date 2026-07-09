import React, { useState } from 'react';
import { useAppStore } from '../store/store';
import { Shield, Mail, Lock, AlertCircle, Ship } from 'lucide-react';

export default function Login() {
  const loginAction = useAppStore((state) => state.login);
  const [email, setEmail] = useState('admin@fleetops.lei');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock successful authentication or server integration
    setTimeout(() => {
      if (email === 'admin@fleetops.lei' && password === 'admin123') {
        loginAction(
          {
            id: 'd3b07384-d113-49cd-a5d6-8c9012a64010',
            email: 'admin@fleetops.lei',
            firstName: 'Super',
            lastName: 'Admin',
            role: 'Super Admin',
            permissions: ['Create', 'Read', 'Update', 'Delete', 'Approve', 'Export', 'Manage Settings'],
            branchId: 'b5c01024-e224-4fcd-b5d6-8c9012a64020'
          },
          'mock-jwt-token-access-2026'
        );
      } else {
        setError('Invalid email or password. Try quick login credentials.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 bg-cover bg-center font-sans" style={{ backgroundImage: `radial-gradient(circle at 10% 20%, rgb(4, 21, 45) 0%, rgb(16, 37, 70) 90.2%)` }}>
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/logo.png" className="w-16 h-16 object-contain rounded-2xl shadow-lg shadow-blue-500/10" alt="LEI Logo" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">LEI VMS</h2>
          <p className="text-sm text-slate-300 mt-1">Enterprise Vehicle Management System</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg mb-6">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-sm transition-all"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-sm transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]"
          >
            {loading ? 'Authenticating System...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Shield size={14} className="text-blue-400" />
            Authorized Personnel Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
