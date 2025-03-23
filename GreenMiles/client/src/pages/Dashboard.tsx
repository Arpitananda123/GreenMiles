import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoleSelector from '@/components/layout/RoleSelector';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import RecommendedRoutes from '@/components/dashboard/RecommendedRoutes';
import MapSection from '@/components/dashboard/MapSection';
import TokenSection from '@/components/dashboard/TokenSection';
import ImpactSection from '@/components/dashboard/ImpactSection';
import AccountSection from '@/components/dashboard/AccountSection';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { userRole, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);
  
  // Fetch necessary data when the dashboard loads
  useEffect(() => {
    // Fetch user data
    queryClient.prefetchQuery({ queryKey: ['/api/user'] });
    
    // Fetch routes
    queryClient.prefetchQuery({ queryKey: ['/api/routes'] });
    
    // Fetch token information
    queryClient.prefetchQuery({ queryKey: ['/api/tokens'] });
    
    // Fetch impact data
    queryClient.prefetchQuery({ queryKey: ['/api/impact'] });
  }, [queryClient]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RoleSelector />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <WelcomeSection />
          
          {userRole === 'commuter' && (
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full mt-6"
            >
              <div className="flex justify-center mb-6">
                <TabsList className="bg-card border border-border">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="account">My Account</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="dashboard" className="mt-0">
                <RecommendedRoutes />
                <MapSection />
                <TokenSection />
                <ImpactSection />
              </TabsContent>
              
              <TabsContent value="account" className="mt-0">
                <AccountSection />
              </TabsContent>
            </Tabs>
          )}
          
          {userRole === 'business' && (
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
                <div className="px-6 py-5">
                  <h2 className="text-lg font-semibold text-foreground">Business Analytics Dashboard</h2>
                  <p className="mt-2 text-foreground/60">
                    View employee commuting patterns, charger usage, and offer incentives through the token system.
                  </p>
                  <div className="mt-4 p-8 bg-secondary/50 rounded-lg flex justify-center items-center">
                    <p className="text-foreground/40">Business analytics visualizations would appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {userRole === 'cityPlanner' && (
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
                <div className="px-6 py-5">
                  <h2 className="text-lg font-semibold text-foreground">City Planning Tools</h2>
                  <p className="mt-2 text-foreground/60">
                    Monitor and optimize public transport routes and charging station placements.
                  </p>
                  <div className="mt-4 p-8 bg-secondary/50 rounded-lg flex justify-center items-center">
                    <p className="text-foreground/40">City planning tools and visualizations would appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
