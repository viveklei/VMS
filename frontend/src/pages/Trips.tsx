import React, { useState } from 'react';
import { Navigation, Play, Power, CheckCircle, Clock } from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState([
    { id: '1', plateNumber: 'DL-3C-AS-1294', driver: 'Amit Kumar', customer: 'Samsung Service Center', origin: 'Delhi HQ', destination: 'Noida Sec 62', status: 'Completed', startOdo: 42200, endOdo: 42280, time: '2026-06-16' },
    { id: '2', plateNumber: 'MH-12-PQ-8830', driver: 'Suresh Patil', customer: 'L&T Project Site', origin: 'Mumbai Branch', destination: 'Pune Chinchwad', status: 'Active', startOdo: 78450, endOdo: null, time: '2026-06-17' }
  ]);

  const [dispatching, setDispatching] = useState(false);
  const [vehicleId, setVehicleId] = useState('');
  const [driver, setDriver] = useState('');
  const [customer, setCustomer] = useState('');
  const [destination, setDestination] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip = {
      id: `t-${Date.now()}`,
      plateNumber: vehicleId || 'DL-3C-AS-1294',
      driver: driver || 'Amit Kumar',
      customer: customer || 'LEI Client',
      origin: 'Delhi HQ',
      destination: destination || 'Customer Site',
      status: 'Active',
      startOdo: 42350,
      endOdo: null,
      time: new Date().toISOString().split('T')[0]
    };
    setTrips([newTrip, ...trips]);
    setDispatching(false);
    setVehicleId('');
    setDriver('');
    setCustomer('');
    setDestination('');
  };

  const handleComplete = (id: string) => {
    setTrips(trips.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Completed', endOdo: (t.startOdo + 85) };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Dispatches & Trips</h1>
          <p className="text-sm text-slate-500">Live operational logs for nationwide field engineers</p>
        </div>
        <button
          onClick={() => setDispatching(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          <Play size={18} /> Start New Dispatch
        </button>
      </div>

      <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                <th className="p-4">Vehicle / Driver</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Route</th>
                <th className="p-4">Odometer Log</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{t.plateNumber}</div>
                    <div className="text-xs text-slate-400">{t.driver}</div>
                  </td>
                  <td className="p-4 font-medium">{t.customer}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{t.origin}</span>
                      <span className="text-slate-400">&rarr;</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">{t.destination}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono">
                    Start: {t.startOdo} km <br />
                    End: {t.endOdo ? `${t.endOdo} km` : '--'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                      t.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {t.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {t.status === 'Active' && (
                      <button
                        onClick={() => handleComplete(t.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-all"
                      >
                        Complete Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dispatching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-bold mb-4">Launch Engineering Dispatch</h3>
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Vehicle License Plate</label>
                <input
                  type="text"
                  placeholder="e.g. DL-3C-AS-1294"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Service Engineer / Driver</label>
                <input
                  type="text"
                  placeholder="e.g. Amit Kumar"
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung Inc"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Destination Hub</label>
                  <input
                    type="text"
                    placeholder="e.g. Noida Sec 62"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setDispatching(false)}
                  className="w-1/2 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
                >
                  Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
