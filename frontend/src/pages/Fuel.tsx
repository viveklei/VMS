import React, { useState } from 'react';
import { Fuel as GasIcon, Plus, CheckCircle, Clock } from 'lucide-react';

export default function Fuel() {
  const [entries, setEntries] = useState([
    { id: '1', plateNumber: 'DL-3C-AS-1294', driver: 'Amit Kumar', date: '2026-06-15', odometer: 42100, liters: 30.00, pricePerLiter: 96.50, totalCost: 2895.00, vendor: 'Indian Oil Sec 63', status: 'Approved' },
    { id: '2', plateNumber: 'MH-12-PQ-8830', driver: 'Suresh Patil', date: '2026-06-16', odometer: 78400, liters: 50.00, pricePerLiter: 104.20, totalCost: 5210.00, vendor: 'HP Pump Pune', status: 'Pending' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [liters, setLiters] = useState('');
  const [price, setPrice] = useState('96.50');
  const [odometer, setOdometer] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLiters = parseFloat(liters) || 0;
    const parsedPrice = parseFloat(price) || 0;
    const added = {
      id: `f-${Date.now()}`,
      plateNumber: vehicle || 'DL-3C-AS-1294',
      driver: 'Super Admin',
      date: new Date().toISOString().split('T')[0],
      odometer: parseInt(odometer) || 42350,
      liters: parsedLiters,
      pricePerLiter: parsedPrice,
      totalCost: parsedLiters * parsedPrice,
      vendor: 'Hindustan Petroleum',
      status: 'Pending'
    };
    setEntries([added, ...entries]);
    setShowModal(false);
    setVehicle('');
    setLiters('');
    setOdometer('');
  };

  const handleApprove = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to discard this fuel entry?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel Refill Logs</h1>
          <p className="text-sm text-slate-500">Track fuel cards, efficiency trends, and invoices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus size={18} /> Record Fuel Purchase
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fuel Expended</span>
          <h3 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">₹8,105.00</h3>
        </div>
        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Efficiency</span>
          <h3 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">14.6 km / L</h3>
        </div>
        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Audit Approvals</span>
          <h3 className="text-2xl font-extrabold mt-1 text-amber-500">1 Log</h3>
        </div>
      </div>

      {/* Fuel Log Table */}
      <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                <th className="p-4">Vehicle License Plate</th>
                <th className="p-4">Log Date</th>
                <th className="p-4">Odometer</th>
                <th className="p-4">Quantity (Liters)</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{entry.plateNumber}</td>
                  <td className="p-4">{entry.date}</td>
                  <td className="p-4 font-mono">{entry.odometer.toLocaleString()} km</td>
                  <td className="p-4">{entry.liters} L</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">₹{entry.totalCost.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      entry.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {entry.status === 'Approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {entry.status === 'Pending' && (
                        <button
                          onClick={() => handleApprove(entry.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/10"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="px-3 py-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg text-xs font-semibold transition-all"
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
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-bold mb-4">Record Fuel Purchase</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Vehicle License Plate</label>
                <input
                  type="text"
                  placeholder="e.g. DL-3C-AS-1294"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Liters</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 30"
                    value={liters}
                    onChange={(e) => setLiters(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Price Per Liter (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Odometer at Fill-up</label>
                <input
                  type="number"
                  placeholder="e.g. 42350"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
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
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
