import { Link, useLocation } from "wouter";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { username, tokens, logout, isAuthenticated } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation('/login');
  };

  return (
    <nav className="bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-xl text-foreground">GreenMiles</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/dashboard" className={`${location === "/dashboard" ? "border-primary text-foreground" : "border-transparent text-foreground/60 hover:border-foreground/30 hover:text-foreground/80"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Dashboard
              </Link>
              <Link href="/map" className={`${location === "/map" ? "border-primary text-foreground" : "border-transparent text-foreground/60 hover:border-foreground/30 hover:text-foreground/80"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Map
              </Link>
              <Link href="/tokens" className={`${location === "/tokens" ? "border-primary text-foreground" : "border-transparent text-foreground/60 hover:border-foreground/30 hover:text-foreground/80"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Tokens
              </Link>
              <Link href="/impact" className={`${location === "/impact" ? "border-primary text-foreground" : "border-transparent text-foreground/60 hover:border-foreground/30 hover:text-foreground/80"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Impact
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-success sm:text-sm font-mono">
                    🌱
                  </span>
                </div>
                <div className="block pl-9 pr-4 py-2 border border-input rounded-md shadow-sm bg-card text-success font-semibold font-mono">
                  {tokens} tokens
                </div>
              </div>
            </div>
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              {/* Theme Toggle Button */}
              <Button
                variant="outline"
                size="icon"
                className="mr-4 rounded-full"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="ml-3 relative">
                    <div>
                      <button type="button" className="bg-card flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" id="user-menu-button">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {username ? username.charAt(0).toUpperCase() : "P"}
                        </div>
                      </button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-foreground"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setLocation('/login')}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
