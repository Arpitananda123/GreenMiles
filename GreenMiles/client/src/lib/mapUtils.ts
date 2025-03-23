// Calculate distance between two coordinates (in kilometers)
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 100) / 100;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Calculate CO2 savings based on distance and transport type
export function calculateCO2Savings(
  distance: number, 
  transportType: 'bus' | 'tram' | 'ev' | 'walking',
  renewablePercentage: number
): number {
  // Average car emissions: ~120g CO2 per km
  const carEmissions = distance * 0.12; // in kg
  
  // Different transport emissions per km (in kg)
  const transportEmissions = {
    bus: 0.05, // 50g per km
    tram: 0.03, // 30g per km
    ev: 0.02,  // 20g per km when charging from grid
    walking: 0  // No emissions
  };
  
  // Calculate emissions for the selected transport
  let transportEmission = distance * transportEmissions[transportType];
  
  // Apply renewable energy reduction
  transportEmission = transportEmission * (1 - (renewablePercentage / 100));
  
  // CO2 saved = car emissions - transport emissions
  const saved = carEmissions - transportEmission;
  
  // Round to 1 decimal place
  return Math.round(saved * 10) / 10;
}

// Calculate tokens based on CO2 savings and renewable percentage
export function calculateTokens(
  co2Saved: number, 
  renewablePercentage: number
): number {
  // Base calculation: 10 tokens per kg of CO2 saved
  let tokens = co2Saved * 10;
  
  // Bonus for high renewable percentage
  if (renewablePercentage >= 75) {
    tokens *= 1.5; // 50% bonus
  } else if (renewablePercentage >= 50) {
    tokens *= 1.2; // 20% bonus
  }
  
  // Round to nearest integer
  return Math.round(tokens);
}

// Find nearest charging stations to a given location
export function findNearestStations(
  lat: number,
  lon: number,
  stations: Array<{
    id: string;
    name: string;
    position: [number, number];
    renewablePercentage: number;
    available: boolean;
  }>,
  limit: number = 3
) {
  return stations
    .map(station => ({
      ...station,
      distance: calculateDistance(lat, lon, station.position[0], station.position[1])
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
