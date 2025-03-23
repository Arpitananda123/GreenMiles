import { pgTable, text, serial, integer, boolean, numeric, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email").unique(),
  profilePicture: text("profile_picture"),
  googleId: text("google_id").unique(),
  role: text("role").notNull().default("commuter"),
  tokens: integer("tokens").notNull().default(0),
  co2Saved: numeric("co2_saved").notNull().default("0"),
  energySaved: numeric("energy_saved").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  profilePicture: true,
  googleId: true,
  role: true,
});

export const googleUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  profilePicture: true,
  googleId: true,
});

// Routes table
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  startLat: numeric("start_lat").notNull(),
  startLng: numeric("start_lng").notNull(),
  endLat: numeric("end_lat").notNull(),
  endLng: numeric("end_lng").notNull(),
  duration: text("duration").notNull(),
  distance: numeric("distance").notNull(),
  renewablePercentage: integer("renewable_percentage").notNull(),
  co2Saved: numeric("co2_saved").notNull(),
  tokens: integer("tokens").notNull(),
  transportType: text("transport_type").notNull(),
  transportName: text("transport_name").notNull(),
  color: text("color").notNull().default("#16a34a"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

// Charging stations table
export const chargingStations = pgTable("charging_stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  renewablePercentage: integer("renewable_percentage").notNull(),
  available: boolean("available").notNull().default(true),
  energySource: text("energy_source").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChargingStationSchema = createInsertSchema(chargingStations).omit({
  id: true,
  createdAt: true,
});

// Token transactions table
export const tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "earned" or "redeemed"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({
  id: true,
  createdAt: true,
});

// Impact activities table
export const impactActivities = pgTable("impact_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  co2Saved: numeric("co2_saved"),
  energySaved: numeric("energy_saved"),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertImpactActivitySchema = createInsertSchema(impactActivities).omit({
  id: true,
  createdAt: true,
});

// Redemption options table
export const redemptionOptions = pgTable("redemption_options", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  category: text("category").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertRedemptionOptionSchema = createInsertSchema(redemptionOptions).omit({
  id: true,
});

// Selected routes table (to track which routes users have selected)
export const selectedRoutes = pgTable("selected_routes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  routeId: integer("route_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    uniqueUserRoute: uniqueIndex("unique_user_route").on(table.userId, table.routeId),
  };
});

export const insertSelectedRouteSchema = createInsertSchema(selectedRoutes).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export type InsertChargingStation = z.infer<typeof insertChargingStationSchema>;
export type ChargingStation = typeof chargingStations.$inferSelect;

export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;

export type InsertImpactActivity = z.infer<typeof insertImpactActivitySchema>;
export type ImpactActivity = typeof impactActivities.$inferSelect;

export type InsertRedemptionOption = z.infer<typeof insertRedemptionOptionSchema>;
export type RedemptionOption = typeof redemptionOptions.$inferSelect;

export type InsertSelectedRoute = z.infer<typeof insertSelectedRouteSchema>;
export type SelectedRoute = typeof selectedRoutes.$inferSelect;
