import {
  User, InsertUser, users,
  Route, InsertRoute, routes,
  ChargingStation, InsertChargingStation, chargingStations,
  TokenTransaction, InsertTokenTransaction, tokenTransactions,
  ImpactActivity, InsertImpactActivity, impactActivities,
  RedemptionOption, InsertRedemptionOption, redemptionOptions,
  SelectedRoute, InsertSelectedRoute, selectedRoutes
} from "@shared/schema";
import { mockUsers, mockRoutes, mockChargingStations, mockTokenTransactions, mockImpactActivities, mockRedemptionOptions } from "./mockData";

// Define the storage interface with all CRUD operations needed
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(userId: number, amount: number): Promise<User | undefined>;
  getUserWithStats(userId: number): Promise<any | undefined>;

  // Route operations
  getRoutes(): Promise<Route[]>;
  getRoute(id: number): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  // Charging Station operations
  getChargingStations(): Promise<ChargingStation[]>;
  getChargingStation(id: number): Promise<ChargingStation | undefined>;
  createChargingStation(station: InsertChargingStation): Promise<ChargingStation>;
  updateChargingStationAvailability(id: number, available: boolean): Promise<ChargingStation | undefined>;
  
  // Token operations
  createTokenTransaction(transaction: InsertTokenTransaction): Promise<TokenTransaction>;
  getTokenTransactionsByUser(userId: number): Promise<TokenTransaction[]>;
  
  // Impact operations
  createImpactActivity(activity: InsertImpactActivity): Promise<ImpactActivity>;
  getImpactActivitiesByUser(userId: number): Promise<ImpactActivity[]>;
  
  // Redemption options
  getRedemptionOptions(): Promise<RedemptionOption[]>;
  getRedemptionOption(id: number): Promise<RedemptionOption | undefined>;
  createRedemptionOption(option: InsertRedemptionOption): Promise<RedemptionOption>;
  
  // Selected routes
  selectRoute(selection: InsertSelectedRoute): Promise<SelectedRoute>;
  getUserSelectedRoutes(userId: number): Promise<SelectedRoute[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private routes: Map<number, Route>;
  private chargingStations: Map<number, ChargingStation>;
  private tokenTransactions: Map<number, TokenTransaction>;
  private impactActivities: Map<number, ImpactActivity>;
  private redemptionOptions: Map<number, RedemptionOption>;
  private selectedRoutes: Map<number, SelectedRoute>;
  
  private userIdCounter: number;
  private routeIdCounter: number;
  private stationIdCounter: number;
  private transactionIdCounter: number;
  private activityIdCounter: number;
  private optionIdCounter: number;
  private selectionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.routes = new Map();
    this.chargingStations = new Map();
    this.tokenTransactions = new Map();
    this.impactActivities = new Map();
    this.redemptionOptions = new Map();
    this.selectedRoutes = new Map();
    
    this.userIdCounter = 1;
    this.routeIdCounter = 1;
    this.stationIdCounter = 1;
    this.transactionIdCounter = 1;
    this.activityIdCounter = 1;
    this.optionIdCounter = 1;
    this.selectionIdCounter = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock users
    mockUsers.forEach(user => {
      const newUser: User = { ...user, id: this.userIdCounter++ };
      this.users.set(newUser.id, newUser);
    });
    
    // Add mock routes
    mockRoutes.forEach(route => {
      const newRoute: Route = { ...route, id: this.routeIdCounter++ };
      this.routes.set(newRoute.id, newRoute);
    });
    
    // Add mock charging stations
    mockChargingStations.forEach(station => {
      const newStation: ChargingStation = { ...station, id: this.stationIdCounter++ };
      this.chargingStations.set(newStation.id, newStation);
    });
    
    // Add mock token transactions
    mockTokenTransactions.forEach(transaction => {
      const newTransaction: TokenTransaction = { ...transaction, id: this.transactionIdCounter++ };
      this.tokenTransactions.set(newTransaction.id, newTransaction);
    });
    
    // Add mock impact activities
    mockImpactActivities.forEach(activity => {
      const newActivity: ImpactActivity = { ...activity, id: this.activityIdCounter++ };
      this.impactActivities.set(newActivity.id, newActivity);
    });
    
    // Add mock redemption options
    mockRedemptionOptions.forEach(option => {
      const newOption: RedemptionOption = { ...option, id: this.optionIdCounter++ };
      this.redemptionOptions.set(newOption.id, newOption);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = {
      ...insertUser,
      id,
      tokens: 0,
      co2Saved: "0",
      energySaved: "0",
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUserTokens(userId: number, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      tokens: user.tokens + amount
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserWithStats(userId: number): Promise<any | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Get token transactions to calculate weekly activity
    const transactions = await this.getTokenTransactionsByUser(userId);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyTransactions = transactions.filter(
      t => new Date(t.createdAt) >= oneWeekAgo
    );
    
    const earned = weeklyTransactions
      .filter(t => t.type === "earned")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const redeemed = weeklyTransactions
      .filter(t => t.type === "redeemed")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Get impact activities
    const activities = await this.getImpactActivitiesByUser(userId);
    
    // Calculate impact stats
    const co2Saved = parseFloat(user.co2Saved);
    const energySaved = parseFloat(user.energySaved);
    
    return {
      username: user.username,
      tokens: user.tokens,
      impactStats: {
        co2Saved: co2Saved,
        energySaved: energySaved,
        renewablePercentage: 74, // This would be calculated from user's activities
        co2Goal: 50,
        energyGoal: 200,
        renewableGoal: 80,
        communityCo2: 5284,
        communityEnergy: 12450,
        treesEquivalent: 842
      },
      tokenActivity: {
        earned,
        redeemed
      },
      impactActivities: activities.map(a => ({
        id: a.id.toString(),
        title: a.title,
        time: this.formatActivityTime(a.createdAt),
        impact: a.co2Saved ? `${a.co2Saved} kg CO₂ saved` : `${a.energySaved} kWh from renewable energy`,
        icon: a.icon
      })).slice(0, 5) // Get 5 most recent activities
    };
  }

  private formatActivityTime(date: Date): string {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return "Last week";
    }
  }

  // Route operations
  async getRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoute(id: number): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = this.routeIdCounter++;
    const now = new Date();
    
    const route: Route = {
      ...insertRoute,
      id,
      createdAt: now
    };
    
    this.routes.set(id, route);
    return route;
  }

  // Charging Station operations
  async getChargingStations(): Promise<ChargingStation[]> {
    return Array.from(this.chargingStations.values());
  }

  async getChargingStation(id: number): Promise<ChargingStation | undefined> {
    return this.chargingStations.get(id);
  }

  async createChargingStation(insertStation: InsertChargingStation): Promise<ChargingStation> {
    const id = this.stationIdCounter++;
    const now = new Date();
    
    const station: ChargingStation = {
      ...insertStation,
      id,
      createdAt: now
    };
    
    this.chargingStations.set(id, station);
    return station;
  }

  async updateChargingStationAvailability(id: number, available: boolean): Promise<ChargingStation | undefined> {
    const station = await this.getChargingStation(id);
    if (!station) return undefined;
    
    const updatedStation = {
      ...station,
      available
    };
    
    this.chargingStations.set(id, updatedStation);
    return updatedStation;
  }

  // Token operations
  async createTokenTransaction(insertTransaction: InsertTokenTransaction): Promise<TokenTransaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    const transaction: TokenTransaction = {
      ...insertTransaction,
      id,
      createdAt: now
    };
    
    this.tokenTransactions.set(id, transaction);
    
    // Update user token balance
    await this.updateUserTokens(transaction.userId, transaction.amount);
    
    return transaction;
  }

  async getTokenTransactionsByUser(userId: number): Promise<TokenTransaction[]> {
    return Array.from(this.tokenTransactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Impact operations
  async createImpactActivity(insertActivity: InsertImpactActivity): Promise<ImpactActivity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    
    const activity: ImpactActivity = {
      ...insertActivity,
      id,
      createdAt: now
    };
    
    this.impactActivities.set(id, activity);
    
    // Update user impact stats
    const user = await this.getUser(activity.userId);
    if (user) {
      let updateObj: Partial<User> = {};
      
      if (activity.co2Saved) {
        updateObj.co2Saved = (parseFloat(user.co2Saved) + parseFloat(activity.co2Saved.toString())).toString();
      }
      
      if (activity.energySaved) {
        updateObj.energySaved = (parseFloat(user.energySaved) + parseFloat(activity.energySaved.toString())).toString();
      }
      
      this.users.set(user.id, { ...user, ...updateObj });
    }
    
    return activity;
  }

  async getImpactActivitiesByUser(userId: number): Promise<ImpactActivity[]> {
    return Array.from(this.impactActivities.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Redemption options
  async getRedemptionOptions(): Promise<RedemptionOption[]> {
    return Array.from(this.redemptionOptions.values())
      .filter(o => o.active);
  }

  async getRedemptionOption(id: number): Promise<RedemptionOption | undefined> {
    return this.redemptionOptions.get(id);
  }

  async createRedemptionOption(insertOption: InsertRedemptionOption): Promise<RedemptionOption> {
    const id = this.optionIdCounter++;
    
    const option: RedemptionOption = {
      ...insertOption,
      id
    };
    
    this.redemptionOptions.set(id, option);
    return option;
  }

  // Selected routes
  async selectRoute(insertSelection: InsertSelectedRoute): Promise<SelectedRoute> {
    const id = this.selectionIdCounter++;
    const now = new Date();
    
    const selection: SelectedRoute = {
      ...insertSelection,
      id,
      createdAt: now
    };
    
    this.selectedRoutes.set(id, selection);
    
    // Get route to create impact activity and token transaction
    const route = await this.getRoute(selection.routeId);
    const userId = selection.userId;
    
    if (route) {
      // Create token transaction for earning tokens
      await this.createTokenTransaction({
        userId,
        amount: route.tokens,
        description: `Selected route: ${route.name}`,
        type: "earned"
      });
      
      // Create impact activity
      await this.createImpactActivity({
        userId,
        title: `Used ${route.transportName}`,
        description: `From ${route.startLocation} to ${route.endLocation}`,
        co2Saved: route.co2Saved,
        energySaved: null,
        icon: "check"
      });
    }
    
    return selection;
  }

  async getUserSelectedRoutes(userId: number): Promise<SelectedRoute[]> {
    return Array.from(this.selectedRoutes.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

// Create storage instance
export const storage = new MemStorage();
