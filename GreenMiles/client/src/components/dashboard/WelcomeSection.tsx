import { useUser } from "@/context/UserContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function WelcomeSection() {
  const { username, impactStats, isAuthenticated } = useUser();
  const [, setLocation] = useLocation();
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        <div className="px-6 py-5 sm:flex sm:items-center sm:justify-between">
          {isAuthenticated ? (
            <>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Welcome back, {username}!</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  Today is a great day to be sustainable. Your total impact so far:
                </p>
              </div>
              <div className="mt-4 flex sm:mt-0">
                <div className="bg-success/10 px-4 py-2 rounded-md mr-3 dark:bg-success/20">
                  <p className="text-xs text-foreground/60">CO₂ Saved</p>
                  <p className="font-semibold text-success text-lg">{impactStats.co2Saved} kg</p>
                </div>
                <div className="bg-info/10 px-4 py-2 rounded-md dark:bg-info/20">
                  <p className="text-xs text-foreground/60">Energy Saved</p>
                  <p className="font-semibold text-info text-lg">{impactStats.energySaved} kWh</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">Welcome to GreenMiles!</h2>
                <p className="mt-2 text-sm text-foreground/60 max-w-2xl mx-auto">
                  Get ready to transform your commute with sustainable transit options, track your environmental impact, and earn tokens for eco-friendly choices.
                </p>
                <div className="mt-4">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setLocation('/login')}
                  >
                    Sign in with Google
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
