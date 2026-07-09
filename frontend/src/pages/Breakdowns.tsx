import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Flame, Plus } from 'lucide-react';

export default function Breakdowns() {
  const [breakdowns, setBreakdowns] = useState([
    { id: '1', plateNumber: 'HR-26-EE-9912', driver: 'Amit Kumar', location: 'NH-48 Highway, Near Manesar Toll', reportedAt: '2026-06-17 06:12', description: 'Engine overheated, thick coolant vapor escaping.', status: 'Reported', severity: 'Critical' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const added = {
      id: `b-${Date.now()}`,
      plateNumber: vehicle || 'DL-3C-AS-1294',
      driver: 'Amit Kumar',
      location: location || 'NH-48 highway',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: description || 'No power output',
      status: 'Reported',
      severity
    };
    setBreakdowns([added, ...breakdowns]);
    setShowModal(false);
    setVehicle('');
    setLocation('');
    setDescription('');
  };

  const handleResolve = (id: string) => {
    setBreakdowns(breakdowns.map(b => b.id === id ? { ...b, status: 'Resolved' } : b));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Breakdowns & Emergency Alerts</h1>
          <p className="text-sm text-slate-500">Live breakdown response logs for service engineer fleets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-red-500/20"
        >
          <Plus size={18} /> Report Active Breakdown
        </button>
      </div>

      <div className="space-y-4">
        {breakdowns.map((b) => (
          <div key={b.id} className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                  b.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>{b.severity} Severity</span>
                <span className="text-xs text-slate-400">Reported at {b.reportedAt}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{b.plateNumber} &bull; Driver: {b.driver}</h3>
              <p className="text-sm text-slate-500"><strong className="text-slate-700 dark:text-slate-300">Location:</strong> {b.location}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{b.description}</p>
            </div>

            <div className="flex flex-col gap-2 items-end w-full md:w-auto">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                b.status === 'Resolved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500 animate-pulse'
              }`}>{b.status}</span>
              {b.status === 'Reported' && (
                <button
                  onClick={() => handleResolve(b.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/15 w-full md:w-auto text-center"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-bold mb-4 text-red-500 flex items-center gap-1.5"><AlertTriangle size={20} /> Report Breakdown</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Vehicle License Plate</label>
                <input
                  type="text"
                  placeholder="e.g. DL-3C-AS-1294"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Location Highway / Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. NH-48 Manesar"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Problem Description</label>
                <textarea
                  placeholder="Describe electrical or mechanical issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl h-24 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-red-500/20"
                >
                  File Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
