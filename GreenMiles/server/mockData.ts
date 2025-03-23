import { User, Route, ChargingStation, TokenTransaction, ImpactActivity, RedemptionOption } from "@shared/schema";

// Mock Users
export const mockUsers: Omit<User, 'id'>[] = [
  {
    username: "Priya",
    password: "password123", // In a real application, this would be hashed
    role: "commuter",
    tokens: 235,
    co2Saved: "42.8",
    energySaved: "86",
    createdAt: new Date()
  },
  {
    username: "BusinessUser",
    password: "business123",
    role: "business",
    tokens: 0,
    co2Saved: "0",
    energySaved: "0",
    createdAt: new Date()
  },
  {
    username: "CityPlanner",
    password: "city123",
    role: "cityPlanner",
    tokens: 0,
    co2Saved: "0",
    energySaved: "0",
    createdAt: new Date()
  }
];

// Mock Routes
export const mockRoutes: Omit<Route, 'id'>[] = [
  {
    name: "Delhi Office Commute Route",
    type: "office",
    startLocation: "Connaught Place",
    endLocation: "Cyber Hub",
    startLat: "28.6289",
    startLng: "77.2091",
    endLat: "28.4957",
    endLng: "77.0881",
    duration: "28 min",
    distance: "3.2",
    renewablePercentage: 80,
    co2Saved: "2.4",
    tokens: 50,
    transportType: "bus",
    transportName: "Green Delhi Bus #42",
    color: "#16a34a",
    createdAt: new Date()
  },
  {
    name: "Mumbai Shopping Route",
    type: "shopping",
    startLocation: "Marine Drive",
    endLocation: "Phoenix Mall",
    startLat: "18.9442",
    startLng: "72.8237",
    endLat: "19.0176",
    endLng: "72.8561",
    duration: "18 min",
    distance: "2.1",
    renewablePercentage: 65,
    co2Saved: "1.8",
    tokens: 30,
    transportType: "tram",
    transportName: "Electric Mumbai Metro",
    color: "#0ea5e9",
    createdAt: new Date()
  },
  {
    name: "Bangalore Tech Park Route",
    type: "leisure",
    startLocation: "MG Road",
    endLocation: "Electronic City",
    startLat: "12.9716",
    startLng: "77.5946",
    endLat: "12.8458",
    endLng: "77.6612",
    duration: "35 min",
    distance: "4.5",
    renewablePercentage: 90,
    co2Saved: "3.2",
    tokens: 65,
    transportType: "bus",
    transportName: "Bangalore EV Bus #17",
    color: "#16a34a",
    createdAt: new Date()
  }
];

// Mock Charging Stations
export const mockChargingStations: Omit<ChargingStation, 'id'>[] = [
  {
    name: "Delhi Solar Station",
    latitude: "28.6139",
    longitude: "77.2090",
    renewablePercentage: 85,
    available: true,
    energySource: "solar",
    createdAt: new Date()
  },
  {
    name: "Mumbai Wind Station",
    latitude: "19.0760",
    longitude: "72.8777",
    renewablePercentage: 65,
    available: true,
    energySource: "wind",
    createdAt: new Date()
  },
  {
    name: "Bangalore Tech Hub Station",
    latitude: "12.9716",
    longitude: "77.5946",
    renewablePercentage: 80,
    available: false,
    energySource: "solar",
    createdAt: new Date()
  },
  {
    name: "Chennai Central Station",
    latitude: "13.0827",
    longitude: "80.2707",
    renewablePercentage: 75,
    available: true,
    energySource: "solar",
    createdAt: new Date()
  },
  {
    name: "Hyderabad Eco Station",
    latitude: "17.3850",
    longitude: "78.4867",
    renewablePercentage: 90,
    available: true,
    energySource: "solar",
    createdAt: new Date()
  }
];

// Mock Token Transactions
export const mockTokenTransactions: Omit<TokenTransaction, 'id'>[] = [
  {
    userId: 1,
    amount: 50,
    description: "Used Green Delhi Bus #42",
    type: "earned",
    createdAt: new Date()
  },
  {
    userId: 1,
    amount: 30,
    description: "Took Mumbai Metro to Phoenix Mall",
    type: "earned",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
  },
  {
    userId: 1,
    amount: -100,
    description: "Redeemed for Tata Power bill discount",
    type: "redeemed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    userId: 1,
    amount: 45,
    description: "Charged EV at Delhi Solar Station",
    type: "earned",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    userId: 1,
    amount: -50,
    description: "Redeemed for Chaayos café discount",
    type: "redeemed",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
  }
];

// Mock Impact Activities
export const mockImpactActivities: Omit<ImpactActivity, 'id'>[] = [
  {
    userId: 1,
    title: "Used Green Delhi Bus #42",
    description: "Commute to Cyber Hub",
    co2Saved: "2.4",
    energySaved: null,
    icon: "check",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
  },
  {
    userId: 1,
    title: "Charged EV at Delhi Solar Station",
    description: "Near Connaught Place",
    co2Saved: null,
    energySaved: "8.6",
    icon: "bolt",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    userId: 1,
    title: "Optimized route to Phoenix Mall",
    description: "Using Mumbai Metro",
    co2Saved: "1.8",
    energySaved: null,
    icon: "clock",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  }
];

// Mock Redemption Options
export const mockRedemptionOptions: Omit<RedemptionOption, 'id'>[] = [
  {
    title: "10% off your next electricity bill",
    description: "Valid for 30 days after redemption",
    cost: 100,
    category: "utilities",
    active: true
  },
  {
    title: "Free public transport day pass",
    description: "Valid on all city buses and trams",
    cost: 75,
    category: "transport",
    active: true
  },
  {
    title: "15% discount at GreenEats Café",
    description: "Valid for one purchase",
    cost: 50,
    category: "food",
    active: true
  },
  {
    title: "20% off your next electricity bill",
    description: "Valid for 30 days after redemption",
    cost: 180,
    category: "utilities",
    active: true
  },
  {
    title: "50% off weekly transport pass",
    description: "Valid for one week from activation",
    cost: 150,
    category: "transport",
    active: true
  },
  {
    title: "Free delivery on eco-friendly meal",
    description: "From selected restaurants",
    cost: 40,
    category: "food",
    active: true
  }
];
