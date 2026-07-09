import React from 'react';
import { useAppStore } from '../store/store';
import { 
  Truck, Navigation, Activity, Fuel, 
  Wrench, AlertTriangle, RefreshCw, Compass,
  PlusCircle, ShieldCheck, Flame, DollarSign, BellRing 
} from 'lucide-react';

export default function Dashboard() {
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const kpis = {
    totalVehicles: 240,
    activeVehicles: 198,
    tripsToday: 45,
    distanceTravelled: 12450,
    fleetUtilization: 82.5,
    fuelCost: 145200,
    maintenanceCost: 98400,
    fleetHealthScore: 89.2,
    breakdowns: 3,
    upcomingRenewals: 7
  };

  const quickActions = [
    { label: 'Register Vehicle', tab: 'fleet', color: 'bg-blue-600 hover:bg-blue-700 text-white', icon: <Truck size={16} /> },
    { label: 'Plan Optimized Route', tab: 'routes', color: 'bg-indigo-600 hover:bg-indigo-700 text-white', icon: <Compass size={16} /> },
    { label: 'Report Road Breakdown', tab: 'breakdowns', color: 'bg-red-600 hover:bg-red-700 text-white', icon: <AlertTriangle size={16} /> },
    { label: 'Log Fuel Invoice', tab: 'fuel', color: 'bg-amber-600 hover:bg-amber-700 text-white', icon: <Fuel size={16} /> },
  ];

  const vehiclePerformance = [
    { plate: 'DL-3C-AS-1294', score: 92, status: 'Healthy', type: 'Tata Intra V30' },
    { plate: 'MH-12-PQ-8830', score: 88, status: 'Healthy', type: 'Mahindra Bolero' },
    { plate: 'KA-03-MM-4112', score: 95, status: 'Healthy', type: 'Suzuki Carry' },
    { plate: 'HR-26-EE-9912', score: 45, status: 'Critical', type: 'Leyland Dost' }
  ];

  const alerts = [
    { time: '10:14 AM', type: 'Breakdown', message: 'HR-26-EE-9912 reported overheating on NH-48', color: 'text-red-500 border-red-500/20 bg-red-500/5' },
    { time: '09:30 AM', type: 'Fuel Claim', message: 'Amit Kumar logged ₹2,895 invoice (Verify Pending)', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5' },
    { time: '08:00 AM', type: 'Dispatch', message: 'DL-3C-AS-1294 departed Delhi HQ to Noida Sec 62', color: 'text-blue-500 border-blue-500/20 bg-blue-500/5' }
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Executive Intelligence</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Laser Experts India LLP &bull; Nationwide Logistics & Engineering Support</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <RefreshCw size={14} className="animate-spin" /> Sync Live Data
          </button>
        </div>
      </div>

      {/* Quick Action Commands Bar */}
      <div className="p-4 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Operational Quick Actions</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((act, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(act.tab)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] ${act.color}`}
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between metric-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Vehicles</span>
            <span className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl"><Truck size={18} /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold">{kpis.totalVehicles}</span>
            <span className="text-xs text-slate-400 block mt-1">{kpis.activeVehicles} active in dispatch</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between metric-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispatches today</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl"><Navigation size={18} /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold">{kpis.tripsToday}</span>
            <span className="text-xs text-slate-400 block mt-1">{kpis.distanceTravelled.toLocaleString()} km logged</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between metric-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle Health</span>
            <span className="p-2 bg-teal-50 dark:bg-teal-500/10 text-teal-600 rounded-xl"><Activity size={18} /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-teal-500">{kpis.fleetHealthScore}%</span>
            <span className="text-xs text-slate-400 block mt-1">Utilization: {kpis.fleetUtilization}%</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between metric-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fuel Cost</span>
            <span className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl"><Fuel size={18} /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹1.45L</span>
            <span className="text-xs text-slate-400 block mt-1">Avg ₹96.50/L</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between metric-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Breakdowns</span>
            <span className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl"><AlertTriangle size={18} /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-red-500">{kpis.breakdowns}</span>
            <span className="text-xs text-slate-400 block mt-1">{kpis.upcomingRenewals} scheduled service</span>
          </div>
        </div>
      </div>

      {/* Analytics Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Logistics & Usage Trends (Daily)</h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600"><span className="w-2 h-2 bg-blue-600 rounded-full" /> Distance (km)</span>
            </div>
          </div>
          
          {/* Custom vector bars */}
          <div className="h-64 flex items-end justify-between pt-6 border-b border-l border-slate-100 dark:border-slate-800 relative">
            <div className="absolute left-4 top-2 text-[10px] text-slate-400">2,500 km</div>
            <div className="absolute left-4 top-1/2 text-[10px] text-slate-400">1,250 km</div>

            <div className="flex flex-col items-center w-1/7 space-y-2">
              <span className="text-xs font-bold">1,200</span>
              <div className="w-10 bg-gradient-to-t from-blue-600/30 to-blue-600/80 hover:scale-x-105 rounded-t-md transition-all duration-300 shadow-md" style={{ height: '110px' }} />
              <span className="text-xs text-slate-500">Mon</span>
            </div>
            <div className="flex flex-col items-center w-1/7 space-y-2">
              <span className="text-xs font-bold">1,500</span>
              <div className="w-10 bg-gradient-to-t from-blue-600/30 to-blue-600/80 hover:scale-x-105 rounded-t-md transition-all duration-300 shadow-md" style={{ height: '135px' }} />
              <span className="text-xs text-slate-500">Tue</span>
            </div>
            <div className="flex flex-col items-center w-1/7 space-y-2">
              <span className="text-xs font-bold">1,800</span>
              <div className="w-10 bg-gradient-to-t from-blue-600/30 to-blue-600/80 hover:scale-x-105 rounded-t-md transition-all duration-300 shadow-md" style={{ height: '160px' }} />
              <span className="text-xs text-slate-500">Wed</span>
            </div>
            <div className="flex flex-col items-center w-1/7 space-y-2">
              <span className="text-xs font-bold">1,600</span>
              <div className="w-10 bg-gradient-to-t from-blue-600/30 to-blue-600/80 hover:scale-x-105 rounded-t-md transition-all duration-300 shadow-md" style={{ height: '145px' }} />
              <span className="text-xs text-slate-500">Thu</span>
            </div>
            <div className="flex flex-col items-center w-1/7 space-y-2">
              <span className="text-xs font-bold">2,100</span>
              <div className="w-10 bg-gradient-to-t from-blue-600/30 to-blue-600/80 hover:scale-x-105 rounded-t-md transition-all duration-300 shadow-md" style={{ height: '190px' }} />
              <span className="text-xs text-slate-500">Fri</span>
            </div>
            <div className="flex flex-col items-center w-1/7 space-y-2">
              <span className="text-xs font-bold">900</span>
              <div className="w-10 bg-gradient-to-t from-blue-600/20 to-blue-600/60 hover:scale-x-105 rounded-t-md transition-all duration-300 shadow-md" style={{ height: '80px' }} />
              <span className="text-xs text-slate-500">Sat</span>
            </div>
            <div className="flex flex-col items-center w-1/7 space-y-2">
              <span className="text-xs font-bold">400</span>
              <div className="w-10 bg-gradient-to-t from-blue-600/10 to-blue-600/40 hover:scale-x-105 rounded-t-md transition-all duration-300 shadow-md" style={{ height: '40px' }} />
              <span className="text-xs text-slate-500">Sun</span>
            </div>
          </div>
        </div>

        {/* Real-time Status Feed */}
        <div className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-1.5"><BellRing size={18} className="text-blue-500" /> Operational Alert Feed</h2>
            <div className="space-y-3">
              {alerts.map((al, idx) => (
                <div key={idx} className={`p-3.5 border rounded-xl flex flex-col gap-1 ${al.color}`}>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>{al.type}</span>
                    <span className="opacity-60">{al.time}</span>
                  </div>
                  <p className="text-xs font-medium">{al.message}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setActiveTab('trips')} className="w-full mt-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all text-center">
            Open Dispatch Panel
          </button>
        </div>
      </div>

      {/* Second Row: Vehicles Condition Indexes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Asset Condition & Performance Index</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehiclePerformance.map((veh, idx) => (
              <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">{veh.plate}</h4>
                  <span className="text-xs text-slate-400">{veh.type}</span>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    veh.status === 'Healthy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>{veh.status}</span>
                  <span className="block text-xs font-mono font-bold mt-1">{veh.score}% Health</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Efficiency Target</h2>
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Fleet Utilization Rate</span>
                <span>82.5%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: '82.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Inspections Compliance Target</span>
                <span>94.0%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '94%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Carbon Reduction Metric</span>
                <span>65.0%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
