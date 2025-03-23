import { useUser } from "@/context/UserContext";

export default function RoleSelector() {
  const { userRole, setUserRole } = useUser();
  
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-3">
          <div className="flex space-x-4">
            <button 
              className={`${userRole === 'commuter' ? 'bg-[#16a34a] text-white' : 'text-gray-700 hover:bg-gray-100'} px-4 py-2 rounded-md text-sm font-medium`}
              onClick={() => setUserRole('commuter')}
            >
              Commuter View
            </button>
            <button 
              className={`${userRole === 'business' ? 'bg-[#16a34a] text-white' : 'text-gray-700 hover:bg-gray-100'} px-4 py-2 rounded-md text-sm font-medium`}
              onClick={() => setUserRole('business')}
            >
              Business View
            </button>
            <button 
              className={`${userRole === 'cityPlanner' ? 'bg-[#16a34a] text-white' : 'text-gray-700 hover:bg-gray-100'} px-4 py-2 rounded-md text-sm font-medium`}
              onClick={() => setUserRole('cityPlanner')}
            >
              City Planner View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
