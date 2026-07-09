import React from 'react';
import { useAppStore } from './store/store';

// Importing Screens
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Trips from './pages/Trips';
import Fuel from './pages/Fuel';
import Maintenance from './pages/Maintenance';
import Inspections from './pages/Inspections';
import Breakdowns from './pages/Breakdowns';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Routes from './pages/Routes';

// Importing Lucide Icons
import {
  LayoutDashboard,
  Truck,
  Navigation,
  Fuel as FuelIcon,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Compass
} from 'lucide-react';

export default function App() {
  const { user, theme, activeTab, sidebarOpen, toggleTheme, setActiveTab, setSidebarOpen, logout, offlineInspections } = useAppStore();

  if (!user) {
    return <Login />;
  }

  // Sidebar Grouped Menu Mapping
  const menuGroups = [
    {
      title: 'Operational Intelligence',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'fleet', label: 'Vehicles', icon: <Truck size={18} /> },
        { id: 'trips', label: 'Dispatches & Trips', icon: <Navigation size={18} /> },
        { id: 'routes', label: 'Route Optimization', icon: <Compass size={18} /> }
      ]
    },
    {
      title: 'Logistics & Safety Ledger',
      items: [
        { id: 'fuel', label: 'Fuel Entries', icon: <FuelIcon size={18} /> },
        { id: 'maintenance', label: 'Maintenance Logs', icon: <Wrench size={18} /> },
        { id: 'inspections', label: 'Safety Inspections', icon: <ShieldCheck size={18} /> },
        { id: 'breakdowns', label: 'Breakdowns', icon: <AlertTriangle size={18} /> },
        { id: 'expenses', label: 'Expense Ledger', icon: <Receipt size={18} /> }
      ]
    },
    {
      title: 'Controls & Auditing',
      items: [
        { id: 'reports', label: 'Reports Engine', icon: <FileSpreadsheet size={18} /> },
        { id: 'settings', label: 'System Settings', icon: <SettingsIcon size={18} /> }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-darkbg text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Sidebar (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-darkcard border-r border-slate-200 dark:border-slate-800 transition-transform transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between`}>
        
        {/* Sidebar Header */}
        <div>
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                className="w-14 h-14 object-contain rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] dark:shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-500/20 transition-all duration-300 hover:scale-105" 
                alt="LEI Logo" 
              />
            </div>
            <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2">
                <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{group.title}</span>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all relative ${
                        activeTab === item.id
                          ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold border-l-4 border-blue-600 rounded-l-none'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>
                      
                      {/* Dynamic Smart Badges */}
                      {item.id === 'fleet' && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">198</span>
                      )}
                      {item.id === 'breakdowns' && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-red-500/10 text-red-500 rounded-full animate-pulse">1 Active</span>
                      )}
                      {item.id === 'inspections' && offlineInspections.length > 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-500 rounded-full">{offlineInspections.length} Sync</span>
                      )}
                      {item.id === 'fuel' && (
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" title="Pending audits exist" />
                      )}
                      {item.id === 'expenses' && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-600 rounded-full">1 Claim</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <div>
              <h4 className="text-xs font-bold truncate max-w-[110px]">{user.firstName} {user.lastName}</h4>
              <span className="text-[10px] text-slate-400 font-medium">{user.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            title="Log out of system"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen lg:pl-64 transition-all`}>
        
        {/* Top Header */}
        <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-darkcard/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <span className="hidden md:inline text-xs font-medium text-slate-400 uppercase tracking-widest">
              Live &bull; Region: Delhi NCR HQ
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Toggle theme mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications Indicator */}
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white dark:border-darkcard rounded-full" />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>

            {/* Profile Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow cursor-pointer transition-all hover:scale-105">
              {user.firstName[0]}
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main key={activeTab} className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'fleet' && <Fleet />}
          {activeTab === 'trips' && <Trips />}
          {activeTab === 'routes' && <Routes />}
          {activeTab === 'fuel' && <Fuel />}
          {activeTab === 'maintenance' && <Maintenance />}
          {activeTab === 'inspections' && <Inspections />}
          {activeTab === 'breakdowns' && <Breakdowns />}
          {activeTab === 'expenses' && <Expenses />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      {/* Sticky Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-darkcard/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around py-3 px-2 shadow-lg">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={18} />
          <span>Dash</span>
        </button>
        <button onClick={() => setActiveTab('fleet')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'fleet' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Truck size={18} />
          <span>Vehicles</span>
        </button>
        <button onClick={() => setActiveTab('trips')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'trips' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Navigation size={18} />
          <span>Trips</span>
        </button>
        <button onClick={() => setActiveTab('inspections')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'inspections' ? 'text-blue-600' : 'text-slate-400'}`}>
          <ShieldCheck size={18} />
          <span>Inspect</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}>
          <SettingsIcon size={18} />
          <span>Config</span>
        </button>
      </nav>
    </div>
  );
}
