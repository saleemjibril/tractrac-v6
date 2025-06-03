// hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketProps {
  ticketId: string;
  token: string;
  profileId: string;
  onMessage: (message: MessageModel) => void;
  onSystemEvent: (message: MessageModel, profileId: string) => void;
}

export interface MessageModel {
    id?: string;
    message_key: string;
    content?: string;
    message_type: string;
    is_read: boolean;
    created_at: Date;
    updated_at?: Date;
    sender_id: string;
    media_url?: string;
    title?: string;
    status?: string;
  }

export const useWebSocket = ({ ticketId, token, profileId, onMessage, onSystemEvent }: UseWebSocketProps) => {
    console.log("where is my token", token);
    
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = useCallback(() => {
    try {
      if(!!token && !!profileId) {
        const url = `wss://agent-backend-v6.onrender.com/ws/support/customer?token=${token}`;
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          if (data.event === 'connection_established' || data.type === 'welcome') {
            return;
          }

          if (data.type === 'system_event') {
            onSystemEvent(data, profileId);
          } else if(data.sender_id !== profileId) {
                                  console.log('Received particular message:', data);
            const message: MessageModel = {
              ...data,
              createdAt: data.timestamp ? new Date(data.timestamp) : new Date(),
            };
            onMessage(message);
          }
        } catch (error) {
          console.log('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Auto-reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.log('WebSocket error:', error);
        setConnectionError('Connection failed');
        setIsConnected(false);
      };
      }
    } catch (error) {
      console.log('Failed to connect WebSocket:', error);
      setConnectionError('Failed to establish connection');
    }
  }, [token, onMessage, onSystemEvent, profileId]);

  const sendMessage = useCallback((payload: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    } else {
      console.log('WebSocket is not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { isConnected, connectionError, sendMessage, disconnect };
};
