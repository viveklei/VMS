import React, { useState, useEffect, useRef } from 'react';
import { Compass, Play, MapPin, Layers, Send, Sparkles, Navigation2, CheckCircle2, RefreshCw, Locate, Plus, Trash2, PlusCircle } from 'lucide-react';

declare const L: any;

export default function Routes() {
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const simMarkerRef = useRef<any>(null);
  const currentTileUrlRef = useRef<string>('');

  const [mapLayer, setMapLayer] = useState<'street' | 'satellite' | 'terrain' | 'hybrid'>('street');
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [optimizationGoal, setOptimizationGoal] = useState('fastest');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeRoute, setActiveRoute] = useState<any>(null);

  // Dynamic customer stops list state
  const [customerStops, setCustomerStops] = useState<any[]>([]);

  // AI Copilot state
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'AI', text: 'Hi! I am your Routing Copilot. I can help optimize stop sequence, check traffic delays, and configure dispatcher zones. Try asking me "Suggest optimal route for Mumbai".' }
  ]);

  const [isSyncingZoho, setIsSyncingZoho] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [assignedVehicle, setAssignedVehicle] = useState('Tata Intra (DL-3C-AS-1294)');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [liveLocation, setLiveLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Dynamic start point and stops destination inputs with suggestions (spanning all India)
  const [startPointInput, setStartPointInput] = useState('');
  const [startCoords, setStartCoords] = useState<[number, number]>([20.5937, 78.9629]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [startMode, setStartMode] = useState<'gps' | 'address' | 'customer'>('customer');
  const [isGeocodingStart, setIsGeocodingStart] = useState(false);
  const [isGeocodingDest, setIsGeocodingDest] = useState(false);

  const [destinations, setDestinations] = useState<Array<{ name: string; coords: [number, number]; showSuggestions?: boolean; inputVal: string }>>([
    { name: '', coords: [0, 0], inputVal: '' }
  ]);

  const addDestinationField = () => {
    setDestinations([...destinations, { name: '', coords: [0, 0], inputVal: '', showSuggestions: false }]);
  };

  const removeDestinationField = (index: number) => {
    const updated = [...destinations];
    updated.splice(index, 1);
    setDestinations(updated);
  };

  const handleUpdateDestinationInput = (index: number, val: string) => {
    const updated = [...destinations];
    updated[index].inputVal = val;
    updated[index].showSuggestions = true;
    setDestinations(updated);
  };

  const handleSelectDestinationSuggestion = async (index: number, stop: any) => {
    const updated = [...destinations];
    updated[index].name = stop.name;
    updated[index].inputVal = stop.name;
    updated[index].coords = stop.coords;
    updated[index].showSuggestions = false;
    setDestinations(updated);

    setIsGeocodingDest(true);
    try {
      const res = await fetch(`http://localhost:5000/zoho/customers/${stop.contactId}`);
      if (res.ok) {
        const details = await res.json();
        if (details.coords) {
          const fresh = [...destinations];
          fresh[index].coords = details.coords;
          setDestinations(fresh);
        }
      }
    } catch (e) {
      console.warn('On-demand precise geocoding failed, using list coordinates fallback:', e);
    } finally {
      setIsGeocodingDest(false);
    }
  };

  // Haversine distance calculator in kilometers
  const getDistance = (coords1: [number, number], coords2: [number, number]): number => {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleRequestLiveLocation = () => {
    if (!navigator.geolocation) {
      const fallbackCoords: [number, number] = [28.6304, 77.2177];
      setLiveLocation(fallbackCoords);
      setStartPointInput('Live GPS Position (Simulated)');
      setStartCoords(fallbackCoords);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(fallbackCoords, 13);
      }
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setLiveLocation(coords);
        setStartPointInput('Live GPS Position (Active)');
        setStartCoords(coords);
        setIsLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 13);
        }
      },
      (error) => {
        console.warn('Geolocation request failed, falling back to simulated location:', error);
        setIsLocating(false);
        const fallbackCoords: [number, number] = [28.6304, 77.2177];
        setLiveLocation(fallbackCoords);
        setStartPointInput('Live GPS Position (Fallback)');
        setStartCoords(fallbackCoords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(fallbackCoords, 13);
        }
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const syncZohoCustomers = async () => {
    setIsSyncingZoho(true);
    try {
      const res = await fetch('http://localhost:5000/zoho/customers');
      if (!res.ok) throw new Error('Zoho Books API returned failure response');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCustomerStops(data);
        setSelectedStops([data[0].name]);
        // Set default starting point and first destination to real Zoho customers
        setStartPointInput(data[0].name);
        setStartCoords(data[0].coords);
        if (data.length > 1) {
          setDestinations([
            { name: data[1].name, coords: data[1].coords, inputVal: data[1].name, showSuggestions: false }
          ]);
        }
      }
    } catch (err: any) {
      console.log('Unable to load Zoho Books customers live:', err.message);
    } finally {
      setIsSyncingZoho(false);
    }
  };

  // 1. Fetch Customers dynamically from Zoho Books Backend API
  useEffect(() => {
    syncZohoCustomers();
  }, []);

  // 2. Leaflet Map Synchronization
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.getElementById('map-element');
      if (!container) return;

      let tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      if (mapLayer === 'satellite') {
        tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      } else if (mapLayer === 'terrain') {
        tileUrl = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      } else if (mapLayer === 'hybrid') {
        tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      }

      if (!mapInstanceRef.current) {
        // Center dynamically on India to show nationwide coverage
        const centerCoords: [number, number] = [20.5937, 78.9629];
        const map = L.map('map-element', { zoomControl: false }).setView(centerCoords, 5);
        mapInstanceRef.current = map;
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const tiles = L.tileLayer(tileUrl, {
          maxZoom: 19,
          attribution: '© Google Maps'
        }).addTo(map);
        tileLayerRef.current = tiles;
        currentTileUrlRef.current = tileUrl;

        markersGroupRef.current = L.featureGroup().addTo(map);

        // Invalidate map layout size after initial load & on window resize
        setTimeout(() => map.invalidateSize(), 300);
        window.addEventListener('resize', () => map.invalidateSize());
      } else {
        if (tileLayerRef.current && currentTileUrlRef.current !== tileUrl) {
          tileLayerRef.current.setUrl(tileUrl);
          currentTileUrlRef.current = tileUrl;
        }
      }

      // Render Markers
      const markersGroup = markersGroupRef.current;
      if (markersGroup) {
        markersGroup.clearLayers();

        // 1. Draw Start Location Pin
        const activeStartCoords = (startMode === 'gps' && liveLocation) ? liveLocation : startCoords;
        if (activeStartCoords && activeStartCoords[0] !== 0) {
          const startIconHtml = `<div style="background-color: #10B981; width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; font-weight: bold;">S</div>`;
          const startIcon = L.divIcon({
            html: startIconHtml,
            className: 'start-pin',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          L.marker(activeStartCoords, { icon: startIcon })
            .bindPopup(`<strong>Start: ${startPointInput || 'Starting Location'}</strong>`)
            .addTo(markersGroup);
        }

        // 2. Draw active destination route stops
        destinations.forEach((dest, idx) => {
          if (dest.coords && dest.coords[0] !== 0) {
            const destIconHtml = `<div style="background-color: #EF4444; width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; font-weight: bold;">${idx + 1}</div>`;
            const destIcon = L.divIcon({
              html: destIconHtml,
              className: 'dest-pin',
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            });
            L.marker(dest.coords, { icon: destIcon })
              .bindPopup(`<strong>Stop #${idx + 1}: ${dest.name || dest.inputVal}</strong>`)
              .addTo(markersGroup);
          }
        });

        // 3. Draw live location marker and proximity coverage zone
        if (liveLocation) {
          const liveIconHtml = `<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);"></div>`;
          const liveIcon = L.divIcon({
            html: liveIconHtml,
            className: 'live-pin',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          L.marker(liveLocation, { icon: liveIcon })
            .bindPopup('<strong>Current Location</strong>')
            .addTo(markersGroup);

          L.circle(liveLocation, {
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.05,
            radius: 15000,
            weight: 1.5,
            dashArray: '4, 6'
          }).bindPopup('<strong>15km Proximity Zone</strong>').addTo(markersGroup);
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [mapLayer, selectedStops, customerStops, liveLocation, startCoords, destinations, startMode]);

  // Clean map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        window.removeEventListener('resize', () => mapInstanceRef.current?.invalidateSize());
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleStopToggle = (name: string) => {
    if (selectedStops.includes(name)) {
      setSelectedStops(selectedStops.filter(s => s !== name));
    } else {
      setSelectedStops([...selectedStops, name]);
    }
  };

  const handleGenerateRoute = () => {
    const validDests = destinations.filter(d => d.coords[0] !== 0);
    if (validDests.length === 0) {
      alert('Please add and select at least one valid destination stop from the suggestions.');
      return;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
    }

    const selectedCoords = validDests.map(d => d.coords);
    const activeStartCoords = (startMode === 'gps' && liveLocation) ? liveLocation : startCoords;
    const allCoords = [activeStartCoords, ...selectedCoords];

    // Format coordinates for OSRM: lon,lat separated by semicolons
    const osrmCoords = allCoords.map(coord => `${coord[1]},${coord[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${osrmCoords}?overview=full&geometries=geojson&steps=true`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          // OSRM returns coordinates in [lon, lat] format, convert to [lat, lon]
          const routeCoords = data.routes[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
          
          if (routeLineRef.current) {
            map.removeLayer(routeLineRef.current);
          }
          
          const polyline = L.polyline(routeCoords, { color: '#2563EB', weight: 5, opacity: 0.85 }).addTo(map);
          routeLineRef.current = polyline;
          map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

          const distanceKm = (data.routes[0].distance / 1000).toFixed(1);
          const durationMins = (data.routes[0].duration / 60).toFixed(0);

          // Parse turn-by-turn instructions
          const stepsList: { text: string; distance: number }[] = [];
          if (data.routes[0].legs) {
            data.routes[0].legs.forEach((leg: any, legIdx: number) => {
              const destinationStopName = validDests[legIdx]?.name || 'Customer Stop';
              stepsList.push({ text: `Leg ${legIdx + 1}: Travel to ${destinationStopName}`, distance: leg.distance });
              if (leg.steps) {
                leg.steps.forEach((step: any) => {
                  const type = step.maneuver.type || 'drive';
                  const modifier = step.maneuver.modifier ? ` ${step.maneuver.modifier}` : '';
                  const street = step.name ? ` onto ${step.name}` : '';
                  const text = `${type}${modifier}${street}`;
                  stepsList.push({
                    text: text.charAt(0).toUpperCase() + text.slice(1),
                    distance: step.distance
                  });
                });
              }
            });
          }

          setActiveRoute({
            totalDistance: `${distanceKm} km`,
            estDuration: `${durationMins} mins`,
            tollCost: `₹${validDests.length * 40}`,
            steps: stepsList
          });
        } else {
          throw new Error('OSRM returned invalid route status');
        }
      })
      .catch(err => {
        console.warn('Falling back to straight-line routing:', err);
        const polyline = L.polyline(allCoords, { color: '#2563EB', weight: 4, opacity: 0.8 }).addTo(map);
        routeLineRef.current = polyline;
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

        setActiveRoute({
          totalDistance: `${(validDests.length * 12.4).toFixed(1)} km`,
          estDuration: `${(validDests.length * 20).toFixed(0)} mins`,
          tollCost: `₹${validDests.length * 40}`,
          steps: [
            { text: 'Start from Headquarters / Live GPS Position', distance: 0 },
            ...validDests.map(stop => ({ text: `Proceed to customer destination: ${stop.name}`, distance: 12400 }))
          ]
        });
      });
  };

  const handleStartSimulation = () => {
    if (!routeLineRef.current) return;
    setIsSimulating(true);
    const map = mapInstanceRef.current;
    const latlngs = routeLineRef.current.getLatLngs();

    if (simMarkerRef.current) {
      map.removeLayer(simMarkerRef.current);
    }

    const truckHtml = `<div style="background-color: #10B981; padding: 4px; border-radius: 4px; border: 1px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 10px; font-weight: bold;">🚛</div>`;
    const truckIcon = L.divIcon({
      html: truckHtml,
      className: 'sim-truck',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    const marker = L.marker(latlngs[0], { icon: truckIcon }).addTo(map);
    simMarkerRef.current = marker;

    let index = 0;
    // Dynamically adjust step size and interval delay based on total coordinate count
    const stepSize = Math.max(1, Math.floor(latlngs.length / 100));
    const delayMs = latlngs.length > 50 ? 50 : 250;

    const interval = setInterval(() => {
      if (index >= latlngs.length - 1) {
        clearInterval(interval);
        setIsSimulating(false);
        alert('Simulation finished! Route successfully traversed.');
        return;
      }
      index = Math.min(index + stepSize, latlngs.length - 1);
      marker.setLatLng(latlngs[index]);
    }, delayMs);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'User', text: chatInput };
    setChatLog(prev => [...prev, userMessage]);
    const promptText = chatInput;
    setChatInput('');

    // Fetch from LEI Routes AI Copilot API
    fetch('http://127.0.0.1:3000/api/routes/ai-copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.summary) {
          const aiResponse = `${data.summary.stopsCount} stops optimized. Total Distance: ${data.summary.distanceKm} km. ETA: ${data.summary.durationHours} hours. Tolls: ₹${data.summary.tollCost || 0}.`;
          setChatLog(prev => [...prev, { sender: 'AI', text: aiResponse }]);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        // Fallback to local mock response
        setTimeout(() => {
          let aiText = "I have reviewed your dispatch request. Let's optimize routes through South Delhi hub, selecting Connaught Place and Okhla to save up to 4.2 km in travel distance.";
          if (promptText.toLowerCase().includes('south')) {
            aiText = "Optimal Route for South Delhi Hub is: Origin HQ -> Okhla Phase 3 -> Connaught Place. Total ETA is 35 minutes with normal traffic flows.";
          }
          setChatLog(prev => [...prev, { sender: 'AI', text: aiText }]);
        }, 600);
      });
  };

  // Dynamically extract unique cities from stops
  const uniqueCities = Array.from(new Set(customerStops.map(stop => stop.city || 'Delhi')));

  // Filter stops by selected city and compute distances
  const filteredStops = customerStops
    .filter(stop => selectedCity === 'all' || (stop.city || 'Delhi').toLowerCase() === selectedCity.toLowerCase())
    .map(stop => {
      if (liveLocation) {
        return { ...stop, distance: getDistance(liveLocation, stop.coords) };
      }
      return stop;
    });

  // Sort by distance if liveLocation is set and no stops are explicitly selected
  const displayStops = [...filteredStops];
  if (liveLocation && selectedStops.length === 0) {
    displayStops.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Route Optimization & Tracing</h1>
          <p className="text-sm text-slate-500">Plan and dispatch optimized turn-by-turn routes dynamically utilizing Zoho Books contacts</p>
        </div>
        <button 
          onClick={syncZohoCustomers} 
          disabled={isSyncingZoho}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3.5 py-2.5 rounded-xl active:scale-95 transition-all disabled:opacity-60 border border-blue-200/50"
        >
          <RefreshCw size={14} className={isSyncingZoho ? "animate-spin" : ""} />
          {isSyncingZoho ? 'Syncing Zoho...' : 'Sync Zoho Books'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Controls & Copilot */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Planner Inputs Panel */}
          <div className="p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200"><Compass size={18} className="text-blue-500" /> Route Optimizer</h2>
            </div>

            {/* Starting Point - Mode Selector */}
            <div className="space-y-2.5 relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starting Location</label>
              
              {/* Mode Tabs */}
              <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setStartMode('gps'); handleRequestLiveLocation(); }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all ${
                    startMode === 'gps' ? 'bg-white dark:bg-slate-700 text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Locate size={11} className={isLocating ? "animate-spin" : ""} /> GPS
                </button>
                <button
                  type="button"
                  onClick={() => { setStartMode('address'); setStartPointInput(''); setShowStartSuggestions(false); }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all ${
                    startMode === 'address' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MapPin size={11} /> Address
                </button>
                <button
                  type="button"
                  onClick={() => { setStartMode('customer'); setStartPointInput(''); setShowStartSuggestions(false); }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all ${
                    startMode === 'customer' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Navigation2 size={11} /> Customer
                </button>
              </div>

              {/* GPS Mode */}
              {startMode === 'gps' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  {liveLocation ? (
                    <div className="text-xs text-green-600 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <div>
                        <span className="block">GPS Location Active</span>
                        <span className="text-[10px] text-slate-400 font-medium">{liveLocation[0].toFixed(6)}, {liveLocation[1].toFixed(6)}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRequestLiveLocation}
                      disabled={isLocating}
                      className="w-full py-2 text-xs font-bold text-blue-600 flex items-center justify-center gap-1.5"
                    >
                      <Locate size={14} className={isLocating ? "animate-spin" : ""} />
                      {isLocating ? 'Detecting location...' : 'Click to detect your location'}
                    </button>
                  )}
                </div>
              )}

              {/* Address Mode */}
              {startMode === 'address' && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter address, city, or place name..."
                    value={startPointInput}
                    onChange={(e) => setStartPointInput(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && startPointInput.trim().length >= 3) {
                        setIsGeocodingStart(true);
                        try {
                          const res = await fetch(`http://localhost:5000/zoho/geocode?address=${encodeURIComponent(startPointInput)}`);
                          if (res.ok) {
                            const data = await res.json();
                            if (data.coords && data.coords[0] !== 0) {
                              setStartCoords(data.coords);
                              if (mapInstanceRef.current) {
                                mapInstanceRef.current.setView(data.coords, 13);
                              }
                            }
                          }
                        } catch (err) {
                          console.warn('Address geocoding failed:', err);
                        } finally {
                          setIsGeocodingStart(false);
                        }
                      }
                    }}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl font-semibold text-slate-700 dark:text-slate-200"
                  />
                  {isGeocodingStart && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <RefreshCw size={14} className="animate-spin text-blue-500" />
                    </div>
                  )}
                  <span className="text-[9px] text-slate-400 mt-1 block">Press Enter to set location on map</span>
                </div>
              )}

              {/* Customer Mode */}
              {startMode === 'customer' && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Zoho customer..."
                    value={startPointInput}
                    onChange={(e) => {
                      setStartPointInput(e.target.value);
                      setShowStartSuggestions(true);
                    }}
                    onFocus={() => setShowStartSuggestions(true)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl font-semibold text-slate-700 dark:text-slate-200"
                  />
                  {showStartSuggestions && startPointInput.trim().length >= 3 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 max-h-36 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {isSyncingZoho ? (
                        <div className="px-3 py-2 text-slate-400 italic flex items-center gap-1.5">
                          <RefreshCw size={12} className="animate-spin" /> Syncing Zoho Books...
                        </div>
                      ) : (
                        customerStops
                          .filter(stop => stop.name.toLowerCase().includes(startPointInput.toLowerCase()))
                          .slice(0, 5)
                          .map(stop => (
                            <button
                              key={stop.name}
                              type="button"
                              onClick={async () => {
                                setStartPointInput(stop.name);
                                setStartCoords(stop.coords);
                                setShowStartSuggestions(false);
                                setIsGeocodingStart(true);
                                try {
                                  const res = await fetch(`http://localhost:5000/zoho/customers/${stop.contactId}`);
                                  if (res.ok) {
                                    const details = await res.json();
                                    if (details.coords && details.coords[0] !== 0) {
                                      setStartCoords(details.coords);
                                    }
                                  }
                                } catch (e) {
                                  console.warn('On-demand precise geocoding failed for start point:', e);
                                } finally {
                                  setIsGeocodingStart(false);
                                }
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                            >
                              {stop.name} ({stop.city || 'India'})
                            </button>
                          ))
                      )}
                      {!isSyncingZoho && customerStops.filter(stop => stop.name.toLowerCase().includes(startPointInput.toLowerCase())).length === 0 && (
                        <div className="px-3 py-2 text-slate-400 italic">No customers found</div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowStartSuggestions(false)}
                        className="w-full text-center py-1.5 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-900 font-bold"
                      >
                        Close Suggestions
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Destinations Input Array */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destinations</label>
                <button
                  type="button"
                  onClick={addDestinationField}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md transition-all active:scale-95"
                >
                  <PlusCircle size={12} /> Add Stop
                </button>
              </div>

              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {destinations.map((dest, idx) => (
                  <div key={idx} className="space-y-1 relative border-l-2 border-blue-500/20 pl-2.5 pt-0.5">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[9px] font-bold text-slate-400">Stop #{idx + 1}</span>
                      {destinations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDestinationField(idx)}
                          className="text-red-500 hover:text-red-650 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search Zoho customer..."
                        value={dest.inputVal}
                        onChange={(e) => handleUpdateDestinationInput(idx, e.target.value)}
                        onFocus={() => {
                          const updated = [...destinations];
                          updated[idx].showSuggestions = true;
                          setDestinations(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl font-semibold text-slate-755 dark:text-slate-250"
                      />
                      
                      {dest.showSuggestions && dest.inputVal.trim().length >= 3 && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl shadow-lg z-50 max-h-36 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900 text-xs font-semibold text-slate-650 dark:text-slate-355">
                          {isSyncingZoho ? (
                            <div className="px-3 py-2 text-slate-450 italic flex items-center gap-1.5">
                              <RefreshCw size={12} className="animate-spin" /> Syncing Zoho Books...
                            </div>
                          ) : (
                            customerStops
                              .filter(stop => stop.name.toLowerCase().includes(dest.inputVal.toLowerCase()))
                              .slice(0, 5)
                              .map(stop => (
                                <button
                                  key={stop.name}
                                  type="button"
                                  onClick={() => handleSelectDestinationSuggestion(idx, stop)}
                                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                                >
                                  {stop.name} ({stop.city || 'India'})
                                </button>
                              ))
                          )}
                          {!isSyncingZoho && customerStops.filter(stop => stop.name.toLowerCase().includes(dest.inputVal.toLowerCase())).length === 0 && (
                            <div className="px-3 py-2 text-slate-450 italic">No customers found</div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...destinations];
                              updated[idx].showSuggestions = false;
                              setDestinations(updated);
                            }}
                            className="w-full text-center py-1.5 text-[10px] text-slate-450 bg-slate-50 dark:bg-slate-900 font-bold"
                          >
                            Close Suggestions
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Goal Selection */}
            <div className="space-y-1.5 border-t border-slate-150 dark:border-slate-800/80 pt-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Optimization Metric</label>
              <select
                value={optimizationGoal}
                onChange={(e) => setOptimizationGoal(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl font-semibold text-slate-600 dark:text-slate-300"
              >
                <option value="fastest">Fastest (Avoid Traffic)</option>
                <option value="shortest">Shortest Distance</option>
                <option value="eco">Eco-Friendly (Lowest Carbon)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateRoute}
              disabled={isGeocodingStart || isGeocodingDest || isLocating}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-1.5"
            >
              {(isGeocodingStart || isGeocodingDest) && <RefreshCw size={12} className="animate-spin" />}
              {isGeocodingStart || isGeocodingDest ? 'Resolving Customer Coordinates...' : 'Optimize Route Plan'}
            </button>

            {/* Optimized Output Statistics */}
            {activeRoute && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3.5 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route Metrics</span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Distance</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeRoute.totalDistance}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">ETA</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeRoute.estDuration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Tolls</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeRoute.tollCost}</span>
                  </div>
                </div>

                {/* Assign Vehicle & Driver section */}
                <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assign Dispatch Asset</label>
                  <select
                    value={assignedVehicle}
                    onChange={(e) => setAssignedVehicle(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-lg font-semibold"
                  >
                    <option value="Tata Intra (DL-3C-AS-1294)">Tata Intra (DL-3C-AS-1294) - Amit Kumar</option>
                    <option value="Mahindra Bolero (MH-12-PQ-8830)">Mahindra Bolero (MH-12-PQ-8830) - Suresh Patil</option>
                    <option value="Suzuki Super Carry (KA-03-MM-4112)">Suzuki Super Carry (KA-03-MM-4112) - R. Reddy</option>
                    <option value="Ashok Leyland Dost (HR-26-EE-9912)">Ashok Leyland Dost (HR-26-EE-9912) - Sonu Singh</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleStartSimulation}
                    disabled={isSimulating}
                    className="w-1/2 flex items-center justify-center gap-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-55 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-green-500/10"
                  >
                    <Play size={12} /> {isSimulating ? 'Running...' : 'Simulate'}
                  </button>
                  <button
                    onClick={() => {
                      setDispatchReceipt({
                        manifestId: `MNF-${Math.floor(100000 + Math.random() * 900000)}`,
                        vehicle: assignedVehicle,
                        stops: destinations.map(d => d.name).filter(Boolean),
                        distance: activeRoute.totalDistance,
                        eta: activeRoute.estDuration,
                        timestamp: new Date().toLocaleString()
                      });
                      setShowDispatchModal(true);
                    }}
                    className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-blue-500/15"
                  >
                    Dispatch Run
                  </button>
                </div>

                {/* Turn-by-Turn Directions Dropdown */}
                {activeRoute.steps && activeRoute.steps.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <button
                      onClick={() => setShowDirections(!showDirections)}
                      className="w-full text-left text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
                    >
                      <span>{showDirections ? 'Hide Directions' : 'Show Directions'}</span>
                      <span className="text-[10px] text-slate-400">({activeRoute.steps.length} steps)</span>
                    </button>

                    {showDirections && (
                      <div className="mt-2.5 max-h-36 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-medium text-slate-500 divide-y divide-slate-100 dark:divide-slate-800">
                        {activeRoute.steps.map((step: any, idx: number) => (
                          <div key={idx} className="pt-1.5 flex justify-between gap-1 items-start">
                            <span className={step.text.startsWith('Leg') ? 'font-bold text-slate-700 dark:text-slate-300' : ''}>
                              {step.text}
                            </span>
                            {step.distance > 0 && (
                              <span className="text-slate-400 font-semibold shrink-0">
                                {(step.distance / 1000).toFixed(2)} km
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns (3/4 Screen width): Large Map Rendering Container */}
        <div className="lg:col-span-3 relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[550px] shadow-sm bg-slate-100 dark:bg-slate-900">
          <div id="map-element" className="absolute inset-0 z-10" />

          {/* Map Layer Controls overlay widget */}
          <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-darkcard/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-md flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 flex items-center gap-1"><Layers size={14} /> Map Layer:</span>
            <button onClick={() => setMapLayer('street')} className={`px-2 py-1 rounded-md font-semibold ${mapLayer === 'street' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Street</button>
            <button onClick={() => setMapLayer('satellite')} className={`px-2 py-1 rounded-md font-semibold ${mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Sat</button>
            <button onClick={() => setMapLayer('terrain')} className={`px-2 py-1 rounded-md font-semibold ${mapLayer === 'terrain' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Terrain</button>
            <button onClick={() => setMapLayer('hybrid')} className={`px-2 py-1 rounded-md font-semibold ${mapLayer === 'hybrid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Hybrid</button>
          </div>
        </div>
      </div>

      {/* AI Route Planner Copilot (Stacked in double column grid on bottom or floating) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
        <div className="lg:col-span-1 p-6 bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between h-[300px]">
          <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
            <h2 className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-100"><Sparkles size={16} className="text-blue-500" /> AI Route Copilot</h2>
            
            {/* Messages box */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[11px]">
              {chatLog.map((msg, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl max-w-[90%] ${msg.sender === 'AI' ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 mr-auto' : 'bg-blue-600 text-white ml-auto'}`}>
                  <strong>{msg.sender}:</strong>
                  <p className="mt-0.5">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-2">
            <input
              type="text"
              placeholder="Ask Copilot..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl"
            />
            <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>

      {/* Dispatch Success Manifest Modal */}
      {showDispatchModal && dispatchReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">LEI Engineering Dispatch Manifest</h3>
                <span className="text-xs text-slate-400 font-semibold">{dispatchReceipt.manifestId}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded-full">Dispatched</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Assigned Logistics Asset:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{dispatchReceipt.vehicle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Dispatch Timestamp:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{dispatchReceipt.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Total Distance:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{dispatchReceipt.distance}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Est. Duration (Avoid Traffic):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{dispatchReceipt.eta}</span>
                </div>
              </div>

              {/* Delivery sequence stops list */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sequence Stop Deliveries</span>
                <div className="space-y-1.5 font-semibold text-slate-700 dark:text-slate-350">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Origin HQ / GPS Position</span>
                  </div>
                  {dispatchReceipt.stops.map((stop: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 text-[11px] pl-3 border-l border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-blue-500">{index + 1}.</span>
                      <span>{stop}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code Manifest details */}
              <div className="flex items-center gap-4 p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded flex items-center justify-center p-1 font-bold text-xs shrink-0">
                  {/* Generated QR Mockup */}
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-85">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 4 === 1 ? 'bg-black' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-750 dark:text-slate-250 block text-[11px]">Mobile Dispatch Token</span>
                  <p className="text-[10px] text-slate-400">Driver can scan this code to load this optimized turn-by-turn route directly into their LEI Driver app.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-150 dark:border-slate-800/60">
              <button
                onClick={() => {
                  alert('Manifest details sent to driver mobile app successfully.');
                  setShowDispatchModal(false);
                }}
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Send to Driver App
              </button>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="w-1/3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
