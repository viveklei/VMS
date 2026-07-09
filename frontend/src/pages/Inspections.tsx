import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { CheckCircle, AlertTriangle, ShieldCheck, RefreshCcw, Wifi, WifiOff } from 'lucide-react';

export default function Inspections() {
  const offlineInspections = useAppStore((state) => state.offlineInspections);
  const addOfflineInspection = useAppStore((state) => state.addOfflineInspection);
  const clearOfflineInspections = useAppStore((state) => state.clearOfflineInspections);

  const [online, setOnline] = useState(navigator.onLine);
  const [logs, setLogs] = useState([
    { id: '1', plateNumber: 'DL-3C-AS-1294', inspector: 'Super Admin', date: '2026-06-16', status: 'Completed', notes: 'All functional checks passed.' },
    { id: '2', plateNumber: 'HR-26-EE-9912', inspector: 'Super Admin', date: '2026-06-17', status: 'Failed', notes: 'Brake pads worn, hazard lights out.' }
  ]);

  const [vehicle, setVehicle] = useState('');
  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');
  const [brakes, setBrakes] = useState('Pass');
  const [lights, setLights] = useState('Pass');

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isInspectionPass = brakes === 'Pass' && lights === 'Pass';
    const submission = {
      id: `i-${Date.now()}`,
      plateNumber: vehicle || 'DL-3C-AS-1294',
      inspector: 'Super Admin',
      date: new Date().toISOString().split('T')[0],
      status: isInspectionPass ? 'Completed' : 'Failed',
      notes: notes || `Inspection completed. Checks: Brakes: ${brakes}, Lights: ${lights}`
    };

    if (!online) {
      addOfflineInspection(submission);
      alert('Network offline! Inspection saved to local storage. It will be cached for synchronization once network connection is restored.');
    } else {
      setLogs([submission, ...logs]);
    }

    setVehicle('');
    setOdometer('');
    setNotes('');
  };

  const handleSync = () => {
    if (offlineInspections.length === 0) return;
    setLogs([...offlineInspections, ...logs]);
    clearOfflineInspections();
    alert('Synchronized cached local logs to database servers.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Safety Inspections</h1>
          <p className="text-sm text-slate-500">Submit digital walkaround logs and verify mechanical checklists</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            online ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {online ? <Wifi size={14} /> : <WifiOff size={14} />}
            {online ? 'Network Online' : 'Network Offline'}
          </span>
          {offlineInspections.length > 0 && online && (
            <button
              onClick={handleSync}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-600/10"
            >
              <RefreshCcw size={14} /> Sync {offlineInspections.length} logs
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection Form */}
        <div className="lg:col-span-1 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">New Safety Inspection</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Odometer (km)</label>
              <input
                type="number"
                placeholder="e.g. 42350"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Brakes & Controls</label>
                <select
                  value={brakes}
                  onChange={(e) => setBrakes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Lights & Indicators</label>
                <select
                  value={lights}
                  onChange={(e) => setLights(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Additional Notes</label>
              <textarea
                placeholder="Describe any issues or checks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl h-20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
            >
              Submit Inspection Form
            </button>
          </form>
        </div>

        {/* Previous Log list */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Recent Inspections Log</h2>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{log.plateNumber}</h4>
                  <p className="text-xs text-slate-400">Inspected by {log.inspector} on {log.date}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{log.notes}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                    log.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {log.status === 'Completed' ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
