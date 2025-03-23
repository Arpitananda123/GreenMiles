import { useState } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useUser } from '@/context/UserContext';
import { Separator } from '@/components/ui/separator';

// Form validation schema
const signupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).required();

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useUser();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Call the API to register a new user
      const response = await apiRequest('POST', '/api/users', values);
      const userData = await response.json();
      
      toast({
        title: "Account created successfully",
        description: `Welcome to GreenMiles, ${userData.username}!`,
      });
      
      // Log the user in
      login(userData);
      
      // Redirect to dashboard
      setLocation('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      
      // Show error toast with appropriate message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "We couldn't create your account. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        // Call the login function from UserContext
        login(data.user);
        
        toast({
          title: "Logged in successfully",
          description: `Welcome, ${data.user.username}!`,
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background/50 to-background p-4">
      <Card className="w-full max-w-md shadow-lg border border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Create an Account</CardTitle>
          <CardDescription className="text-foreground/60">
            Join GreenMiles and start your sustainable commuting journey today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          
          <div className="relative flex items-center justify-center mt-4">
            <Separator className="flex-grow" />
            <span className="mx-2 text-sm text-foreground/60">OR</span>
            <Separator className="flex-grow" />
          </div>
          
          <Button 
            className="w-full py-6 bg-card hover:bg-accent text-foreground border border-border flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <span className="ml-2">{isLoading ? 'Signing in...' : 'Sign up with Google'}</span>
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-foreground/60">
            Already have an account? <a href="/login" className="text-primary hover:underline">Log in</a>
          </div>
          <div className="text-sm text-center text-foreground/60">
            By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}