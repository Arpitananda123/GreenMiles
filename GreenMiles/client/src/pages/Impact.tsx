import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoleSelector from '@/components/layout/RoleSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function ImpactPage() {
  const { impactStats, impactActivities } = useUser();
  const [activeTab, setActiveTab] = useState('personal');
  
  // Weekly data for charts (would come from backend in real app)
  const weeklyData = [
    { day: 'Mon', co2: 2.4, energy: 5.2 },
    { day: 'Tue', co2: 1.8, energy: 4.1 },
    { day: 'Wed', co2: 3.2, energy: 6.5 },
    { day: 'Thu', co2: 2.1, energy: 4.8 },
    { day: 'Fri', co2: 2.9, energy: 5.7 },
    { day: 'Sat', co2: 0.8, energy: 2.3 },
    { day: 'Sun', co2: 1.2, energy: 3.0 },
  ];
  
  // Transport mode data (would come from backend in real app)
  const transportData = [
    { name: 'Solar Bus', value: 45, color: '#16a34a' },
    { name: 'Electric Tram', value: 30, color: '#0ea5e9' },
    { name: 'EV Charging', value: 15, color: '#f59e0b' },
    { name: 'Walking', value: 10, color: '#8b5cf6' },
  ];
  
  // Community comparison (would come from backend in real app)
  const comparisonData = [
    { name: 'You', co2: impactStats.co2Saved, energy: impactStats.energySaved },
    { name: 'Avg User', co2: 32.4, energy: 65.2 },
    { name: 'Top 10%', co2: 58.7, energy: 112.3 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RoleSelector />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#1e293b]">Environmental Impact</h1>
            <div className="flex space-x-4">
              <div className="bg-green-50 px-4 py-2 rounded-md">
                <p className="text-xs text-gray-500">CO₂ Saved</p>
                <p className="font-semibold text-[#16a34a] text-lg">{impactStats.co2Saved} kg</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-md">
                <p className="text-xs text-gray-500">Energy Saved</p>
                <p className="font-semibold text-[#0ea5e9] text-lg">{impactStats.energySaved} kWh</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="personal">Personal Impact</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" orientation="left" stroke="#16a34a" />
                        <YAxis yAxisId="right" orientation="right" stroke="#0ea5e9" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="co2" name="CO₂ Saved (kg)" fill="#16a34a" />
                        <Bar yAxisId="right" dataKey="energy" name="Energy Saved (kWh)" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transport Modes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={transportData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {transportData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-auto">
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="community" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="co2" name="CO₂ Saved (kg)" fill="#16a34a" />
                        <Bar dataKey="energy" name="Energy Saved (kWh)" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center">Community CO₂ Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-[#16a34a]">{impactStats.communityCo2.toLocaleString()}</p>
                      <p className="text-gray-500 mt-2">kilograms</p>
                    </div>
                    <div className="text-sm text-center text-gray-500 mt-2">
                      Equivalent to planting {impactStats.treesEquivalent.toLocaleString()} trees
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center">Total Energy Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-[#0ea5e9]">{impactStats.communityEnergy.toLocaleString()}</p>
                      <p className="text-gray-500 mt-2">kilowatt-hours</p>
                    </div>
                    <div className="text-sm text-center text-gray-500 mt-2">
                      Enough to power {Math.round(impactStats.communityEnergy / 30)} homes for a day
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center">Your Contribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-[#f59e0b]">
                        {((impactStats.co2Saved / impactStats.communityCo2) * 100).toFixed(1)}%
                      </p>
                      <p className="text-gray-500 mt-2">of total impact</p>
                    </div>
                    <div className="text-sm text-center text-gray-500 mt-2">
                      You're in the top {comparisonData[0].co2 > comparisonData[1].co2 ? '25%' : '50%'} of contributors
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="detailed" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Impact Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', co2: 22.4, energy: 45.2, renewable: 65 },
                          { month: 'Feb', co2: 28.1, energy: 52.3, renewable: 68 },
                          { month: 'Mar', co2: 32.6, energy: 61.8, renewable: 70 },
                          { month: 'Apr', co2: 36.2, energy: 72.4, renewable: 72 },
                          { month: 'May', co2: 40.5, energy: 81.1, renewable: 74 },
                          { month: 'Jun', co2: 42.8, energy: 86.0, renewable: 74 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="co2" name="CO₂ Saved (kg)" stroke="#16a34a" activeDot={{ r: 8 }} />
                        <Line yAxisId="left" type="monotone" dataKey="energy" name="Energy Saved (kWh)" stroke="#0ea5e9" />
                        <Line yAxisId="right" type="monotone" dataKey="renewable" name="Renewable Energy (%)" stroke="#f59e0b" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>CO₂ Savings Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Public Transport</span>
                          <span className="text-sm font-medium">23.5 kg (55%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#16a34a] h-2 rounded-full" style={{width: '55%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">EV Charging</span>
                          <span className="text-sm font-medium">12.8 kg (30%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#0ea5e9] h-2 rounded-full" style={{width: '30%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Optimized Routes</span>
                          <span className="text-sm font-medium">6.5 kg (15%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#f59e0b] h-2 rounded-full" style={{width: '15%'}}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Renewable Energy Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Solar', value: 45, color: '#f59e0b' },
                              { name: 'Wind', value: 30, color: '#0ea5e9' },
                              { name: 'Hydro', value: 15, color: '#14b8a6' },
                              { name: 'Other', value: 10, color: '#8b5cf6' },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {transportData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
