import { useUser } from "@/context/UserContext";

interface ImpactActivity {
  id: string;
  title: string;
  time: string;
  impact: string;
  icon: 'check' | 'bolt' | 'clock';
}

export default function ImpactSection() {
  const { impactStats, impactActivities } = useUser();
  
  // Calculate goal percentages
  const co2Percentage = Math.round((impactStats.co2Saved / impactStats.co2Goal) * 100);
  const energyPercentage = Math.round((impactStats.energySaved / impactStats.energyGoal) * 100);
  const renewablePercentage = Math.round((impactStats.renewablePercentage / impactStats.renewableGoal) * 100);

  return (
    <div className="px-4 pt-8 pb-8 sm:px-0">
      <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Your Environmental Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Impact Summary */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-base font-semibold text-[#1e293b] mb-4">Impact Summary</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">CO₂ Emissions Saved</span>
                  <span className="text-sm font-semibold text-[#16a34a]">{impactStats.co2Saved} kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#16a34a] h-2 rounded-full" style={{width: `${co2Percentage}%`}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Goal: {impactStats.co2Goal} kg</span>
                  <span>{co2Percentage}%</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Energy Consumption Reduced</span>
                  <span className="text-sm font-semibold text-[#0ea5e9]">{impactStats.energySaved} kWh</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0ea5e9] h-2 rounded-full" style={{width: `${energyPercentage}%`}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Goal: {impactStats.energyGoal} kWh</span>
                  <span>{energyPercentage}%</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Renewable Energy Used</span>
                  <span className="text-sm font-semibold text-[#f59e0b]">{impactStats.renewablePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#f59e0b] h-2 rounded-full" style={{width: `${renewablePercentage}%`}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Goal: {impactStats.renewableGoal}%</span>
                  <span>{renewablePercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Impact */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden md:col-span-2">
          <div className="p-6">
            <h3 className="text-base font-semibold text-[#1e293b] mb-4">Community Impact</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Your contribution as part of our community</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#16a34a]">{impactStats.communityCo2}</div>
                  <div className="text-xs text-gray-500 mt-1">kg CO₂ saved</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#0ea5e9]">{impactStats.communityEnergy}</div>
                  <div className="text-xs text-gray-500 mt-1">kWh reduced</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#f59e0b]">{impactStats.treesEquivalent}</div>
                  <div className="text-xs text-gray-500 mt-1">trees equivalent</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-[#1e293b] mb-3">Your Recent Impact Activities</h4>
              <div className="space-y-3">
                {impactActivities.map(activity => (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                      ${activity.icon === 'check' ? 'bg-[#16a34a]/10' : 
                        activity.icon === 'bolt' ? 'bg-[#0ea5e9]/10' : 
                        'bg-[#f59e0b]/10'}`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 
                          ${activity.icon === 'check' ? 'text-[#16a34a]' : 
                            activity.icon === 'bolt' ? 'text-[#0ea5e9]' : 
                            'text-[#f59e0b]'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        {activity.icon === 'check' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        ) : activity.icon === 'bolt' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[#1e293b]">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time} • {activity.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
