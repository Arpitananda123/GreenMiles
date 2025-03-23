import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface ImpactStats {
  co2Saved: number;
  energySaved: number;
  renewablePercentage: number;
  co2Goal: number;
  energyGoal: number;
  renewableGoal: number;
  communityCo2: number;
  communityEnergy: number;
  treesEquivalent: number;
}

export interface TokenActivity {
  earned: number;
  redeemed: number;
}

export interface ImpactActivity {
  id: string;
  title: string;
  time: string;
  impact: string;
  icon: 'check' | 'bolt' | 'clock';
}

interface UserContextProps {
  username: string;
  tokens: number;
  userRole: 'commuter' | 'business' | 'cityPlanner';
  impactStats: ImpactStats;
  tokenActivity: TokenActivity;
  impactActivities: ImpactActivity[];
  setUserRole: (role: 'commuter' | 'business' | 'cityPlanner') => void;
  updateTokens: (amount: number) => void;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>('');
  const [tokens, setTokens] = useState<number>(0);
  const [userRole, setUserRole] = useState<'commuter' | 'business' | 'cityPlanner'>('commuter');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Impact statistics (would be fetched from backend in real app)
  const [impactStats, setImpactStats] = useState<ImpactStats>({
    co2Saved: 42.8,
    energySaved: 86,
    renewablePercentage: 74,
    co2Goal: 50,
    energyGoal: 200,
    renewableGoal: 80,
    communityCo2: 5284,
    communityEnergy: 12450,
    treesEquivalent: 842
  });
  
  // Token activity (would be fetched from backend in real app)
  const [tokenActivity, setTokenActivity] = useState<TokenActivity>({
    earned: 85,
    redeemed: 50
  });
  
  // Impact activities (would be fetched from backend in real app)
  const [impactActivities, setImpactActivities] = useState<ImpactActivity[]>([
    {
      id: "act1",
      title: "Used solar-powered bus #42",
      time: "Yesterday at 8:30 AM",
      impact: "2.4 kg CO₂ saved",
      icon: 'check'
    },
    {
      id: "act2",
      title: "Charged EV at renewable station",
      time: "3 days ago",
      impact: "8.6 kWh from solar energy",
      icon: 'bolt'
    },
    {
      id: "act3",
      title: "Optimized route to shopping mall",
      time: "Last week",
      impact: "1.8 kg CO₂ saved",
      icon: 'clock'
    }
  ]);
  
  // Fetch user data from API (using react-query)
  const { data: userData } = useQuery({
    queryKey: ['/api/user'],
    initialData: {
      username: 'Priya',
      tokens: 235,
      impactStats: impactStats,
      tokenActivity: tokenActivity,
      impactActivities: impactActivities
    }
  });
  
  // Update state when user data changes
  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setTokens(userData.tokens);
      setImpactStats(userData.impactStats);
      setTokenActivity(userData.tokenActivity);
      setImpactActivities(userData.impactActivities);
    }
  }, [userData]);
  
  // Function to update token balance
  const updateTokens = (amount: number) => {
    setTokens(prevTokens => prevTokens + amount);
    
    // Update token activity based on whether tokens were earned or spent
    if (amount > 0) {
      setTokenActivity(prev => ({
        ...prev,
        earned: prev.earned + amount
      }));
    } else {
      setTokenActivity(prev => ({
        ...prev,
        redeemed: prev.redeemed - amount // amount is negative, so we negate it
      }));
    }
  };
  
  // Function to handle user login
  const login = (userData: any) => {
    setUsername(userData.username || userData.name || '');
    setTokens(userData.tokens || 235); // Default tokens for demo
    setUserRole(userData.role || 'commuter');
    setIsAuthenticated(true);
    
    // For demo purposes, initialize with default stats if not provided
    if (userData.impactStats) {
      setImpactStats(userData.impactStats);
    }
    
    if (userData.tokenActivity) {
      setTokenActivity(userData.tokenActivity);
    }
    
    if (userData.impactActivities) {
      setImpactActivities(userData.impactActivities);
    }
  };
  
  // Function to handle user logout
  const logout = () => {
    setUsername('');
    setTokens(0);
    setUserRole('commuter');
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider 
      value={{ 
        username, 
        tokens, 
        userRole, 
        impactStats, 
        tokenActivity, 
        impactActivities,
        setUserRole,
        updateTokens,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
