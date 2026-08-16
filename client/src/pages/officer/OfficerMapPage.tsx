import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  BrainCircuit,
  LayoutDashboard,
  BarChart3,
  History,
  Bell,
  Settings,
  Search,
  User,
  MapPin,
  Map as MapIcon,
  ShieldAlert
} from 'lucide-react';

export const OfficerMapPage: React.FC = () => {
  const { user } = useAuth();
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/map-markers');
      if (res.data.success) {
        setMarkers(res.data.markers || []);
      }
    } catch (err) {
      console.error('Failed to fetch GIS markers', err);
    } finally {
      setLoading(false);
    }
  };

  const createCustomIcon = (priority: string) => {
    let color = '#5E4075';
    if (priority === 'Emergency' || priority === 'Critical') color = '#ef4444';
    else if (priority === 'High') color = '#f97316';
    else if (priority === 'Medium') color = '#eab308';

    return L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 10px ${color};"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CivicAI</span>
          </Link>

          <nav className="space-y-1">
            <Link
              to="/officer/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              to="/officer/map"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <MapIcon className="w-4 h-4" /> Live Map
            </Link>
            <Link
              to="/officer/analysis"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Analysis
            </Link>
            <Link
              to="/officer/history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <History className="w-4 h-4" /> History
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Ganga'}</h4>
            <p className="text-[10px] text-white/70 truncate">{user?.department || 'Department Officer'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">GIS Interactive City Map</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search map locations..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-4 flex flex-col flex-1">
          {/* CONTROL & LEGEND BAR */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-extrabold text-[#1F2937] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5E4075]" /> Dynamic Spatial Distribution
              </h2>
              <p className="text-xs text-[#6B7280]">Real-time geotagged complaint locations</p>
            </div>

            {/* PRIORITY LEGEND */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span> Emergency
              </span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> High
              </span>
              <span className="flex items-center gap-1.5 text-yellow-600">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Medium
              </span>
              <span className="flex items-center gap-1.5 text-[#5E4075]">
                <span className="w-3 h-3 rounded-full bg-[#5E4075]"></span> Low
              </span>
            </div>
          </div>

          {/* MAP CANVAS CONTAINER */}
          <div className="w-full h-[600px] rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs relative">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-xs font-semibold">
                Loading GIS Map Data...
              </div>
            ) : (
              <MapContainer
                center={[13.0827, 80.2707]} // Default map center (e.g. Chennai)
                zoom={12}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {markers.map((m) => (
                  <Marker
                    key={m.id}
                    position={[m.lat, m.lng]}
                    icon={createCustomIcon(m.priority)}
                  >
                    <Popup>
                      <div className="p-1 space-y-1.5 text-xs font-sans">
                        <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] pb-1">
                          <strong className="font-mono text-[#5E4075]">{m.trackingNumber}</strong>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              m.priority === 'Emergency'
                                ? 'bg-rose-500 text-white'
                                : 'bg-purple-100 text-[#5E4075]'
                            }`}
                          >
                            {m.priority}
                          </span>
                        </div>
                        <p className="font-bold text-[#1F2937] text-xs">{m.summary}</p>
                        <div className="text-[11px] text-[#6B7280]">
                          Category: <strong className="text-[#1F2937]">{m.category}</strong>
                        </div>
                        <div className="text-[11px] text-[#6B7280]">
                          Location: <span className="text-[#5E4075] font-semibold">{m.location}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};