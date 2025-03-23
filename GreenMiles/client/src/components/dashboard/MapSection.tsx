import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import ChargingStation from '@/components/ui/ChargingStation';

export default function MapSection() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFindNearest = () => {
    toast({
      title: "Finding nearest stations",
      description: "Locating charging stations near your current location...",
    });
  };

  const handleFilters = () => {
    toast({
      title: "Filters",
      description: "Filter options would appear here in a production environment.",
    });
  };

  // In a real implementation, these would be dynamically loaded from the backend
  const chargingStations = [
    { id: 'cs1', position: { top: '25%', left: '25%' }, percentage: 85, available: true },
    { id: 'cs2', position: { top: '33%', right: '25%' }, percentage: 65, available: true },
    { id: 'cs3', position: { bottom: '25%', left: '33%' }, percentage: 80, available: false }
  ];

  return (
    <div className="px-4 pt-8 sm:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#1e293b]">Interactive Map</h2>
        <div className="flex space-x-2">
          <button 
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#16a34a] bg-[#16a34a]/10 hover:bg-[#16a34a]/20"
            onClick={handleFindNearest}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find Nearest
          </button>
          <button 
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
            onClick={handleFilters}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className="relative rounded-lg h-[500px] bg-gray-200"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1548345680-f5475ea5df84?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Charging Station Icons */}
          {chargingStations.map(station => (
            <ChargingStation
              key={station.id}
              position={station.position}
              percentage={station.percentage}
              available={station.available}
            />
          ))}
          
          {/* Route Path */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="none">
            <path d="M200,125 Q300,200 400,150 T600,300" fill="none" stroke="#16A34A" strokeWidth="3" strokeDasharray="8 4" />
            <circle cx="200" cy="125" r="8" fill="#16A34A" />
            <circle cx="600" cy="300" r="8" fill="#F59E0B" />
          </svg>
          
          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>
          </div>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
            <div className="text-xs font-semibold mb-2">Map Legend</div>
            <div className="flex items-center mb-1">
              <div className="h-3 w-3 rounded-full bg-[#16a34a] mr-2"></div>
              <span className="text-xs">Solar Powered (75-100%)</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="h-3 w-3 rounded-full bg-[#f59e0b] mr-2"></div>
              <span className="text-xs">Mixed Energy (40-74%)</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-xs">Grid Powered (0-39%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
