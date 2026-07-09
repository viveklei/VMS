import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, ShieldCheck, Heart, AlertOctagon } from 'lucide-react';

export default function Fleet() {
  const [vehicles, setVehicles] = useState([
    { id: '1', plateNumber: 'DL-3C-AS-1294', make: 'Tata', model: 'Intra V30', category: 'Service Vehicle', branch: 'Delhi HQ', fuelType: 'Diesel', odometer: 42350, status: 'Active', health: 92.5 },
    { id: '2', plateNumber: 'MH-12-PQ-8830', make: 'Mahindra', model: 'Bolero Pik-Up', category: 'Cargo Truck', branch: 'Mumbai Branch', fuelType: 'Diesel', odometer: 78500, status: 'Active', health: 88.0 },
    { id: '3', plateNumber: 'KA-03-MM-4112', make: 'Maruti Suzuki', model: 'Super Carry', category: 'Service Vehicle', branch: 'Bengaluru Branch', fuelType: 'CNG', odometer: 15400, status: 'In Service', health: 95.0 },
    { id: '4', plateNumber: 'HR-26-EE-9912', make: 'Ashok Leyland', model: 'Dost+', category: 'Cargo Truck', branch: 'Gurugram Warehouse', fuelType: 'Diesel', odometer: 120500, status: 'Breakdown', health: 45.0 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newMake, setNewMake] = useState('');
  const [newBranch, setNewBranch] = useState('Delhi HQ');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newModel) return;

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? {
        ...v,
        plateNumber: newPlate,
        make: newMake || v.make,
        model: newModel,
        branch: newBranch
      } : v));
      setEditingVehicle(null);
    } else {
      const added = {
        id: `v-${Date.now()}`,
        plateNumber: newPlate,
        make: newMake || 'Tata',
        model: newModel,
        category: 'Service Vehicle',
        branch: newBranch,
        fuelType: 'Diesel',
        odometer: 0,
        status: 'Active',
        health: 100
      };
      setVehicles([added, ...vehicles]);
    }
    
    setShowModal(false);
    setNewPlate('');
    setNewModel('');
    setNewMake('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from the registry?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vessel & Vehicle Registry</h1>
          <p className="text-sm text-slate-500">Logistics lifecycle tracking for LEI Service Operations</p>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setNewPlate('');
            setNewModel('');
            setNewMake('');
            setNewBranch('Delhi HQ');
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus size={18} /> Register Vehicle
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search license plate, model..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 transition-all w-full sm:w-auto justify-center">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Vehicle Grid Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                v.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                v.status === 'In Service' ? 'bg-amber-500/10 text-amber-500' :
                'bg-red-500/10 text-red-500'
              }`}>{v.status}</span>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                <Heart size={14} className={v.health > 80 ? 'text-green-500' : 'text-red-500'} />
                {v.health}% Health
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">{v.plateNumber}</h3>
              <p className="text-sm text-slate-500">{v.make} {v.model}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div>
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="font-semibold">{v.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Mileage Odo</span>
                <span className="font-semibold">{v.odometer.toLocaleString()} km</span>
              </div>
            </div>

            {/* Smart Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => {
                  setEditingVehicle(v);
                  setNewPlate(v.plateNumber);
                  setNewMake(v.make);
                  setNewModel(v.model);
                  setNewBranch(v.branch);
                  setShowModal(true);
                }}
                className="w-1/2 py-2 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-center"
              >
                Edit Details
              </button>
              <button
                onClick={() => handleDelete(v.id)}
                className="w-1/2 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-xs font-semibold rounded-xl transition-all text-center"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration & Editing Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-bold mb-4">{editingVehicle ? 'Edit Vehicle Attributes' : 'Register New Asset'}</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Plate Number *</label>
                <input
                  type="text"
                  placeholder="e.g. DL-3C-AS-1294"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Tata"
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Model *</label>
                  <input
                    type="text"
                    placeholder="e.g. Intra V30"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Branch Allocation</label>
                <select
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                >
                  <option value="Delhi HQ">Delhi HQ</option>
                  <option value="Mumbai Branch">Mumbai Branch</option>
                  <option value="Bengaluru Branch">Bengaluru Branch</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                  }}
                  className="w-1/2 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
                >
                  {editingVehicle ? 'Update Asset' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
