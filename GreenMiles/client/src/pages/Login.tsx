import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useUser } from '@/context/UserContext';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { login } = useUser();

  const handleGoogleLogin = async () => {
    try {
      // This would normally redirect to Google OAuth
      // For this demo, we'll simulate a successful Google login response
      setIsLoading(true);
      
      // Simulate Google authentication response
      const googleUser = {
        googleId: "123456789",
        email: "user@example.com",
        username: "GreenMilesUser",
        profilePicture: "https://via.placeholder.com/150"
      };
      
      // Send the Google profile to our backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(googleUser),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update user data in cache
        queryClient.setQueryData(['/api/user'], data.user);
        
        // Invalidate queries that might depend on the user
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        
        // Call the login function from UserContext
        login(data.user);
        
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${data.user.username}!`,
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "We couldn't sign you in with Google. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-[#16a34a]/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-[#1e293b]">Login to GreenMiles</CardTitle>
          <CardDescription className="text-[#64748b]">
            Continue your sustainable commuting journey and track your environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full py-6 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center gap-2 shadow-sm"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            )}
            <span className="ml-2">{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            By signing in, you agree to our <a href="#" className="text-[#16a34a] hover:underline">Terms of Service</a> and <a href="#" className="text-[#16a34a] hover:underline">Privacy Policy</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}