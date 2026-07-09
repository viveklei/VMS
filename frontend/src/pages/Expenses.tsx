import React, { useState } from 'react';
import { IndianRupee, Plus, FileText, CheckCircle, Clock } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([
    { id: '1', vehicleId: 'DL-3C-AS-1294', category: 'Toll Tax', amount: 350.00, date: '2026-06-16', description: 'Yamuna Expressway Toll Ticket', status: 'Approved' },
    { id: '2', vehicleId: 'MH-12-PQ-8830', category: 'Driver Allowance', amount: 1200.00, date: '2026-06-17', description: 'Overnight journey food & accommodation allowance', status: 'Pending' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState('Toll Tax');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const added = {
      id: `e-${Date.now()}`,
      vehicleId: vehicle || 'DL-3C-AS-1294',
      category,
      amount: parseFloat(amount) || 0,
      date: new Date().toISOString().split('T')[0],
      description: description || 'Miscellaneous expense',
      status: 'Pending'
    };
    setExpenses([added, ...expenses]);
    setShowModal(false);
    setVehicle('');
    setAmount('');
    setDescription('');
  };

  const handleApprove = (id: string) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: 'Approved' } : exp));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense Ledger & Claims</h1>
          <p className="text-sm text-slate-500">Track and approve trip tolls, repairs, and allowances</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus size={18} /> Add Expense Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Reimbursements</span>
          <h3 className="text-2xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">₹350.00</h3>
        </div>
        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
          <h3 className="text-2xl font-extrabold mt-1 text-amber-500">₹1,200.00</h3>
        </div>
        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total logged this month</span>
          <h3 className="text-2xl font-extrabold mt-1 text-blue-600">₹1,550.00</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Category</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Notes</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{exp.vehicleId}</td>
                  <td className="p-4 font-semibold">{exp.category}</td>
                  <td className="p-4 font-extrabold text-slate-900 dark:text-white">₹{exp.amount.toLocaleString()}</td>
                  <td className="p-4 text-xs">{exp.date}</td>
                  <td className="p-4 text-xs text-slate-500 max-w-xs truncate">{exp.description}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                      exp.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {exp.status === 'Approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {exp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {exp.status === 'Pending' && (
                      <button
                        onClick={() => handleApprove(exp.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/10"
                      >
                        Approve Claim
                      </button>
                    )}
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
            <h3 className="text-lg font-bold mb-4">Add Expense Entry</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Vehicle Plate ID</label>
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
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  >
                    <option value="Toll Tax">Toll Tax</option>
                    <option value="Driver Allowance">Driver Allowance</option>
                    <option value="Emergency Repairs">Emergency Repairs</option>
                    <option value="Fines/Permits">Fines/Permits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Amount (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Claim Details</label>
                <textarea
                  placeholder="e.g. Yamuna Highway toll booth receipt..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl h-24 resize-none"
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
                  Log Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
