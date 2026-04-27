import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MapLocation {
  lat: number;
  lng: number;
  label?: string;
  type?: 'user' | 'rider' | 'vendor' | 'destination';
}

interface GoogleMapProps {
  center?: MapLocation;
  zoom?: number;
  markers?: MapLocation[];
  route?: {
    origin: MapLocation;
    destination: MapLocation;
  };
  height?: string;
  className?: string;
  onLocationUpdate?: (location: MapLocation) => void;
}

const GoogleMapFixed: React.FC<GoogleMapProps> = ({
  center = { lat: 19.0760, lng: 72.8777 }, // Default: Mumbai
  zoom = 14,
  markers = [],
  route,
  height = '400px',
  className,
  onLocationUpdate
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
      
      // Get user location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: MapLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              label: 'Your Location',
              type: 'user'
            };
            setUserLocation(location);
            onLocationUpdate?.(location);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            // Use default location
            const defaultLocation: MapLocation = {
              lat: 19.0760,
              lng: 72.8777,
              label: 'Default Location',
              type: 'user'
            };
            setUserLocation(defaultLocation);
            onLocationUpdate?.(defaultLocation);
          }
        );
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onLocationUpdate]);

  const handleGetCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: MapLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: 'Your Location',
            type: 'user'
          };
          setUserLocation(location);
          onLocationUpdate?.(location);
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const getMarkerIcon = (type?: string) => {
    const icons = {
      user: '📍',
      rider: '🛵',
      vendor: '🏪',
      destination: '🎯'
    };
    return icons[type as keyof typeof icons] || icons.user;
  };

  const getMarkerColor = (type?: string) => {
    const colors = {
      user: 'bg-blue-500',
      rider: 'bg-green-500',
      vendor: 'bg-purple-500',
      destination: 'bg-red-500'
    };
    return colors[type as keyof typeof colors] || colors.user;
  };

  // Mock map implementation (in real app, would use Google Maps API)
  return (
    <div className={cn("relative bg-gray-100 rounded-lg overflow-hidden", className)} style={{ height }}>
      {/* Map Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-600" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Mock Map Background */}
      {mapLoaded && (
        <div 
          ref={mapRef}
          className="w-full h-full relative bg-gradient-to-br from-green-50 to-blue-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)' /%3E%3C/svg%3E")`,
          }}
        >
          {/* Route Line (Mock) */}
          {route && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#3B82F6"
                  />
                </marker>
              </defs>
              
              {/* Draw route line */}
              <path
                d={`M ${route.origin.lat * 2} ${route.origin.lng * 2} L ${route.destination.lat * 2} ${route.destination.lng * 2}`}
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* Markers */}
          {markers.map((marker, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${marker.lng * 2}%`,
                top: `${marker.lat * 2}%`,
                zIndex: marker.type === 'user' ? 30 : 20
              }}
            >
              <div className="relative">
                {/* Marker Pin */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg",
                  getMarkerColor(marker.type)
                )}>
                  {getMarkerIcon(marker.type)}
                </div>
                
                {/* Marker Label */}
                {marker.label && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                    {marker.label}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${userLocation.lng * 2}%`,
                top: `${userLocation.lat * 2}%`,
                zIndex: 40
              }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                  {userLocation.label}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        {/* Location Button */}
        <Button
          onClick={handleGetCurrentLocation}
          disabled={loading}
          size="sm"
          className="bg-white shadow-lg hover:bg-gray-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>

        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg p-1 space-y-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
            onClick={() => {/* TODO: Zoom in */}}
          >
            +
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
            onClick={() => {/* TODO: Zoom out */}}
          >
            −
          </Button>
        </div>
      </div>

      {/* Map Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Map Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Center:</span>
                <span className="font-mono">
                  {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoom:</span>
                <span>{zoom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Markers:</span>
                <span>{markers.length + (userLocation ? 1 : 0)}</span>
              </div>
              {route && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="text-green-600">Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleMapFixed;
