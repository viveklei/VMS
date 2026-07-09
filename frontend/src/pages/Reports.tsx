import React from 'react';
import { FileDown, Table, FileSpreadsheet, Layers, ShieldCheck, MailWarning } from 'lucide-react';

export default function Reports() {
  const exportData = (type: string) => {
    alert(`Exporting ${type} as CSV format. Your browser download will begin shortly.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reporting Engine</h1>
        <p className="text-sm text-slate-500">Download system data, fleet efficiency audits, and logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card: Fleet Utilization */}
        <div className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl"><Layers size={20} /></span>
            <span className="text-[10px] uppercase font-bold text-slate-400">PDF &bull; CSV</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Fleet Operations Audit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Export details of registered vehicles, current locations, odometers, and active branch departments.</p>
          </div>
          <button
            onClick={() => exportData('Fleet Operations Audit')}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <FileDown size={14} /> Export Dataset
          </button>
        </div>

        {/* Card: Fuel Receipts & Efficiency */}
        <div className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl"><FileSpreadsheet size={20} /></span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Excel &bull; CSV</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Fuel Efficiency Report</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Details on liters consumed, average fuel efficiency (km/l), petrol card usage, and vendor costs.</p>
          </div>
          <button
            onClick={() => exportData('Fuel Efficiency Report')}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <FileDown size={14} /> Export Dataset
          </button>
        </div>

        {/* Card: Document Expiry Alerts */}
        <div className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl"><MailWarning size={20} /></span>
            <span className="text-[10px] uppercase font-bold text-slate-400">PDF Only</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Vehicle Compliance & Document Expiry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit on expiring insurances, RC documents, driver license durations, and PUC pollution validations.</p>
          </div>
          <button
            onClick={() => exportData('Compliance Audit')}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <FileDown size={14} /> Export Dataset
          </button>
        </div>
      </div>
    </div>
  );
}
