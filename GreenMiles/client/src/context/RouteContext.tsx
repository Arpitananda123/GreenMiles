import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface Route {
  id: string;
  name: string;
  type: 'office' | 'shopping';
  eta: string;
  duration: string;
  renewablePercentage: number;
  tokens: number;
  startLocation: string;
  endLocation: string;
  transportType: 'bus' | 'tram';
  transportName: string;
  co2Saved: number;
  selected: boolean;
}

interface RouteContextProps {
  recommendedRoutes: Route[];
  selectedRoute: string | null;
  selectRoute: (routeId: string) => void;
}

const RouteContext = createContext<RouteContextProps | undefined>(undefined);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [recommendedRoutes, setRecommendedRoutes] = useState<Route[]>([
    {
      id: "route1",
      name: "Office Commute Route",
      type: "office",
      eta: "8:45 AM",
      duration: "28 min",
      renewablePercentage: 80,
      tokens: 50,
      startLocation: "Home",
      endLocation: "Office",
      transportType: "bus",
      transportName: "Solar Bus #42",
      co2Saved: 2.4,
      selected: false
    },
    {
      id: "route2",
      name: "Shopping Mall Route",
      type: "shopping",
      eta: "5:30 PM",
      duration: "18 min",
      renewablePercentage: 65,
      tokens: 30,
      startLocation: "Office",
      endLocation: "Mall",
      transportType: "tram",
      transportName: "Electric Tram",
      co2Saved: 1.8,
      selected: false
    }
  ]);
  
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  
  // Fetch routes from API (using react-query)
  const { data: routesData } = useQuery({
    queryKey: ['/api/routes'],
    initialData: recommendedRoutes
  });
  
  // Update state when routes data changes
  useEffect(() => {
    if (routesData) {
      setRecommendedRoutes(routesData);
    }
  }, [routesData]);
  
  // Function to select a route
  const selectRoute = (routeId: string) => {
    setSelectedRoute(routeId);
    setRecommendedRoutes(prevRoutes => 
      prevRoutes.map(route => ({
        ...route,
        selected: route.id === routeId
      }))
    );
  };

  return (
    <RouteContext.Provider value={{ recommendedRoutes, selectedRoute, selectRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoutes = () => {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRoutes must be used within a RouteProvider');
  }
  return context;
};
