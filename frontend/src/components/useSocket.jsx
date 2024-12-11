import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const backendBaseUrl = "http://localhost:7000";

// Create Context
const SocketContext = createContext();

// Provider Component
export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers,setOnlineUsers]=useState([]);


  useEffect(() => {
    console.log("User state updated:", user);
}, [user]);


useEffect(() => {
  console.log("Online users updated:");
  if (onlineUsers.length > 0) {
    console.log(onlineUsers);
  }
}, [onlineUsers]);

useEffect(() => {
  if (user) {
    connectSocket();
  }
}, [user]);

  // Connect Socket
  const connectSocket = () => {

    if (!user?.userId) {
      console.error("Cannot connect socket: User ID is not available.");
      return;
    }



    if (socket?.connected) {
      console.log("Socket is already connected.");
      return;
    }

    const newSocket = io(backendBaseUrl,{
      query:{
        userId:user?.userId,
      }
    });

    // newSocket.connect();

    console.log("Connecting socket...");

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });

    
    newSocket.on("getOnlineUsers",(userIds) => {
      // setOnlineUsers(userIds);
      setOnlineUsers([...new Set(userIds)]);
    })
    
    setSocket(newSocket); // Set the new socket reference

    // return () => {
    //   newSocket.off("getOnlineUsers");
    // };


  };

  // Disconnect Socket
  const disconnectSocket = () => {
    if (socket?.connected) {
      console.log("Disconnecting socket:", socket.id);
      socket.disconnect();
      console.log("Socket disconnected successfully.");
    } else {
      console.log("Socket is not connected or already null.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket?.connected) {
        console.log("Cleaning up socket during unmount.");
        disconnectSocket();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        user,
        setUser,
        socket,
        onlineUsers,
        setOnlineUsers,  
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Hook for consuming context
export const useSocket = () => useContext(SocketContext);
