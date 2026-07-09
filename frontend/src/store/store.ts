import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  branchId?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  category: string;
  branch: string;
  fuelType: string;
  fuelCapacity: number;
  odometer: number;
  status: 'Available' | 'Assigned' | 'Active' | 'Under Maintenance' | 'Breakdown' | 'Inactive' | 'Retired';
  health: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driver: string;
  customer: string;
  origin: string;
  destination: string;
  status: 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
  startOdo: number;
  endOdo: number | null;
  startTime: string;
  endTime: string | null;
  purpose: string;
}

export interface FuelEntry {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driver: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  vendor: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  plateNumber: string;
  serviceType: 'Preventive' | 'Corrective' | 'Routine';
  description: string;
  cost: number;
  odometer: number;
  serviceDate: string;
  completedDate: string | null;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  vendorName: string;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  plateNumber: string;
  inspector: string;
  date: string;
  odometer: number;
  status: 'Completed' | 'Failed';
  notes: string;
  brakes: string;
  lights: string;
  mirrors: string;
  tyres: string;
}

export interface Breakdown {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driver: string;
  location: string;
  reportedAt: string;
  description: string;
  status: 'Reported' | 'In Progress' | 'Resolved';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  resolutionNotes?: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}

interface AppStore {
  user: User | null;
  token: string | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeTab: string;
  
  // Data lists
  vehicles: Vehicle[];
  trips: Trip[];
  fuelEntries: FuelEntry[];
  maintenanceRecords: MaintenanceRecord[];
  inspections: Inspection[];
  breakdowns: Breakdown[];
  expenses: Expense[];
  notifications: any[];
  auditLogs: AuditLog[];
  offlineInspections: any[];
  
  // Auth actions
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  
  // Audit logger helper
  logAction: (action: string, module: string, details: string) => void;

  // CRUD Actions
  addVehicle: (v: Omit<Vehicle, 'id' | 'health' | 'status'>) => void;
  editVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  startTrip: (trip: Omit<Trip, 'id' | 'status' | 'startTime' | 'endTime' | 'endOdo'>) => void;
  endTrip: (id: string, endOdo: number) => void;

  addFuel: (fuel: Omit<FuelEntry, 'id' | 'status' | 'totalCost'>) => void;
  approveFuel: (id: string) => void;
  deleteFuel: (id: string) => void;

  addMaintenance: (m: Omit<MaintenanceRecord, 'id' | 'status' | 'completedDate'>) => void;
  completeMaintenance: (id: string) => void;

  addInspection: (ins: Omit<Inspection, 'id' | 'date'>) => void;
  addOfflineInspection: (ins: any) => void;
  syncOfflineInspections: () => void;
  clearOfflineInspections: () => void;

  addBreakdown: (b: Omit<Breakdown, 'id' | 'status' | 'reportedAt'>) => void;
  resolveBreakdown: (id: string, notes: string) => void;

  addExpense: (e: Omit<Expense, 'id' | 'status'>) => void;
  approveExpense: (id: string) => void;
  
