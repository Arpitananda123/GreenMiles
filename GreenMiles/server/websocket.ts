import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';

interface WebSocketMessage {
  type: string;
  payload: any;
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  console.log('WebSocket server initialized');
  
  // Store connected clients
  const clients: WebSocket[] = [];
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Add to clients list
    clients.push(ws);
    
    // Send initial data
    sendInitialData(ws);
    
    // Handle incoming messages
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
        
        // Handle different message types
        switch (parsedMessage.type) {
          case 'UPDATE_STATION_AVAILABILITY':
            await handleStationAvailabilityUpdate(parsedMessage.payload);
            break;
          default:
            console.log('Unknown message type:', parsedMessage.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
    
    // Setup periodic updates to simulate real-time changes
    setupPeriodicUpdates();
  });
  
  // Function to send initial data to client
  async function sendInitialData(ws: WebSocket) {
    try {
      // Send charging stations
      const stations = await storage.getChargingStations();
      
      ws.send(JSON.stringify({
        type: 'INIT_STATIONS',
        payload: stations.map(station => ({
          id: station.id,
          name: station.name,
          latitude: parseFloat(station.latitude.toString()),
          longitude: parseFloat(station.longitude.toString()),
          renewablePercentage: station.renewablePercentage,
          available: station.available,
          energySource: station.energySource
        }))
      }));
      
      // Send routes
      const routes = await storage.getRoutes();
      
      ws.send(JSON.stringify({
        type: 'INIT_ROUTES',
        payload: routes.map(route => ({
          id: route.id,
          name: route.name,
          type: route.type,
          startLocation: route.startLocation,
          endLocation: route.endLocation,
          renewablePercentage: route.renewablePercentage,
          co2Saved: parseFloat(route.co2Saved.toString()),
          tokens: route.tokens
        }))
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }
  
  // Function to broadcast message to all connected clients
  function broadcast(message: WebSocketMessage) {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  // Function to handle station availability updates
  async function handleStationAvailabilityUpdate({ stationId, available }: { stationId: number, available: boolean }) {
    try {
      const updatedStation = await storage.updateChargingStationAvailability(stationId, available);
      
      if (updatedStation) {
        broadcast({
          type: 'STATION_AVAILABILITY_UPDATED',
          payload: {
            id: updatedStation.id,
            available: updatedStation.available
          }
        });
      }
    } catch (error) {
      console.error('Error updating station availability:', error);
    }
  }
  
  // Function to simulate real-time changes for demo purposes
  function setupPeriodicUpdates() {
    // Randomly update station availability every 30 seconds
    setInterval(async () => {
      try {
        const stations = await storage.getChargingStations();
        
        if (stations.length > 0) {
          // Select a random station
          const randomIndex = Math.floor(Math.random() * stations.length);
          const station = stations[randomIndex];
          
          // Toggle availability
          const newAvailability = !station.available;
          
          // Update the station
          const updatedStation = await storage.updateChargingStationAvailability(station.id, newAvailability);
          
          if (updatedStation) {
            broadcast({
              type: 'STATION_AVAILABILITY_UPDATED',
              payload: {
                id: updatedStation.id,
                available: updatedStation.available
              }
            });
            
            console.log(`Station ${updatedStation.id} availability updated to ${updatedStation.available}`);
          }
        }
      } catch (error) {
        console.error('Error in periodic update:', error);
      }
    }, 30000); // Every 30 seconds
    
    // Periodically update renewable energy percentages
    setInterval(async () => {
      try {
        const stations = await storage.getChargingStations();
        
        if (stations.length > 0) {
          // Select a random station
          const randomIndex = Math.floor(Math.random() * stations.length);
          const station = stations[randomIndex];
          
          // Random fluctuation in renewable percentage (-5% to +5%)
          const fluctuation = Math.floor(Math.random() * 11) - 5;
          let newPercentage = station.renewablePercentage + fluctuation;
          
          // Keep within bounds
          newPercentage = Math.max(30, Math.min(95, newPercentage));
          
          // Update the station (would need to add this method to storage)
          // For now, just broadcast the update
          broadcast({
            type: 'STATION_RENEWABLE_UPDATED',
            payload: {
              id: station.id,
              renewablePercentage: newPercentage
            }
          });
          
          console.log(`Station ${station.id} renewable percentage updated to ${newPercentage}%`);
        }
      } catch (error) {
        console.error('Error in renewable update:', error);
      }
    }, 60000); // Every 60 seconds
  }

  return wss;
}
