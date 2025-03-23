import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocketServer } from "./websocket";
import { insertUserSchema, googleUserSchema, insertRouteSchema, insertChargingStationSchema, insertTokenTransactionSchema, insertRedemptionOptionSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Error handler middleware for Zod validation errors
  const handleZodError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      res.status(400).json({ message: validationError.message });
    } else if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  };

  // Setup websocket server for real-time updates
  setupWebSocketServer(httpServer);

  //*** User Routes ***//

  // Get current user data with stats
  app.get("/api/user", async (req, res) => {
    try {
      // For demo, always return the first user (Priya)
      const user = await storage.getUserWithStats(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Create a new user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Google login/signup
  app.post("/api/auth/google", async (req, res) => {
    try {
      const userData = googleUserSchema.parse(req.body);
      
      // Check if user already exists by googleId
      let user = await storage.getUserByGoogleId(userData.googleId);
      
      // If user not found by googleId, check by email
      if (!user && userData.email) {
        user = await storage.getUserByEmail(userData.email);
      }
      
      // If user exists, update their googleId and profile info if needed
      if (user) {
        // Here we would update the user with the latest Google profile info
        // For now we'll just return the existing user
        return res.json({
          success: true,
          user: await storage.getUserWithStats(user.id)
        });
      }
      
      // Create a new user with Google profile
      const newUser = await storage.createUser({
        ...userData,
        password: null,
        role: "commuter"
      });
      
      res.status(201).json({
        success: true,
        user: await storage.getUserWithStats(newUser.id)
      });
    } catch (err) {
      handleZodError(err, res);
    }
  });

  //*** Route Routes ***//

  // Get all recommended routes
  app.get("/api/routes", async (_, res) => {
    try {
      const routes = await storage.getRoutes();
      
      // Format routes for frontend consumption
      const formattedRoutes = routes.map(route => ({
        id: route.id.toString(),
        name: route.name,
        type: route.type,
        eta: "8:45 AM", // This would be calculated dynamically in a real app
        duration: route.duration,
        renewablePercentage: route.renewablePercentage,
        tokens: route.tokens,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        transportType: route.transportType,
        transportName: route.transportName,
        co2Saved: parseFloat(route.co2Saved.toString()),
        color: route.color,
        startCoord: [parseFloat(route.startLat.toString()), parseFloat(route.startLng.toString())] as [number, number],
        endCoord: [parseFloat(route.endLat.toString()), parseFloat(route.endLng.toString())] as [number, number],
        points: generateRoutePoints(
          [parseFloat(route.startLat.toString()), parseFloat(route.startLng.toString())],
          [parseFloat(route.endLat.toString()), parseFloat(route.endLng.toString())]
        ),
        selected: false
      }));
      
      res.json(formattedRoutes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  // Select a route
  app.post("/api/routes/select", async (req, res) => {
    try {
      const { routeId } = z.object({
        routeId: z.string()
      }).parse(req.body);
      
      // For demo, always use user ID 1 (Priya)
      const userId = 1;
      
      // Create a selected route entry
      const selectedRoute = await storage.selectRoute({
        userId,
        routeId: parseInt(routeId)
      });
      
      res.status(201).json({ success: true, selectedRoute });
    } catch (err) {
      handleZodError(err, res);
    }
  });

  //*** Charging Station Routes ***//

  // Get all charging stations
  app.get("/api/stations", async (_, res) => {
    try {
      const stations = await storage.getChargingStations();
      
      // Format stations for frontend consumption
      const formattedStations = stations.map(station => ({
        id: station.id.toString(),
        name: station.name,
        position: [parseFloat(station.latitude.toString()), parseFloat(station.longitude.toString())] as [number, number],
        renewablePercentage: station.renewablePercentage,
        available: station.available,
        energySource: station.energySource
      }));
      
      res.json(formattedStations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch charging stations" });
    }
  });

  // Update charging station availability
  app.patch("/api/stations/:id/availability", async (req, res) => {
    try {
      const { id } = req.params;
      const { available } = z.object({
        available: z.boolean()
      }).parse(req.body);
      
      const updatedStation = await storage.updateChargingStationAvailability(parseInt(id), available);
      
      if (!updatedStation) {
        return res.status(404).json({ message: "Charging station not found" });
      }
      
      res.json(updatedStation);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  //*** Token Routes ***//

  // Get token transactions for a user
  app.get("/api/tokens", async (req, res) => {
    try {
      // For demo, always use user ID 1 (Priya)
      const userId = 1;
      
      const transactions = await storage.getTokenTransactionsByUser(userId);
      res.json(transactions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch token transactions" });
    }
  });

  // Redeem tokens for a reward
  app.post("/api/tokens/redeem", async (req, res) => {
    try {
      const { optionId, cost } = z.object({
        optionId: z.string(),
        cost: z.number().positive()
      }).parse(req.body);
      
      // For demo, always use user ID 1 (Priya)
      const userId = 1;
      
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has enough tokens
      if (user.tokens < cost) {
        return res.status(400).json({ message: "Insufficient tokens" });
      }
      
      // Get the redemption option
      const option = await storage.getRedemptionOption(parseInt(optionId));
      if (!option) {
        return res.status(404).json({ message: "Redemption option not found" });
      }
      
      // Create a token transaction (negative amount for redemption)
      const transaction = await storage.createTokenTransaction({
        userId,
        amount: -cost,
        description: `Redeemed for: ${option.title}`,
        type: "redeemed"
      });
      
      res.status(201).json({ success: true, transaction });
    } catch (err) {
      handleZodError(err, res);
    }
  });

  //*** Impact Routes ***//

  // Get impact data for a user
  app.get("/api/impact", async (req, res) => {
    try {
      // For demo, always use user ID 1 (Priya)
      const userId = 1;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const activities = await storage.getImpactActivitiesByUser(userId);
      
      const impactData = {
        co2Saved: parseFloat(user.co2Saved.toString()),
        energySaved: parseFloat(user.energySaved.toString()),
        activities: activities.map(a => ({
          id: a.id.toString(),
          title: a.title,
          description: a.description,
          co2Saved: a.co2Saved ? parseFloat(a.co2Saved.toString()) : null,
          energySaved: a.energySaved ? parseFloat(a.energySaved.toString()) : null,
          date: a.createdAt
        }))
      };
      
      res.json(impactData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch impact data" });
    }
  });

  return httpServer;
}

// Helper function to generate route points between two coordinates
function generateRoutePoints(start: [number, number], end: [number, number]): Array<[number, number]> {
  const points: Array<[number, number]> = [start];
  
  // Create a simple curved path
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  
  // Add a random offset to create a curve
  const latOffset = (Math.random() - 0.5) * 0.01;
  const lngOffset = (Math.random() - 0.5) * 0.01;
  
  // Create 3 control points for a basic curve
  points.push([midLat + latOffset, midLng + lngOffset]);
  points.push(end);
  
  return points;
}
