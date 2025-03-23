let socket: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;
const listeners: Map<string, Set<(data: any) => void>> = new Map();

// Initialize WebSocket connection
export function initializeSocket() {
  if (socket) return; // Already initialized

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log("WebSocket connection established");
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const { type, payload } = data;
      
      // Dispatch to listeners
      const typeListeners = listeners.get(type);
      if (typeListeners) {
        typeListeners.forEach(listener => listener(payload));
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };
  
  socket.onclose = () => {
    console.log("WebSocket connection closed. Reconnecting...");
    socket = null;
    
    // Attempt to reconnect after a delay
    reconnectTimer = setTimeout(() => {
      initializeSocket();
    }, 5000);
  };
  
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    // Socket will attempt to reconnect via the onclose handler
  };
}

// Add event listener
export function addSocketListener(type: string, callback: (data: any) => void) {
  if (!listeners.has(type)) {
    listeners.set(type, new Set());
  }
  
  listeners.get(type)!.add(callback);
  
  // Initialize socket if it's not already
  if (!socket) {
    initializeSocket();
  }
  
  return () => {
    const typeListeners = listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(callback);
      if (typeListeners.size === 0) {
        listeners.delete(type);
      }
    }
  };
}

// Send message via WebSocket
export function sendSocketMessage(type: string, payload: any) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket not connected. Initializing...");
    initializeSocket();
    // Queue the message to be sent when connected
    setTimeout(() => sendSocketMessage(type, payload), 1000);
    return;
  }
  
  socket.send(JSON.stringify({ type, payload }));
}

// Use this to update charging station availability
export function updateStationAvailability(stationId: number, available: boolean) {
  sendSocketMessage('UPDATE_STATION_AVAILABILITY', { stationId, available });
}

// Cleanup function to close the WebSocket connection
export function closeSocketConnection() {
  if (socket) {
    socket.close();
    socket = null;
  }
  
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  
  listeners.clear();
}
