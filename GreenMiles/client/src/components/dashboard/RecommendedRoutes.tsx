import { useRoutes } from "@/context/RouteContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RecommendedRoutes() {
  const { recommendedRoutes, selectRoute } = useRoutes();
  const { toast } = useToast();

  const handleSelectRoute = async (routeId: string) => {
    try {
      await apiRequest('POST', '/api/routes/select', { routeId });
      selectRoute(routeId);
      toast({
        title: "Route Selected",
        description: "Your route has been selected successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select route. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 pt-4 sm:px-0">
      <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Today's Recommended Routes</h2>
      
      {recommendedRoutes.map((route) => (
        <div key={route.id} className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${route.type === 'office' ? 'bg-[#16a34a]/10' : 'bg-[#0ea5e9]/10'} p-2 rounded-full`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 ${route.type === 'office' ? 'text-[#16a34a]' : 'text-[#0ea5e9]'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    {route.type === 'office' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-semibold text-[#1e293b]">{route.name}</h3>
                  <p className="text-sm text-gray-500">
                    ETA: {route.eta} | {route.duration} | {route.renewablePercentage}% renewable energy
                  </p>
                </div>
              </div>
              <div className="font-mono text-[#f59e0b] font-bold">
                +{route.tokens} tokens
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex-shrink-0 h-2 w-2 rounded-full bg-[#16a34a]"></div>
              <div className="ml-2 text-sm text-gray-600">{route.startLocation}</div>
              <div className="mx-2 flex-grow border-t border-dashed border-gray-300"></div>
              <div className={`flex items-center ${route.transportType === 'bus' ? 'bg-blue-50' : 'bg-green-50'} px-2 py-1 rounded-md`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ${route.transportType === 'bus' ? 'text-[#0ea5e9]' : 'text-[#16a34a]'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {route.transportType === 'bus' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  )}
                </svg>
                <span className={`ml-1 text-xs font-semibold ${route.transportType === 'bus' ? 'text-[#0ea5e9]' : 'text-[#16a34a]'}`}>
                  {route.transportName}
                </span>
              </div>
              <div className="mx-2 flex-grow border-t border-dashed border-gray-300"></div>
              <div className="flex-shrink-0 h-2 w-2 rounded-full bg-[#f59e0b]"></div>
              <div className="ml-2 text-sm text-gray-600">{route.endLocation}</div>
            </div>
            <div className="mt-4 flex justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {route.co2Saved} kg CO₂ saved
              </span>
              <button 
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#16a34a]/90 focus:outline-none"
                onClick={() => handleSelectRoute(route.id)}
              >
                Select Route
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
