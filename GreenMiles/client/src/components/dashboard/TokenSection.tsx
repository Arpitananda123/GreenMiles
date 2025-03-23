import { useState } from 'react';
import { useUser } from "@/context/UserContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface RedemptionOption {
  id: string;
  title: string;
  description: string;
  cost: number;
}

export default function TokenSection() {
  const { tokens, tokenActivity, updateTokens } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real implementation, these would be loaded from the backend
  const redemptionOptions: RedemptionOption[] = [
    {
      id: "elec-discount",
      title: "10% off your next electricity bill",
      description: "Valid for 30 days after redemption",
      cost: 100
    },
    {
      id: "transport-pass",
      title: "Free public transport day pass",
      description: "Valid on all city buses and trams",
      cost: 75
    },
    {
      id: "cafe-discount",
      title: "15% discount at GreenEats Café",
      description: "Valid for one purchase",
      cost: 50
    }
  ];

  const handleRedeem = async (option: RedemptionOption) => {
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
      
      updateTokens(-option.cost);
      
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
    <div className="px-4 pt-8 sm:px-0">
      <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Token Rewards & Redemption</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token Balance Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-base font-semibold text-[#1e293b] mb-4">Your Token Balance</h3>
            <div className="flex justify-center">
              <div className="text-5xl font-bold text-[#f59e0b] font-mono">{tokens}</div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">Available to redeem</p>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Tokens earned this week</span>
                <span className="font-semibold text-[#16a34a] font-mono">+{tokenActivity.earned}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-500">Tokens redeemed this week</span>
                <span className="font-semibold text-gray-700 font-mono">-{tokenActivity.redeemed}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Redemption Options */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden md:col-span-2">
          <div className="p-6">
            <h3 className="text-base font-semibold text-[#1e293b] mb-4">Redeem Your Tokens</h3>
            
            <div className="space-y-4">
              {redemptionOptions.map((option) => (
                <div key={option.id} className="border border-gray-200 rounded-md p-4 hover:border-[#16a34a] hover:bg-[#16a34a]/5 transition-colors cursor-pointer">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-[#1e293b]">{option.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                    <div className="font-bold text-[#f59e0b] font-mono">
                      {option.cost} tokens
                    </div>
                  </div>
                  <div className="mt-4">
                    <button 
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-[#16a34a] text-sm font-medium rounded-md text-[#16a34a] hover:bg-[#16a34a]/10 focus:outline-none"
                      onClick={() => handleRedeem(option)}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
