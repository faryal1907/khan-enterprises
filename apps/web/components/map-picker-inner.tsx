"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerInnerProps {
  onLocationSelected: (lat: number, lng: number) => void;
  defaultLocation?: [number, number];
}

// Component to handle clicks and display the marker
function LocationMarker({ 
  position, 
  setPosition, 
  onLocationSelected 
}: { 
  position: L.LatLng | null;
  setPosition: (pos: L.LatLng) => void;
  onLocationSelected: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

// Component to handle map view updates
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function MapPickerInner({ onLocationSelected, defaultLocation }: MapPickerInnerProps) {
  const initialCenter: [number, number] = defaultLocation || [31.5204, 74.3587]; // Default to Lahore, Pakistan
  
  const [position, setPosition] = useState<L.LatLng | null>(
    defaultLocation ? new L.LatLng(defaultLocation[0], defaultLocation[1]) : null
  );
  
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(initialCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setErrorMsg("");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        const newPos = new L.LatLng(lat, lon);
        setPosition(newPos);
        setMapCenter([lat, lon]);
        
        onLocationSelected(lat, lon);
      } else {
        setErrorMsg("Location not found. Please try a different search term.");
      }
    } catch (err) {
      setErrorMsg("Failed to search location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    setIsLocating(true);
    setErrorMsg("");
    
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        const newPos = new L.LatLng(lat, lon);
        setPosition(newPos);
        setMapCenter([lat, lon]);
        
        onLocationSelected(lat, lon);
        setIsLocating(false);
      },
      (err) => {
        setErrorMsg("Could not get your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search for an area or landmark..."
            className="flex-1 px-3 py-2 border rounded-md text-sm outline-none focus:border-indigo-500 text-gray-900"
          />
          <button
            type="button"
            onClick={(e) => handleSearch(e)}
            disabled={isSearching}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-1 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isLocating ? "Locating..." : "Use My Location"}
        </button>
      </div>
      
      {errorMsg && (
        <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
      )}

      <div style={{ height: "350px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid #ccc", position: "relative" }}>
        <MapContainer center={initialCenter as any} zoom={13} style={{ height: "100%", width: "100%" }}>
          {/* Using CartoDB Voyager tiles which are in English */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={setPosition}
            onLocationSelected={onLocationSelected} 
          />
          <MapUpdater center={mapCenter} />
        </MapContainer>
        
        {/* Instruction overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-md text-xs font-medium text-gray-700 pointer-events-none z-[1000]">
          Click anywhere on the map to drop a pin
        </div>
      </div>
    </div>
  );
}
