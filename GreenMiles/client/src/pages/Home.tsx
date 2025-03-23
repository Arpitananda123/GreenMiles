import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [_, setLocation] = useLocation();

  // We've removed the automatic redirect to allow login flow
  // User can now click buttons to navigate

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-[#1e293b] sm:text-5xl sm:tracking-tight lg:text-6xl">
              Welcome to GreenMiles
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Transforming urban commuting into a sustainable, efficient, and rewarding experience.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Button
                className="bg-[#16a34a] hover:bg-[#16a34a]/90 px-8 py-6 text-lg"
                onClick={() => setLocation('/login')}
              >
                Sign in with Google
              </Button>
              <Button
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-8 py-6 text-lg"
                onClick={() => setLocation('/dashboard')}
              >
                Try Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-sm overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-center text-[#1e293b] mb-8">
              Sustainable Urban Commuting Platform
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-gray-100 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#16a34a]/10 text-[#16a34a] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#1e293b]">Route Optimization</h3>
                <p className="mt-2 text-gray-500">AI-driven optimized routes prioritizing renewable energy and efficiency.</p>
              </div>
              
              <div className="text-center p-6 border border-gray-100 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#1e293b]">Token Rewards</h3>
                <p className="mt-2 text-gray-500">Earn and redeem tokens for sustainable commuting choices.</p>
              </div>
              
              <div className="text-center p-6 border border-gray-100 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#1e293b]">Impact Tracking</h3>
                <p className="mt-2 text-gray-500">Monitor your CO₂ savings and positive environmental impact.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
