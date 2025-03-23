import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoleSelector from '@/components/layout/RoleSelector';
import Map from '@/components/ui/map';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ChargingStation {
  id: string;
  name: string;
  position: [number, number];
  renewablePercentage: number;
  available: boolean;
}

interface Route {
  id: string;
  name: string;
  points: Array<[number, number]>;
  startLocation: string;
  endLocation: string;
  startCoord: [number, number];
  endCoord: [number, number];
  co2Saved: number;
  tokens: number;
  color: string;
}

export default function MapPage() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load charging stations and routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationsRes = await apiRequest('GET', '/api/stations', undefined);
        const stationsData = await stationsRes.json();
        setStations(stationsData);

        const routesRes = await apiRequest('GET', '/api/routes', undefined);
        const routesData = await routesRes.json();
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching map data:", error);
        toast({
          title: "Error",
          description: "Failed to load map data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // Prepare markers for the map
  const mapMarkers = [
    // Add charging stations
    ...stations.map(station => ({
      position: station.position,
      type: 'charging' as const,
      info: {
        name: station.name,
        renewablePercentage: station.renewablePercentage,
        available: station.available
      }
    })),
    
    // Add start and end points for the selected route
    ...(selectedRoute ? 
      (() => {
        const route = routes.find(r => r.id === selectedRoute);
        return route ? [
          {
            position: route.startCoord,
            type: 'start' as const
          },
          {
            position: route.endCoord,
            type: 'end' as const
          }
        ] : [];
      })() : [])
  ];

  // Prepare routes for the map
  const mapRoutes = selectedRoute ? 
    (() => {
      const route = routes.find(r => r.id === selectedRoute);
      return route ? [
        {
          points: route.points,
          color: route.color
        }
      ] : [];
    })() : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RoleSelector />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#1e293b]">Interactive Map</h1>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="inline-flex items-center text-[#16a34a] border-[#16a34a]"
                onClick={() => setSelectedRoute(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Selection
              </Button>
              <Button 
                className="inline-flex items-center bg-[#16a34a] hover:bg-[#16a34a]/90"
                onClick={() => {
                  toast({
                    title: "Location Updated",
                    description: "Using your current location to find nearest stations.",
                  });
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use My Location
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Route selection sidebar */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-medium text-[#1e293b] mb-3">Available Routes</h2>
                <div className="space-y-3">
                  {routes.map(route => (
                    <div 
                      key={route.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedRoute === route.id 
                          ? 'bg-[#16a34a]/10 border border-[#16a34a]' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                      onClick={() => setSelectedRoute(route.id)}
                    >
                      <div className="font-medium text-[#1e293b]">{route.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {route.startLocation} to {route.endLocation}
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="text-green-600">{route.co2Saved} kg CO₂ saved</span>
                        <span className="text-[#f59e0b] font-semibold">+{route.tokens} tokens</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-medium text-[#1e293b] mb-3">Charging Stations</h2>
                <div className="space-y-3">
                  {stations.map(station => (
                    <div 
                      key={station.id}
                      className={`p-3 rounded-md bg-gray-50 ${station.available ? 'border-l-4 border-[#0ea5e9]' : 'border-l-4 border-red-500'}`}
                    >
                      <div className="font-medium text-[#1e293b]">{station.name}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-xs ${station.available ? 'text-[#0ea5e9]' : 'text-red-500'}`}>
                          {station.available ? 'Available' : 'In Use'}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          {station.renewablePercentage}% renewable
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map container */}
            <div className="md:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
              <Map 
                center={[20.5937, 78.9629]} // India coordinates
                zoom={5}
                markers={mapMarkers}
                routes={mapRoutes}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
