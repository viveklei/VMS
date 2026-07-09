import React, { useState } from 'react';
import { Calendar, Plus, Settings, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';

export default function Maintenance() {
  const [records, setRecords] = useState([
    { id: '1', plateNumber: 'DL-3C-AS-1294', serviceType: 'Routine', description: 'Engine Oil and Filter Replacement', cost: 3500.00, odometer: 40000, serviceDate: '2026-05-10', completedDate: '2026-05-10', status: 'Completed', vendorName: 'Tata Authorised Workshop' },
    { id: '2', plateNumber: 'MH-12-PQ-8830', serviceType: 'Preventive', description: 'Brake Pad Check & Suspension Alignment', cost: 8200.00, odometer: 79000, serviceDate: '2026-06-20', completedDate: null, status: 'Scheduled', vendorName: 'Mahindra Service Center' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [serviceType, setServiceType] = useState('Preventive');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [vendor, setVendor] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const added = {
      id: `m-${Date.now()}`,
      plateNumber: vehicle || 'DL-3C-AS-1294',
      serviceType,
      description: description || 'Routine health maintenance checkup',
      cost: parseFloat(cost) || 0,
      odometer: 42350,
      serviceDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      status: 'Scheduled',
      vendorName: vendor || 'LEI In-House Workshop'
    };
    setRecords([added, ...records]);
    setShowModal(false);
    setVehicle('');
    setDescription('');
    setCost('');
    setVendor('');
  };

  const handleResolve = (id: string) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: 'Completed', completedDate: new Date().toISOString().split('T')[0] } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance Schedule & Logs</h1>
          <p className="text-sm text-slate-500">Preventive servicing, oil intervals, and part changes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus size={18} /> Schedule Maintenance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map((rec) => (
          <div key={rec.id} className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{rec.serviceType} Service</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">{rec.plateNumber}</h3>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                rec.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
              }`}>{rec.status}</span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">{rec.description}</p>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-500">
              <div>
                <span className="block font-medium text-slate-400">Scheduled Date</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{rec.serviceDate}</span>
              </div>
              <div>
                <span className="block font-medium text-slate-400">Authorized Vendor</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{rec.vendorName}</span>
              </div>
              <div className="text-right">
                <span className="block font-medium text-slate-400">Total Cost</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">₹{rec.cost.toLocaleString()}</span>
              </div>
            </div>

            {rec.status === 'Scheduled' && (
              <button
                onClick={() => handleResolve(rec.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/15"
              >
                Log Service Completion
              </button>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-bold mb-4">Schedule Servicing</h3>
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
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Estimated Cost (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Description of Service</label>
                <textarea
                  placeholder="e.g. Change oil, rotate tires, align suspension..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Service Center / Workshop Vendor</label>
                <input
                  type="text"
                  placeholder="e.g. Tata Workshop Sec 63"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