  addNotification: (title: string, message: string, type: string) => void;
  markNotificationRead: (id: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  token: null,
  theme: 'light',
  sidebarOpen: true,
  activeTab: 'dashboard',
  offlineInspections: JSON.parse(localStorage.getItem('offline_inspections') || '[]'),

  // Seed Data Initializers
  vehicles: [
    { id: 'v1', plateNumber: 'DL-3C-AS-1294', make: 'Tata', model: 'Intra V30', category: 'Service Vehicle', branch: 'Delhi HQ', fuelType: 'Diesel', fuelCapacity: 35, odometer: 42350, status: 'Active', health: 92.5 },
    { id: 'v2', plateNumber: 'MH-12-PQ-8830', make: 'Mahindra', model: 'Bolero Pik-Up', category: 'Cargo Truck', branch: 'Mumbai Branch', fuelType: 'Diesel', fuelCapacity: 60, odometer: 78500, status: 'Active', health: 88.0 },
    { id: 'v3', plateNumber: 'KA-03-MM-4112', make: 'Maruti Suzuki', model: 'Super Carry', category: 'Service Vehicle', branch: 'Bengaluru Branch', fuelType: 'CNG', fuelCapacity: 70, odometer: 15400, status: 'Available', health: 95.0 },
    { id: 'v4', plateNumber: 'HR-26-EE-9912', make: 'Ashok Leyland', model: 'Dost+', category: 'Cargo Truck', branch: 'Gurugram Warehouse', fuelType: 'Diesel', fuelCapacity: 40, odometer: 120500, status: 'Breakdown', health: 45.0 }
  ],
  trips: [
    { id: 't1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', driver: 'Amit Kumar', customer: 'Samsung Service Center', origin: 'Delhi HQ', destination: 'Noida Sec 62', status: 'Completed', startOdo: 42200, endOdo: 42280, startTime: '2026-06-16T08:00:00Z', endTime: '2026-06-16T12:00:00Z', purpose: 'Logistics support' },
    { id: 't2', vehicleId: 'v2', plateNumber: 'MH-12-PQ-8830', driver: 'Suresh Patil', customer: 'L&T Project Site', origin: 'Mumbai Branch', destination: 'Pune Chinchwad', status: 'Active', startOdo: 78450, endOdo: null, startTime: '2026-06-17T05:30:00Z', endTime: null, purpose: 'Parts dispatch' }
  ],
  fuelEntries: [
    { id: 'f1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', driver: 'Amit Kumar', date: '2026-06-15', odometer: 42100, liters: 30, pricePerLiter: 96.50, totalCost: 2895, vendor: 'Indian Oil Sec 63', status: 'Approved' },
    { id: 'f2', vehicleId: 'v2', plateNumber: 'MH-12-PQ-8830', driver: 'Suresh Patil', date: '2026-06-16', odometer: 78400, liters: 50, pricePerLiter: 104.20, totalCost: 5210, vendor: 'HP Pump Pune', status: 'Pending' }
  ],
  maintenanceRecords: [
    { id: 'm1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', serviceType: 'Routine', description: 'Engine Oil and Filter Replacement', cost: 3500, odometer: 40000, serviceDate: '2026-05-10', completedDate: '2026-05-10', status: 'Completed', vendorName: 'Tata Workshop' },
    { id: 'm2', vehicleId: 'v2', plateNumber: 'MH-12-PQ-8830', serviceType: 'Preventive', description: 'Brake Pad Check & Suspension Alignment', cost: 8200, odometer: 79000, serviceDate: '2026-06-20', completedDate: null, status: 'Scheduled', vendorName: 'Mahindra Service' }
  ],
  inspections: [
    { id: 'i1', vehicleId: 'v1', plateNumber: 'DL-3C-AS-1294', inspector: 'Super Admin', date: '2026-06-16', odometer: 42300, status: 'Completed', notes: 'All functional checks passed.', brakes: 'Pass', lights: 'Pass', mirrors: 'Pass', tyres: 'Pass' },
    { id: 'i2', vehicleId: 'v4', plateNumber: 'HR-26-EE-9912', inspector: 'Super Admin', date: '2026-06-17', odometer: 120500, status: 'Failed', notes: 'Tyres worn out, hazard lights dysfunctional.', brakes: 'Fail', lights: 'Fail', mirrors: 'Pass', tyres: 'Fail' }
  ],
  breakdowns: [
    { id: 'b1', vehicleId: 'v4', plateNumber: 'HR-26-EE-9912', driver: 'Amit Kumar', location: 'NH-48 Highway, Near Manesar Toll', reportedAt: '2026-06-17 06:12', description: 'Engine overheated, coolant vapor leak.', status: 'Reported', severity: 'Critical' }
  ],
  expenses: [
    { id: 'e1', vehicleId: 'v1', category: 'Toll Tax', amount: 350, date: '2026-06-16', description: 'Yamuna Expressway Toll Ticket', status: 'Approved' },
    { id: 'e2', vehicleId: 'v2', category: 'Driver Allowance', amount: 1200, date: '2026-06-17', description: 'Overnight allowance', status: 'Pending' }
  ],
  notifications: [
    { id: 'n1', title: 'Breakdown Raised', message: 'Vehicle HR-26-EE-9912 reported breakdown on NH-48.', type: 'Breakdown', read: false },
    { id: 'n2', title: 'Fuel Claim Approval', message: 'Verify pending fuel entry of ₹5,210 for MH-12-PQ-8830.', type: 'Fuel', read: false }
  ],
  auditLogs: [
    { id: 'a1', user: 'admin@fleetops.lei', action: 'Login', module: 'Auth', timestamp: '2026-06-17 10:00:00', details: 'Successful credentials sign-in.' }
  ],

  // Actions implementations
  login: (user, token) => {
    set({ user, token });
    get().logAction('Login', 'Auth', `User logged in with email ${user.email}`);
  },
  logout: () => {
    const user = get().user;
    if (user) {
      get().logAction('Logout', 'Auth', `User logged out: ${user.email}`);
    }
    set({ user: null, token: null, activeTab: 'dashboard' });
  },
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  logAction: (action, module, details) => {
    const userEmail = get().user?.email || 'System';
    const log: AuditLog = {
      id: `a-${Date.now()}`,
      user: userEmail,
      action,
      module,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details
    };
    set(state => ({ auditLogs: [log, ...state.auditLogs] }));
  },

  addVehicle: (v) => {
    const id = `v-${Date.now()}`;
    const vehicle: Vehicle = {
      ...v,
      id,
      health: 100,
      status: 'Available'
    };
    set(state => ({ vehicles: [vehicle, ...state.vehicles] }));
    get().logAction('Create', 'Vehicles', `Registered new vehicle plate ${v.plateNumber}`);
  },
  editVehicle: (id, updates) => {
    set(state => ({
      vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
    get().logAction('Update', 'Vehicles', `Modified attributes for vehicle ID ${id}`);
  },
  deleteVehicle: (id) => {
    const vehicle = get().vehicles.find(v => v.id === id);
    set(state => ({
      vehicles: state.vehicles.filter(v => v.id !== id)
    }));
    if (vehicle) {
      get().logAction('Delete', 'Vehicles', `Removed vehicle plate ${vehicle.plateNumber}`);
    }
  },

  startTrip: (tripData) => {
    const id = `t-${Date.now()}`;
    const trip: Trip = {
      ...tripData,
      id,
      status: 'Active',
      startTime: new Date().toISOString(),
      endTime: null,
      endOdo: null
    };
    set(state => ({
      trips: [trip, ...state.trips],
      vehicles: state.vehicles.map(v => v.id === tripData.vehicleId ? { ...v, status: 'Active' } : v)
    }));
    get().logAction('Start', 'Trips', `Started dispatch trip ${id} for plate ${trip.plateNumber}`);
  },
  endTrip: (id, endOdo) => {
    const trip = get().trips.find(t => t.id === id);
    if (!trip) return;
    
    const distance = endOdo - trip.startOdo;
    set(state => ({
      trips: state.trips.map(t => t.id === id ? { ...t, status: 'Completed', endOdo, endTime: new Date().toISOString() } : t),
      vehicles: state.vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available', odometer: endOdo } : v)
    }));
    get().logAction('Complete', 'Trips', `Ended trip ${id}, travelled ${distance} km`);
  },

  addFuel: (fuelData) => {
    const id = `f-${Date.now()}`;
    const entry: FuelEntry = {
      ...fuelData,
      id,
      totalCost: fuelData.liters * fuelData.pricePerLiter,
      status: 'Pending'
    };
    set(state => ({ fuelEntries: [entry, ...state.fuelEntries] }));
    get().addNotification('Fuel Log Submitted', `New fuel entry for ${entry.plateNumber} requires approval.`, 'Fuel');
    get().logAction('Create', 'Fuel', `Logged fuel refill of ${fuelData.liters} L for ${entry.plateNumber}`);
  },
  approveFuel: (id) => {
    const entry = get().fuelEntries.find(f => f.id === id);
    if (!entry) return;
    set(state => ({
      fuelEntries: state.fuelEntries.map(f => f.id === id ? { ...f, status: 'Approved' } : f)
    }));
    get().logAction('Approve', 'Fuel', `Approved fuel purchase of ₹${entry.totalCost} for ${entry.plateNumber}`);
  },
  deleteFuel: (id) => {
    set(state => ({ fuelEntries: state.fuelEntries.filter(f => f.id !== id) }));
  },

  addMaintenance: (mData) => {
    const id = `m-${Date.now()}`;
    const rec: MaintenanceRecord = {
      ...mData,
      id,
      status: 'Scheduled',
      completedDate: null
    };
    set(state => ({
      maintenanceRecords: [rec, ...state.maintenanceRecords],
      vehicles: state.vehicles.map(v => v.id === mData.vehicleId ? { ...v, status: 'Under Maintenance' } : v)
    }));
    get().logAction('Create', 'Maintenance', `Scheduled maintenance for vehicle ${rec.plateNumber}`);
  },
  completeMaintenance: (id) => {
    const rec = get().maintenanceRecords.find(m => m.id === id);
    if (!rec) return;
    set(state => ({
      maintenanceRecords: state.maintenanceRecords.map(m => m.id === id ? { ...m, status: 'Completed', completedDate: new Date().toISOString().split('T')[0] } : m),
      vehicles: state.vehicles.map(v => v.id === rec.vehicleId ? { ...v, status: 'Available', health: Math.min(v.health + 15, 100) } : v)
    }));
    get().logAction('Complete', 'Maintenance', `Completed service for vehicle ${rec.plateNumber}`);
  },

  addInspection: (insData) => {
    const id = `i-${Date.now()}`;
    const ins: Inspection = {
      ...insData,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    set(state => ({ inspections: [ins, ...state.inspections] }));
    if (ins.status === 'Failed') {
      get().addNotification('Inspection Failure', `Safety checks failed for vehicle ${ins.plateNumber}.`, 'Inspection');
      set(state => ({
        vehicles: state.vehicles.map(v => v.id === insData.vehicleId ? { ...v, health: Math.max(v.health - 25, 0) } : v)
      }));
    }
    get().logAction('Audit', 'Inspections', `Logged safety inspection for ${ins.plateNumber} (Result: ${ins.status})`);
  },
  syncOfflineInspections: () => {
    const offline = get().offlineInspections;
    if (offline.length === 0) return;
    set(state => ({
      inspections: [...offline, ...state.inspections],
      offlineInspections: []
    }));
    localStorage.setItem('offline_inspections', '[]');
    get().logAction('Sync', 'Inspections', `Synchronized ${offline.length} offline inspection logs to database.`);
  },
  clearOfflineInspections: () => {
    set({ offlineInspections: [] });
    localStorage.setItem('offline_inspections', '[]');
  },
  addOfflineInspection: (inspection) => set((state) => {
    const list = [...state.offlineInspections, inspection];
    localStorage.setItem('offline_inspections', JSON.stringify(list));
    return { offlineInspections: list };
  }),

  addBreakdown: (bData) => {
    const id = `b-${Date.now()}`;
    const b: Breakdown = {
      ...bData,
      id,
      status: 'Reported',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    set(state => ({
      breakdowns: [b, ...state.breakdowns],
      vehicles: state.vehicles.map(v => v.id === bData.vehicleId ? { ...v, status: 'Breakdown', health: Math.max(v.health - 35, 10) } : v)
    }));
    get().addNotification('Breakdown Reported', `Emergency breakdown filed for vehicle ${b.plateNumber}.`, 'Breakdown');
    get().logAction('Report', 'Breakdowns', `Filed emergency breakdown ticket for ${b.plateNumber} at ${b.location}`);
  },
  resolveBreakdown: (id, notes) => {
    const b = get().breakdowns.find(item => item.id === id);
    if (!b) return;
    set(state => ({
      breakdowns: state.breakdowns.map(item => item.id === id ? { ...item, status: 'Resolved', resolutionNotes: notes } : item),
      vehicles: state.vehicles.map(v => v.id === b.vehicleId ? { ...v, status: 'Available', health: Math.min(v.health + 20, 95) } : v)
    }));
    get().logAction('Resolve', 'Breakdowns', `Resolved breakdown ticket ${id} for ${b.plateNumber}`);
  },

  addExpense: (eData) => {
    const id = `e-${Date.now()}`;
    const exp: Expense = {
      ...eData,
      id,
      status: 'Pending'
    };
    set(state => ({ expenses: [exp, ...state.expenses] }));
    get().addNotification('Expense Claim Filed', `New claim of ₹${exp.amount} for ${exp.category} registered.`, 'Expense');
    get().logAction('Create', 'Expenses', `Filed expense claim of ₹${exp.amount} for category ${exp.category}`);
  },
  approveExpense: (id) => {
    const exp = get().expenses.find(item => item.id === id);
    if (!exp) return;
    set(state => ({
      expenses: state.expenses.map(item => item.id === id ? { ...item, status: 'Approved' } : item)
    }));
    get().logAction('Approve', 'Expenses', `Approved expense claim of ₹${exp.amount} for vehicle ID ${exp.vehicleId}`);
  },

  addNotification: (title, message, type) => {
    const notif = {
      id: `n-${Date.now()}`,
      title,
      message,
      type,
      read: false
    };
    set(state => ({ notifications: [notif, ...state.notifications] }));
  },
  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },
}));
