"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      transports: ["websocket"],
      path: "/api/socket/io",
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10, // Fixed typo
      addTrailingSlash: true
    });

    // Handle connection established
    socketInstance.on("connect", () => {
      console.log(`Socket connected with ID: ${socketInstance.id}`);
      setIsConnected(true);
    });

    // Log and handle errors
    socketInstance.on("connect_error", (err: any) => {
      console.log("Connection Error:", err.message);
      console.log("Error Description:", err.description);
      console.log("Context:", err.context);
    });

    // Handle transport upgrade
    socketInstance.on("connect", () => {
      const transport = socketInstance.io.engine.transport.name;
      console.log(`The initial transport is ${transport}`);

      socketInstance.io.engine.on("upgrade", () => {
        const upgradedTransport = socketInstance.io.engine.transport.name;
        console.log(`Upgraded transport is ${upgradedTransport}`);
      });
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
