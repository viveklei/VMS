import React from 'react';
import { useAppStore } from '../store/store';
import { ShieldAlert, Building, Terminal, UserCheck } from 'lucide-react';

export default function Settings() {
  const auditLogs = useAppStore((state) => state.auditLogs);
  const roles = ['Super Admin', 'Fleet Manager', 'HR Manager', 'Service Manager', 'Branch Manager', 'Engineer', 'Driver', 'Viewer'];
  const permissions = ['Create', 'Read', 'Update', 'Delete', 'Approve', 'Export', 'Manage Settings'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Controls & Settings</h1>
        <p className="text-sm text-slate-500">Configure nationwide branches, settings, and authorization scopes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Configuration */}
        <div className="lg:col-span-1 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-1.5"><Building size={20} className="text-blue-500" /> Branch Allocation</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <h4 className="text-sm font-semibold">Delhi HQ</h4>
                <span className="text-xs text-slate-400">code: LEI-DEL-01</span>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-medium">Primary</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <h4 className="text-sm font-semibold">Mumbai Branch</h4>
                <span className="text-xs text-slate-400">code: LEI-BOM-02</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <h4 className="text-sm font-semibold">Bengaluru Branch</h4>
                <span className="text-xs text-slate-400">code: LEI-BLR-03</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs list */}
        <div className="lg:col-span-1 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-1.5"><Terminal size={20} className="text-indigo-500" /> Live Audit Trail</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 rounded uppercase">{log.module}</span>
                  <span className="text-slate-400 font-mono">{log.timestamp.split(' ')[1] || log.timestamp}</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{log.action}: {log.details}</p>
                <span className="text-[10px] text-slate-400 block font-medium">By {log.user}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Matrix */}
        <div className="lg:col-span-3 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-1.5"><ShieldAlert size={20} className="text-red-500" /> RBAC Permission Map</h2>
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold bg-slate-50 dark:bg-slate-800/40">
                  <th className="p-3 text-slate-500">Role</th>
                  {permissions.map((perm, idx) => (
                    <th key={idx} className="p-3 text-center text-slate-500">{perm}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                {roles.map((role, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{role}</td>
                    {permissions.map((perm, pIdx) => {
                      const hasAccess = 
                        role === 'Super Admin' ||
                        (role === 'Fleet Manager' && ['Create', 'Read', 'Update', 'Approve', 'Export'].includes(perm)) ||
                        (role === 'HR Manager' && ['Create', 'Read', 'Update'].includes(perm) && perm !== 'Approve') ||
                        (role === 'Service Manager' && ['Create', 'Read', 'Update', 'Approve'].includes(perm)) ||
                        (role === 'Branch Manager' && ['Create', 'Read', 'Update', 'Export'].includes(perm)) ||
                        (role === 'Engineer' && ['Create', 'Read'].includes(perm)) ||
                        (role === 'Driver' && perm === 'Read') ||
                        (role === 'Viewer' && perm === 'Read');
                      return (
                        <td key={pIdx} className="p-3 text-center">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${hasAccess ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
