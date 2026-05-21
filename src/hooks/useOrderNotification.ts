import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8001';

export interface OrderNotification {
  orderId: string;
  customerName: string;
  productName: string;
  totalPrice: number;
  paymentMethod: string;
  timestamp: Date;
}

const useOrderNotification = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register_admin');
    });

    socket.on('new_order', (data: OrderNotification) => {
      setNotifications((prev) => [data, ...prev].slice(0, 20));
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markAllRead = () => setUnreadCount(0);

  return { notifications, unreadCount, markAllRead };
};

export default useOrderNotification;
