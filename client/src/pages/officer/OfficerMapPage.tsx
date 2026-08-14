import React, { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertTriangle, Layers, Shield } from 'lucide-react';

export const OfficerMapPage: React.FC = () => {
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      const res = await apiClient.get('/analytics/map-markers');
      if (res.data.success) {
        setMarkers(res.data.markers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCustomIcon = (priority: string) => {
    let color = '#3b82f6';
    if (priority === 'Emergency') color = '#ef4444';
    else if (priority === 'High') color = '#f97316';
    else if (priority === 'Medium') color = '#eab308';

    return L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px ${color};"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col">
        
        {/* Title */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <MapPin className="w-8 h-8 text-indigo-400" /> Interactive GIS City Complaint Map
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time geographic distribution of active citizen complaints</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500"></span> Emergency</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> High</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Low</span>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 w-full h-[600px] rounded-3xl glass-panel border border-white/15 overflow-hidden shadow-2xl relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Loading GIS Map...
            </div>
          ) : (
            <MapContainer
              center={[40.7128, -74.006]}
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
                    <div className="p-2 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
                        <strong className="font-mono text-indigo-400">{m.trackingNumber}</strong>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.priority === 'Emergency' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {m.priority}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-100">{m.summary}</p>
                      <div className="text-[11px] text-slate-400">
                        Category: <strong className="text-slate-200">{m.category}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Location: <span className="text-indigo-300">{m.location}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};
