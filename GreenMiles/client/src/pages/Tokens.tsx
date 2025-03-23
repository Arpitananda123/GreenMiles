import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoleSelector from '@/components/layout/RoleSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface RewardOption {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
}

interface TokenHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'earned' | 'redeemed';
}

export default function TokensPage() {
  const { tokens } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('redeem');
  
  // In a real implementation, these would come from the backend
  const rewardOptions: RewardOption[] = [
    {
      id: "elec-10",
      title: "10% off your next electricity bill",
      description: "Valid for 30 days after redemption",
      cost: 100,
      category: "utilities"
    },
    {
      id: "elec-20",
      title: "20% off your next electricity bill",
      description: "Valid for 30 days after redemption",
      cost: 180,
      category: "utilities"
    },
    {
      id: "transport-pass",
      title: "Free public transport day pass",
      description: "Valid on all city buses and trams",
      cost: 75,
      category: "transport"
    },
    {
      id: "transport-week",
      title: "50% off weekly transport pass",
      description: "Valid for one week from activation",
      cost: 150,
      category: "transport"
    },
    {
      id: "cafe-discount",
      title: "15% discount at GreenEats Café",
      description: "Valid for one purchase",
      cost: 50,
      category: "food"
    },
    {
      id: "food-delivery",
      title: "Free delivery on eco-friendly meal",
      description: "From selected restaurants",
      cost: 40,
      category: "food"
    }
  ];

  const tokenHistory: TokenHistory[] = [
    {
      id: "hist-1",
      date: "Today, 8:45 AM",
      description: "Used solar-powered bus #42",
      amount: 50,
      type: "earned"
    },
    {
      id: "hist-2",
      date: "Yesterday, 5:30 PM",
      description: "Took optimized route to mall",
      amount: 30,
      type: "earned"
    },
    {
      id: "hist-3",
      date: "3 days ago",
      description: "Redeemed for electricity bill discount",
      amount: 100,
      type: "redeemed"
    },
    {
      id: "hist-4",
      date: "Last week",
      description: "Charged EV at solar station",
      amount: 45,
      type: "earned"
    },
    {
      id: "hist-5",
      date: "Last week",
      description: "Redeemed for café discount",
      amount: 50,
      type: "redeemed"
    }
  ];

  const handleRedeem = async (option: RewardOption) => {
    if (tokens < option.cost) {
      toast({
        title: "Insufficient tokens",
        description: `You need ${option.cost - tokens} more tokens to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/tokens/redeem', { 
        optionId: option.id, 
        cost: option.cost 
      });
      
      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens'] });
      
      toast({
        title: "Reward Redeemed",
        description: `You have successfully redeemed: ${option.title}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem tokens. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RoleSelector />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#1e293b]">Token Rewards & Redemption</h1>
            <div className="bg-[#16a34a]/10 px-4 py-2 rounded-md">
              <span className="text-sm text-gray-600">Your Balance:</span>
              <span className="ml-2 text-xl font-bold text-[#16a34a] font-mono">{tokens} tokens</span>
            </div>
          </div>
          
          <Tabs defaultValue="redeem" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="redeem">Redeem Tokens</TabsTrigger>
              <TabsTrigger value="history">Token History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="redeem" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rewardOptions.map(option => (
                  <Card key={option.id} className="overflow-hidden">
                    <CardHeader className="bg-[#16a34a]/5 pb-2">
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-500 mb-4">{option.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[#f59e0b] font-bold">{option.cost} tokens</span>
                        <button 
                          className={`px-4 py-2 rounded-md text-sm font-medium 
                            ${tokens >= option.cost 
                              ? 'bg-[#16a34a] text-white hover:bg-[#16a34a]/90' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                          onClick={() => handleRedeem(option)}
                          disabled={tokens < option.cost}
                        >
                          Redeem
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Your Token Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tokenHistory.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 rounded-md bg-gray-50 border-l-4
                          ${item.type === 'earned' ? 'border-[#16a34a]' : 'border-[#f59e0b]'}"
                      >
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                            ${item.type === 'earned' ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}
                          >
                            {item.type === 'earned' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-[#1e293b]">{item.description}</p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                          </div>
                        </div>
                        <div className={`font-mono font-semibold ${item.type === 'earned' ? 'text-[#16a34a]' : 'text-[#f59e0b]'}`}>
                          {item.type === 'earned' ? '+' : '-'}{item.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
